import { useEffect } from 'react'
import type { Subscription } from '../types'
import { dueDesktopReminders } from '../utils/desktopReminders'
import type { ReminderSettings } from '../utils/pushReminders'

const LAST_CHECK_KEY = 'subscriptions.desktopRemindersCheckedAt'
const CHECK_EVERY_MS = 60 * 1000

function readLastCheck(): number {
  try {
    const value = Number(localStorage.getItem(LAST_CHECK_KEY))
    return Number.isFinite(value) && value > 0 ? value : Date.now()
  } catch {
    return Date.now()
  }
}

/**
 * Уведомления Windows в версии для ПК: раз в минуту смотрим, не наступило ли время напоминания.
 * Работает, пока программа запущена (в том числе свёрнутой).
 */
export function useDesktopReminders(
  subscriptions: readonly Subscription[],
  enabled: boolean,
  settings: ReminderSettings,
): void {
  useEffect(() => {
    if (!enabled || typeof Notification === 'undefined') return
    const check = () => {
      const now = Date.now()
      const due = dueDesktopReminders(subscriptions, readLastCheck(), now, settings)
      try {
        localStorage.setItem(LAST_CHECK_KEY, String(now))
      } catch {
        // Без хранилища просто не запомним время проверки.
      }
      for (const reminder of due) new Notification(reminder.title, { body: reminder.body, tag: reminder.tag })
    }
    check()
    const timer = window.setInterval(check, CHECK_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [subscriptions, enabled, settings])
}
