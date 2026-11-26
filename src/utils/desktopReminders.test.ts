import { describe, expect, it } from 'vitest'
import type { Subscription } from '../types'
import { dueDesktopReminders, MAX_MISSED_MS } from './desktopReminders'
import { DEFAULT_REMINDER_SETTINGS } from './pushReminders'

const sub: Subscription = {
  id: 'a',
  name: 'Spotify',
  price: 199,
  currency: 'RUB',
  startDate: '2026-11-28',
  billingPeriod: 'monthly',
  category: 'Музыка',
  status: 'active',
  reminders: [1],
}
// Напоминание за день до 28-го — 27 ноября в 10:00.
const reminderAt = new Date(2026, 10, 27, 10).getTime()

describe('уведомления Windows', () => {
  it('показывает напоминание, время которого наступило с прошлой проверки', () => {
    const due = dueDesktopReminders([sub], reminderAt - 60_000, reminderAt + 1000, DEFAULT_REMINDER_SETTINGS)
    expect(due.map((item) => item.title)).toEqual(['Spotify: платёж завтра'])
  })

  it('не повторяет уже показанное', () => {
    expect(dueDesktopReminders([sub], reminderAt + 1000, reminderAt + 61_000, DEFAULT_REMINDER_SETTINGS)).toEqual([])
  })

  it('не вываливает напоминания старше суток', () => {
    const now = reminderAt + MAX_MISSED_MS + 60_000
    expect(dueDesktopReminders([sub], reminderAt - 60_000, now, DEFAULT_REMINDER_SETTINGS)).toEqual([])
  })

  it('молчит у подписки на паузе', () => {
    const paused = { ...sub, status: 'paused' as const }
    expect(dueDesktopReminders([paused], reminderAt - 60_000, reminderAt + 1000, DEFAULT_REMINDER_SETTINGS)).toEqual([])
  })
})
