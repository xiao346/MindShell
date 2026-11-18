import { useState, useEffect, type CSSProperties } from 'react'
import { Header } from '../components/Header'
import { ActivityBar } from '../components/ActivityBar'
import { LeftSidebar } from '../components/LeftSidebar'
import { RightSidebar } from '../components/RightSidebar'
import { TerminalPanel } from '../components/TerminalPanel'
import { TerminalTabs, StatusBar } from '../components/WorkspaceChrome'
import { Settings } from '../components/Settings'
import { SSHConnectionModal } from '../components/SSHConnectionModal'
import { useThemeStore } from '../stores/themeStore'
import { Icon } from '../components/Icon'

type TabId = 'servers' | 'files' | 'sftp' | 'extensions'
export function MainView() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [sshModalOpen, setSshModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('servers')
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(238)
  const [chatVisible, setChatVisible] = useState(true)
  const [chatWidth, setChatWidth] = useState(350)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [drag, setDrag] = useState<{ side: 'left' | 'right'; x: number; width: number } | null>(null)
  const { colors, currentTheme } = useThemeStore()
  useEffect(() => {
    if (!drag) return
    const move = (e: MouseEvent) => {
      if (drag.side === 'left') setSidebarWidth(Math.max(190, Math.min(340, drag.width + e.clientX - drag.x)))
      else setChatWidth(Math.max(290, Math.min(520, drag.width + drag.x - e.clientX)))
    }
    const up = () => setDrag(null)
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up)
    document.body.style.cursor = 'col-resize'
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.body.style.cursor = '' }
  }, [drag])
  const themeStyle = {
    '--surface': colors.bgPrimary, '--panel': colors.bgSecondary, '--raised': colors.bgTertiary,
    '--input': colors.bgInput, '--hover': colors.bgHover, '--title': colors.bgTitleBar,
    '--border': colors.border, '--text': colors.text, '--muted': colors.textSecondary,
    '--dim': colors.textDim, '--accent': colors.accent, '--accent-soft': colors.accentSoft,
    '--green': colors.green, '--red': colors.red, '--yellow': colors.yellow,
  } as CSSProperties
  return <div className="app-shell" data-theme={currentTheme} style={themeStyle}>
    <Header onToggleSidebar={() => setSidebarVisible(v => !v)} sidebarVisible={sidebarVisible}
      onToggleTerminal={() => setTerminalVisible(v => !v)} terminalVisible={terminalVisible}
      onToggleChat={() => setChatVisible(v => !v)} chatVisible={chatVisible} onOpenSSHModal={() => setSshModalOpen(true)} />
    <div className="workspace-body">
      <ActivityBar activeTab={activeTab} onTabChange={tab => { setActiveTab(tab); setSidebarVisible(true) }} onOpenSettings={() => setSettingsOpen(true)} />
      <div className="sidebar-slot" style={{ width: sidebarWidth, display: sidebarVisible ? undefined : 'none' }}><LeftSidebar activeTab={activeTab} /></div>
      {sidebarVisible && <div className="panel-resizer" role="separator" aria-label="调整连接列表宽度" aria-orientation="vertical" aria-valuemin={190} aria-valuemax={340} aria-valuenow={sidebarWidth} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setSidebarWidth(w => Math.max(190, Math.min(340, w + (e.key === 'ArrowRight' ? 10 : -10)))) } }} onMouseDown={e => { e.preventDefault(); setDrag({ side: 'left', x: e.clientX, width: sidebarWidth }) }} />}
      <main className="terminal-workspace">
        <TerminalTabs onNew={() => setSshModalOpen(true)} />
        <div className="terminal-content" style={{ display: terminalVisible ? undefined : 'none' }}><TerminalPanel onNewConnection={() => setSshModalOpen(true)} /></div>
        {!terminalVisible && <div className="terminal-hidden"><Icon name="terminal" size={32} /><p>终端已收起</p><button className="secondary-button" onClick={() => setTerminalVisible(true)}>显示终端</button></div>}
      </main>
      {chatVisible && <div className="panel-resizer" role="separator" aria-label="调整助手宽度" aria-orientation="vertical" aria-valuemin={290} aria-valuemax={520} aria-valuenow={chatWidth} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); setChatWidth(w => Math.max(290, Math.min(520, w + (e.key === 'ArrowLeft' ? 10 : -10)))) } }} onMouseDown={e => { e.preventDefault(); setDrag({ side: 'right', x: e.clientX, width: chatWidth }) }} />}
      <div className="assistant-slot" style={{ width: chatWidth, display: chatVisible ? undefined : 'none' }}><RightSidebar /></div>
    </div>
    <StatusBar />
    <SSHConnectionModal open={sshModalOpen} onClose={() => setSshModalOpen(false)} />
    <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
  </div>
}
