import { ArrowDownDocIcon } from './icons'
import styles from './BackupReminder.module.css'
import { isDesktopApp } from '../utils/platform'

const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)

/** Чем грозит потеря данных — зависит от того, где открыто приложение. */
const RISK_TEXT = isDesktopApp
  ? 'Подписки пропадут при переустановке программы или Windows. Сохраните копию в файл или включите синхронизацию с телефоном.'
  : isIOS
    ? 'iOS удалит подписки, если убрать иконку с экрана «Домой». Сохраните копию или включите синхронизацию.'
    : 'Браузер сотрёт подписки при очистке данных сайта. Сохраните копию или включите синхронизацию.'

interface BackupReminderProps {
  onBackup: () => void
  onSnooze: () => void
}

/** Напоминание о резервной копии: данные живут только на устройстве и пропадут вместе с иконкой. */
export function BackupReminder({ onBackup, onSnooze }: BackupReminderProps) {
  return (
    <section className={`card ${styles.reminder}`} aria-labelledby="backup-reminder-title">
      <h2 id="backup-reminder-title" className={styles.title}>
        Данные только на этом устройстве
      </h2>
      <p className={styles.text}>{RISK_TEXT}</p>
      <div className={styles.actions}>
        <button type="button" className="button button-primary" onClick={onBackup}>
          <ArrowDownDocIcon />
          Сохранить копию
        </button>
        <button type="button" className="button" onClick={onSnooze}>
          Позже
        </button>
      </div>
    </section>
  )
}
