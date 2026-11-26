import type { ReactNode } from 'react'
import type { AppTab } from './BottomBar'
import { BellIcon, CalendarIcon, ChartIcon, ListIcon, PlusIcon } from './icons'
import type { MenuItem } from './MoreMenu'
import styles from './Sidebar.module.css'

const TABS: readonly { value: AppTab; label: string; icon: ReactNode; key: string }[] = [
  { value: 'home', label: 'Главная', icon: <ListIcon />, key: '1' },
  { value: 'stats', label: 'Статистика', icon: <ChartIcon />, key: '2' },
  { value: 'calendar', label: 'Календарь', icon: <CalendarIcon />, key: '3' },
]

interface SidebarProps {
  /** null — разделы скрыты (список пуст). */
  tab: AppTab | null
  onTabChange: (tab: AppTab) => void
  onAdd: () => void
  onNotifications: () => void
  overdueCount: number
  menuItems: readonly MenuItem[]
}

/** Боковая панель версии для широкого окна: разделы, добавление и служебные действия. */
export function Sidebar({ tab, onTabChange, onAdd, onNotifications, overdueCount, menuItems }: SidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Меню">
      <div className={styles.brand}>
        <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={28} height={28} />
        <span>Подписки</span>
      </div>

      <button type="button" className={`button button-primary ${styles.add}`} onClick={onAdd}>
        <PlusIcon />
        Добавить
        <kbd className={styles.kbd}>Ctrl+N</kbd>
      </button>

      {tab !== null && (
        <nav className={styles.group} aria-label="Разделы">
          {TABS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={styles.item}
              aria-current={tab === item.value ? 'page' : undefined}
              onClick={() => onTabChange(item.value)}
            >
              {item.icon}
              <span className={styles.label}>{item.label}</span>
              {item.value === 'home' && overdueCount > 0 ? (
                <span className={`tabular ${styles.badge}`} aria-label={`Просрочено: ${overdueCount}`}>
                  {overdueCount}
                </span>
              ) : (
                <kbd className={styles.kbd}>Ctrl+{item.key}</kbd>
              )}
            </button>
          ))}
        </nav>
      )}

      <div className={styles.group} role="group" aria-label="Настройки и данные">
        <button type="button" className={styles.item} onClick={onNotifications}>
          <BellIcon />
          <span className={styles.label}>Уведомления</span>
        </button>
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.item}
            data-destructive={item.destructive || undefined}
            disabled={item.disabled}
            onClick={item.onSelect}
          >
            {item.icon}
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
