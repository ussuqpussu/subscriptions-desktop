import type { Subscription } from '../types'
import { addDays, toISODate } from './dateUtils'
import { createId } from './id'

type DemoSeed = Omit<Subscription, 'id' | 'startDate' | 'reminders'> & { inDays: number }

/**
 * Пример для показа: подписки с разными лампочками — зелёной, жёлтой, красной и серой,
 * пробным периодом и валютой. Даты считаются от сегодняшнего дня, цены — примерные.
 */
const SEEDS: readonly DemoSeed[] = [
  { name: 'Яндекс Плюс', url: 'https://ya.ru/', category: 'Развлечения', price: 399, currency: 'RUB', billingPeriod: 'monthly', status: 'active', inDays: 2 },
  { name: 'Spotify', url: 'https://open.spotify.com/', category: 'Музыка', price: 5.99, currency: 'USD', billingPeriod: 'monthly', status: 'active', inDays: 9 },
  { name: 'Кинопоиск', url: 'https://www.kinopoisk.ru/', category: 'Кино', price: 299, currency: 'RUB', billingPeriod: 'monthly', status: 'active', inDays: -3 },
  { name: 'iCloud+', url: 'https://www.icloud.com/', category: 'Облако', price: 149, currency: 'RUB', billingPeriod: 'monthly', status: 'active', inDays: 17 },
  { name: 'Telegram Premium', url: 'https://telegram.org/', category: 'Связь', price: 2990, currency: 'RUB', billingPeriod: 'yearly', status: 'active', inDays: 64 },
  { name: 'Dota Plus', url: 'https://www.dota2.com/', category: 'Игры', price: 3.99, currency: 'USD', billingPeriod: 'monthly', status: 'active', inDays: 1, trialUntil: '' },
  { name: 'ChatGPT Plus', url: 'https://chatgpt.com/', category: 'Работа', price: 20, currency: 'USD', billingPeriod: 'monthly', status: 'paused', inDays: 21 },
  { name: 'Skyeng', url: 'https://skyeng.ru/', category: 'Учёба', price: 3490, currency: 'RUB', billingPeriod: 'monthly', status: 'active', inDays: 12 },
]

export function createDemoSubscriptions(today: Date): Subscription[] {
  return SEEDS.map(({ inDays, trialUntil, ...seed }) => {
    const start = addDays(today, inDays)
    const item: Subscription = { ...seed, id: createId(), startDate: toISODate(start), reminders: [1] }
    // Dota Plus — на пробном периоде, который кончается в день первого платежа.
    if (trialUntil !== undefined) item.trialUntil = toISODate(start)
    return item
  })
}
