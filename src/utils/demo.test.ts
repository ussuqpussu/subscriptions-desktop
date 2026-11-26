import { describe, expect, it } from 'vitest'
import { createDemoSubscriptions } from './demo'
import { normalizeSubscriptions } from './subscriptionSchema'
import { getLamp } from './subscriptionUtils'

describe('демо-данные', () => {
  const today = new Date(2026, 10, 26)
  const demo = createDemoSubscriptions(today)

  it('проходят ту же проверку, что и сохранённые подписки', () => {
    const result = normalizeSubscriptions(JSON.parse(JSON.stringify(demo)))
    expect(result.items).toHaveLength(demo.length)
  })

  it('показывают все цвета лампочек', () => {
    const lamps = new Set(demo.map((item) => getLamp(item, today)))
    expect(lamps).toEqual(new Set(['green', 'yellow', 'red', 'off']))
  })

  it('у всех разные id', () => {
    expect(new Set(demo.map((item) => item.id)).size).toBe(demo.length)
  })
})
