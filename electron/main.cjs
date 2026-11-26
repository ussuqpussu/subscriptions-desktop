// Обёртка Electron: раздаёт собранное приложение с локального сервера и открывает его в окне.
// Сервер нужен потому, что service worker и синхронизация не работают с file://.
const { app, BrowserWindow, shell, Menu } = require('electron')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

// Этот адрес уже разрешён на сервере синхронизации (ALLOWED_ORIGINS).
const HOST = '127.0.0.1'
const PORT = 4173
const ROOT = path.join(__dirname, '..', 'dist')

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, `http://${HOST}`).pathname)
      let file = path.normalize(path.join(ROOT, urlPath))
      if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return }
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(ROOT, 'index.html')
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
      fs.createReadStream(file).pipe(res)
    })
    server.once('error', reject)
    server.listen(PORT, HOST, () => resolve(server))
  })
}

let win = null

function createWindow() {
  win = new BrowserWindow({
    width: 480, height: 920, minWidth: 380, minHeight: 640,
    backgroundColor: '#000000', title: 'Подписки', autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: { contextIsolation: true, sandbox: true },
  })
  // Ссылки на сайты сервисов открываются в обычном браузере, а не внутри приложения.
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' } })
  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(`http://${HOST}:${PORT}`)) { event.preventDefault(); shell.openExternal(url) }
  })
  win.loadURL(`http://${HOST}:${PORT}/`)
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus() } })
  Menu.setApplicationMenu(null)
  app.whenReady().then(async () => {
    try { await startServer() } catch (error) {
      const { dialog } = require('electron')
      dialog.showErrorBox('Подписки', `Порт ${PORT} занят другой программой. Закройте её и запустите приложение снова.\n\n${error}`)
      app.quit(); return
    }
    createWindow()
  })
  app.on('window-all-closed', () => app.quit())
}
