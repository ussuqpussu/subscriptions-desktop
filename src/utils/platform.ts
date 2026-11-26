/**
 * Где запущено приложение. Одна кодовая база работает и как PWA на телефоне,
 * и как программа для Windows (Electron). Различия собраны здесь.
 */

/** Мост к Electron из electron/preload.cjs. В браузере его нет. */
export interface DesktopBridge {
  getAutostart: () => Promise<boolean>
  setAutostart: (enabled: boolean) => Promise<boolean>
}

declare global {
  interface Window {
    desktop?: DesktopBridge
  }
}

export const isDesktopApp: boolean =
  typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron/')

export const desktopBridge: DesktopBridge | null =
  typeof window !== 'undefined' && window.desktop ? window.desktop : null
