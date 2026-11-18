import { useEffect, useState } from 'react'
import { useConnectionStore } from '../stores/connectionStore'
import { ConnectionStatus, type SSHConnection } from '../types'
import { SSHConnectionModal } from './SSHConnectionModal'
import { Icon } from './Icon'

type TabId = 'servers' | 'files' | 'sftp' | 'extensions'
const statuses: Record<number, string> = { 0: '未连接', 1: '已连接', 2: '连接中', 3: '连接失败' }
export function LeftSidebar({ activeTab }: { activeTab: TabId }) {
  const { connections, currentConnectionId, selectConnection, fetchConnections, removeConnection, connect, disconnect, loading, error, clearError } = useConnectionStore()
  const [query, setQuery] = useState('')
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingConn, setEditingConn] = useState<SSHConnection | null>(null)
  const currentConn = connections.find(c => c.id === currentConnectionId)
  useEffect(() => { fetchConnections() }, [fetchConnections])
  const visible = connections.filter(c => (c.name + c.host + c.username).toLowerCase().includes(query.toLowerCase()))
  const toggle = async (conn: SSHConnection) => {
    if (busyIds.has(conn.id)) return
    setBusyIds(ids => new Set(ids).add(conn.id))
    try {
      if (conn.status === ConnectionStatus.CONNECTED) await disconnect(conn.id)
      else { selectConnection(conn.id); await connect(conn.id) }
    } finally { setBusyIds(ids => { const next = new Set(ids); next.delete(conn.id); return next }) }
  }
  const select = async (conn: SSHConnection) => {
    selectConnection(conn.id)
    if (conn.status === ConnectionStatus.DISCONNECTED) await toggle(conn)
  }
  return <aside className="connection-sidebar" aria-label="连接管理">
    <div className="sidebar-title"><h2>{activeTab === 'servers' ? '我的连接' : activeTab === 'files' ? '文件目录' : 'SFTP 文件传输'}</h2>
      {activeTab === 'servers' && <button className="icon-button" aria-label="刷新连接列表" title="刷新连接列表" onClick={() => fetchConnections()} disabled={loading}><Icon name="refresh" size={16} /></button>}
    </div>
    {activeTab === 'servers' ? <>
      <div className="sidebar-tools">
        <button className="primary-button new-connection" onClick={() => { setEditingConn(null); setModalOpen(true) }}><Icon name="plus" />新建连接</button>
        <label className="search-field"><Icon name="search" size={16} /><input aria-label="搜索连接" value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索名称或地址…" />{query && <button className="icon-button" aria-label="清除搜索" onClick={() => setQuery('')}><Icon name="close" size={13} /></button>}</label>
      </div>
      {error && <div className="sidebar-error" role="alert"><span>{error}</span><button className="icon-button" aria-label="关闭错误提示" onClick={clearError}><Icon name="close" size={14} /></button></div>}
      <div className="connection-list">
        <div className="list-label"><span>SSH 服务器</span><span>{visible.length}</span></div>
        {loading && !connections.length ? <div className="sidebar-empty">正在加载连接…</div> : visible.length ? visible.map(conn =>
          <div className={'connection-card' + (conn.id === currentConnectionId ? ' selected' : '')} key={conn.id}>
            <button className="connection-select" onClick={() => select(conn)} aria-pressed={conn.id === currentConnectionId}>
              <Icon name="server" size={19} /><span className="connection-info"><strong>{conn.name}</strong><span>{conn.username}@{conn.host}</span></span>
              <span className={'status-dot status-' + conn.status} title={statuses[conn.status]} />
            </button>
            <div className="connection-details"><span>{busyIds.has(conn.id) ? '处理中…' : statuses[conn.status]}</span><div className="connection-actions">
              <button className="icon-button" title={conn.status === 1 ? '断开连接' : '建立连接'} aria-label={(conn.status === 1 ? '断开 ' : '连接 ') + conn.name} disabled={busyIds.has(conn.id)} onClick={() => toggle(conn)}><Icon name="power" size={14} /></button>
              <button className="icon-button" title="编辑连接" aria-label={'编辑 ' + conn.name} onClick={() => { setEditingConn(conn); setModalOpen(true) }}><Icon name="edit" size={14} /></button>
              <button className="icon-button" title="删除连接" aria-label={'删除 ' + conn.name} onClick={() => removeConnection(conn.id)}><Icon name="trash" size={14} /></button>
            </div></div>
          </div>) : <div className="sidebar-empty"><Icon name={query ? 'search' : 'server'} size={30} /><p>{query ? '没有匹配的连接' : '添加你的第一台服务器'}</p><span>{query ? '试试其他名称或地址' : '连接会保存在这里，随时继续工作。'}</span></div>}
      </div>
      <div className="sidebar-footnote"><span className="status-dot status-1" />{connections.filter(c => c.status === 1).length} 个连接在线</div>
    </> : <div className="sidebar-empty feature-empty"><Icon name={activeTab === 'files' ? 'folder' : 'transfer'} size={34} /><p>{activeTab === 'files' ? '远程文件目录' : 'SFTP 文件传输'}</p><span>{currentConn ? '此功能正在完善中，可在终端中管理远程文件。' : '选择服务器后，可先通过终端管理文件。'}</span></div>}
    <SSHConnectionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingConn(null) }} editingConnection={editingConn} />
  </aside>
}
