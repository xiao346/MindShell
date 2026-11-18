import { useConnectionStore } from '../stores/connectionStore'
import { Icon } from './Icon'

export function TerminalTabs({ onNew }: { onNew: () => void }) {
  const { connections, currentConnectionId, selectConnection } = useConnectionStore()
  const tabs = connections.filter(c => c.status === 1 || c.id === currentConnectionId)
  return <div className="terminal-tabs" aria-label="终端会话">
    <div className="terminal-tab-scroll">{tabs.length ? tabs.map(c =>
      <button key={c.id} className={'terminal-tab' + (c.id === currentConnectionId ? ' active' : '')} aria-pressed={c.id === currentConnectionId} onClick={() => selectConnection(c.id)} title={c.username + '@' + c.host}>
        <span className={'status-dot status-' + c.status} />{c.name}
      </button>) : <span className="terminal-tab active"><Icon name="terminal" size={16} />终端工作区</span>}
    </div><button className="icon-button" title="新建连接" aria-label="新建终端连接" onClick={onNew}><Icon name="plus" /></button>
  </div>
}

export function StatusBar() {
  const { connections, currentConnectionId, serverStatus } = useConnectionStore()
  const conn = connections.find(c => c.id === currentConnectionId)
  return <footer className="status-bar">
    <div><span className={'status-dot status-' + (conn?.status ?? 0)} /><span>{conn?.status === 1 ? 'SSH 已连接' : conn?.status === 2 ? '正在连接' : conn?.status === 3 ? '连接失败' : '未连接 SSH'}</span>{conn && <><span className="status-divider" /><span className="status-address">{conn.name} · {conn.host}:{conn.port}</span></>}</div>
    <div><span className="backend-status">{serverStatus.connected ? '服务端已连接' : '服务端未连接'}</span><span className="status-divider" /><span>UTF-8</span><span className="status-divider" /><span>MindShell</span></div>
  </footer>
}
