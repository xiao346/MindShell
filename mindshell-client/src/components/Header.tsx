import { useThemeStore } from '../stores/themeStore'
import { Icon } from './Icon'
import { Mascot } from './Mascot'

interface HeaderProps {
  onToggleSidebar: () => void; sidebarVisible: boolean
  onToggleTerminal: () => void; terminalVisible: boolean
  onToggleChat: () => void; chatVisible: boolean
  onOpenSSHModal: () => void
}
export function Header(props: HeaderProps) {
  const { currentTheme } = useThemeStore()
  return <header className="app-header">
    <div className="brand"><Mascot avatar /><strong>MindShell</strong><span className="brand-tag">工作空间</span></div>
    <div className="header-actions">
      <span className="theme-label">{currentTheme === 'mist' ? '雾蓝' : '工作空间'}</span>
      <button className="icon-button" aria-label="切换连接列表" title="连接列表" aria-pressed={props.sidebarVisible} onClick={props.onToggleSidebar}><Icon name="panel" /></button>
      <button className="header-toggle" aria-label="终端" aria-pressed={props.terminalVisible} onClick={props.onToggleTerminal}><Icon name="terminal" size={16} /><span>终端</span></button>
      <button className="header-toggle" aria-label="AI 助手" aria-pressed={props.chatVisible} onClick={props.onToggleChat}><Icon name="sparkle" size={16} /><span>AI 助手</span></button>
      <button className="primary-button header-new" onClick={props.onOpenSSHModal}><Icon name="plus" size={16} />新建连接</button>
    </div>
  </header>
}
