import type { Subscription } from '../types'
import { buildPushReminders, type PushReminder, type ReminderSettings } from './pushReminders'

/** Пропущенные напоминания (ПК был выключен) показываем, только если им не больше суток. */
export const MAX_MISSED_MS = 24 * 60 * 60 * 1000

/**
 * Напоминания, время которых наступило между прошлой проверкой и сейчас.
 * Расписание то же, что у пушей на телефоне, только считается прямо на ПК.
 */
export function dueDesktopReminders(
  subscriptions: readonly Subscription[],
  lastCheck: number,
  now: number,
  settings: ReminderSettings,
): PushReminder[] {
  const from = Math.max(lastCheck, now - MAX_MISSED_MS)
  if (from >= now) return []
  return buildPushReminders(subscriptions, new Date(from), settings, 2).filter((item) => item.at <= now)
}
