import { Icon } from './Icon'
type TabId = 'servers' | 'files' | 'sftp' | 'extensions'
interface ActivityBarProps { activeTab: TabId; onTabChange: (tab: TabId) => void; onOpenSettings: () => void }
const tabs = [
  { id: 'servers', icon: 'terminal', label: '连接' },
  { id: 'files', icon: 'folder', label: '文件' },
  { id: 'sftp', icon: 'transfer', label: 'SFTP' },
] as const
export function ActivityBar({ activeTab, onTabChange, onOpenSettings }: ActivityBarProps) {
  return <nav className="activity-rail" aria-label="工作区导航">
    {tabs.map(tab => <button key={tab.id} className="rail-button" aria-label={tab.label} aria-current={activeTab === tab.id ? 'page' : undefined} title={tab.label} onClick={() => onTabChange(tab.id)}>
      <Icon name={tab.icon} size={21} /><span>{tab.label}</span>
    </button>)}
    <button className="rail-button rail-settings" aria-label="设置" title="设置" onClick={onOpenSettings}><Icon name="settings" size={21} /><span>设置</span></button>
  </nav>
}
