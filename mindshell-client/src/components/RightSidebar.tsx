import { useRef, useEffect, useState } from 'react'
import { useAgentStore } from '../stores/agentStore'
import { useConnectionStore } from '../stores/connectionStore'
import { ConnectionStatus, type AgentMessage } from '../types'
import { Mascot } from './Mascot'
import { Icon } from './Icon'

function MessageBubble({ message }: { message: AgentMessage }) {
  const user = message.role === 'user'
  return <div className={'chat-message ' + (user ? 'from-user' : message.role === 'system' ? 'system-message' : 'from-assistant')}>
    {!user && message.role === 'assistant' && <Mascot avatar />}
    <div className="message-content" dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }} />
  </div>
}

// Escape server-provided text before adding the small set of supported markup.
function formatMarkdown(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const blocks: string[] = []
  let html = escaped.replace(/```\w*\n?([\s\S]*?)```/g, (_, code: string) => {
    const index = blocks.push('<pre><code>' + code.trim() + '</code></pre>') - 1
    return '\u0000' + index + '\u0000'
  })
  html = html.replace(/(\|.+\|\n\|[-| :]+\|\n(?:\|.+\|\n?)+)/g, table => {
    const lines = table.trim().split('\n')
    const cells = (line: string, tag: 'th' | 'td') => line.split('|').filter(cell => cell.trim()).map(cell => `<${tag}>${cell.trim()}</${tag}>`).join('')
    return '<table><thead><tr>' + cells(lines[0], 'th') + '</tr></thead><tbody>' + lines.slice(2).map(line => '<tr>' + cells(line, 'td') + '</tr>').join('') + '</tbody></table>'
  })
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n/g, '<br/>')
  return html.replace(/\u0000(\d+)\u0000/g, (_, index: string) => blocks[Number(index)])
}

export function RightSidebar() {
  const { sessions, currentSessionId, setCurrentSession, inputText, setInputText, isLoading, loadingText, createSession, sendMessage, stopGeneration, agents, currentAgentId, setCurrentAgent, loadAgents } = useAgentStore()
  const { currentConnectionId, connections, terminalSessions } = useConnectionStore()
  const [historyOpen, setHistoryOpen] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const session = currentSessionId ? sessions.get(currentSessionId) : undefined
  const conn = connections.find(c => c.id === currentConnectionId)
  const terminalSessionId = currentConnectionId ? terminalSessions[currentConnectionId] : null
  const connected = conn?.status === ConnectionStatus.CONNECTED && !!terminalSessionId
  const canSend = !!(inputText.trim() && session && connected && currentAgentId && !isLoading)
  useEffect(() => { loadAgents() }, [loadAgents])
  useEffect(() => { if (!currentSessionId && sessions.size === 0) createSession() }, [currentSessionId, sessions.size, createSession])
  useEffect(() => { if (session?.messages.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [session?.messages, isLoading])
  useEffect(() => {
    const input = textareaRef.current
    if (input) { input.style.height = 'auto'; input.style.height = Math.min(180, Math.max(78, input.scrollHeight)) + 'px' }
  }, [inputText])
  const send = async () => {
    if (!canSend) return
    const text = inputText.trim()
    setInputText('')
    await sendMessage(text, terminalSessionId)
  }
  return <aside className="assistant-panel" aria-label="AI 助手">
    <div className="assistant-heading"><h2><Icon name="sparkle" size={22} />AI 助手</h2><div className="assistant-heading-actions">
      <button className="icon-button" title="会话记录" aria-label="会话记录" aria-expanded={historyOpen} onClick={() => setHistoryOpen(v => !v)}><Icon name="chat" size={17} /></button>
      <button className="icon-button" title="新建会话" aria-label="新建会话" disabled={isLoading} onClick={() => createSession()}><Icon name="plus" size={19} /></button>
    </div></div>
    <div className="assistant-context"><span className={'status-dot status-' + (connected ? 1 : 0)} /><span>{connected ? '当前连接：' + conn?.name : conn ? conn.name + ' · 等待终端连接' : '连接服务器，开始协作'}</span><Icon name="terminal" size={15} /></div>
    {historyOpen && <div className="session-history"><div className="list-label">会话记录</div>{Array.from(sessions.values()).reverse().map(s => <button key={s.id} className={s.id === currentSessionId ? 'active' : ''} disabled={isLoading} onClick={() => { setCurrentSession(s.id); setHistoryOpen(false) }}>{s.messages.find(m => m.role === 'user')?.content.slice(0, 40) || '新对话'}</button>)}</div>}
    <div className="chat-scroll">
      {!session?.messages.length ? <div className="assistant-welcome">
        <Mascot />
        <h3>一起把问题解决好。</h3>
        <p>查看服务器状态，读懂日志，<br />让每一步操作都更清楚。</p>
        <div className="suggestions">{[
          ['查看磁盘空间', '帮我查看服务器的磁盘使用情况'],
          ['检查运行状态', '帮我检查服务器的运行状态'],
          ['分析错误日志', '帮我分析应用的错误日志'],
        ].map(([label, prompt]) => <button key={label} onClick={() => { setInputText(prompt); textareaRef.current?.focus() }}><Icon name="terminal" size={15} /><span>{label}</span><Icon name="chevron" size={13} /></button>)}</div>
      </div> : <div className="message-list">
        {session.messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        {isLoading && <div className="thinking" role="status"><span className="thinking-dot" />{loadingText}</div>}
      </div>}
      <div ref={endRef} />
    </div>
    <div className="composer-area">
      <label className="agent-picker"><Icon name="sparkle" size={14} /><select aria-label="选择智能体" value={currentAgentId || ''} disabled={isLoading} onChange={e => setCurrentAgent(e.target.value)}>
        {!agents.length && <option value="">暂无可用智能体</option>}
        {agents.map(agent => <option key={agent.agentId} value={agent.agentId}>{agent.agentName}</option>)}
      </select></label>
      <div className="composer">
        <textarea ref={textareaRef} aria-label="向 AI 助手提问" placeholder="输入问题，或描述你想执行的操作…" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); send() }
        }} />
        <div className="composer-bottom"><span>{connected ? '已关联当前终端' : '连接 SSH 后即可发送'}</span>
          {isLoading ? <button className="primary-button stop-button" onClick={stopGeneration}>停止生成</button> : <button className="primary-button" disabled={!canSend} title={!connected ? '请先连接 SSH 终端' : !currentAgentId ? '请先选择智能体' : '发送'} onClick={send}><Icon name="send" size={15} />发送</button>}
        </div>
      </div>
      <div className="composer-hint">Enter 发送 <span>·</span> Shift + Enter 换行</div>
    </div>
  </aside>
}
