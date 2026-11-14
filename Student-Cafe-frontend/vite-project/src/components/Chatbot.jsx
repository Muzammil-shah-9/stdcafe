import { useEffect, useRef, useState } from 'react'
import { getChatbotGreeting, getChatbotReply } from '../chatbotans'
import teaCupLogo from '../teacup-logo.svg'

const quickQuestions = ['Menu sections', 'Student deals', 'How do I order?']

const Chatbot = ({ menuItems, ingredients }) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [lastItemName, setLastItemName] = useState('')
  const [position, setPosition] = useState(null)
  const bottomRef = useRef(null)
  const launcherRef = useRef(null)
  const dragRef = useRef(null)
  const draggedRef = useRef(false)

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ from: 'bot', text: getChatbotGreeting() }])
  }, [open, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const keepOnScreen = () => {
      const bounds = launcherRef.current?.getBoundingClientRect()
      if (!bounds) return
      setPosition((current) => current ? {
        left: Math.max(0, Math.min(current.left, window.innerWidth - bounds.width)),
        top: Math.max(0, Math.min(current.top, window.innerHeight - bounds.height)),
      } : current)
    }
    window.addEventListener('resize', keepOnScreen)
    return () => window.removeEventListener('resize', keepOnScreen)
  }, [])

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      const deltaX = event.clientX - drag.startX
      const deltaY = event.clientY - drag.startY
      if (!draggedRef.current && Math.abs(deltaX) + Math.abs(deltaY) < 6) return
      draggedRef.current = true
      setPosition({
        left: Math.max(0, Math.min(drag.left + deltaX, window.innerWidth - drag.width)),
        top: Math.max(0, Math.min(drag.top + deltaY, window.innerHeight - drag.height)),
      })
    }
    const handlePointerEnd = (event) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== event.pointerId) return
      dragRef.current = null
      if (event.type === 'pointercancel' || !drag.sourceIsLauncher) draggedRef.current = false
      else window.setTimeout(() => { draggedRef.current = false }, 0)
    }
    window.addEventListener('pointermove', handlePointerMove, true)
    window.addEventListener('pointerup', handlePointerEnd, true)
    window.addEventListener('pointercancel', handlePointerEnd, true)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove, true)
      window.removeEventListener('pointerup', handlePointerEnd, true)
      window.removeEventListener('pointercancel', handlePointerEnd, true)
    }
  }, [])

  const startDrag = (event) => {
    if (event.button !== undefined && event.button !== 0) return
    if (event.currentTarget !== launcherRef.current && event.target.closest('button')) return
    const bounds = launcherRef.current?.getBoundingClientRect()
    if (!bounds) return
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height, sourceIsLauncher: event.currentTarget === launcherRef.current }
  }

  const sendQuestion = (question) => {
    const cleanQuestion = question.trim()
    if (!cleanQuestion) return
    const reply = getChatbotReply(cleanQuestion, { menuItems, ingredients, lastItemName })
    setMessages((current) => [...current, { from: 'user', text: cleanQuestion }, { from: 'bot', text: reply.text, options: reply.options }])
    if (reply.itemName) setLastItemName(reply.itemName)
    setInput('')
  }

  const sendMessage = (event) => {
    event.preventDefault()
    const question = input.trim()
    if (!question) return
    sendQuestion(question)
  }

  const startNewChat = () => {
    setMessages([{ from: 'bot', text: getChatbotGreeting() }])
    setLastItemName('')
    setInput('')
  }

  const panelStyle = position ? (() => {
    const panelWidth = Math.min(360, window.innerWidth - 32)
    const spaceAbove = Math.max(0, position.top - 22)
    const spaceBelow = Math.max(0, window.innerHeight - position.top - 92)
    const opensBelow = spaceBelow >= spaceAbove
    const availableHeight = opensBelow ? spaceBelow : spaceAbove
    const panelHeight = Math.min(490, window.innerHeight - 130, availableHeight)
    const launcherBounds = launcherRef.current?.getBoundingClientRect()
    const launcherWidth = launcherBounds?.width || 70
    const rawLeft = position.left > window.innerWidth / 2 ? position.left + launcherWidth - panelWidth : position.left
    const left = Math.max(8, Math.min(rawLeft, window.innerWidth - panelWidth - 8))
    const rawTop = opensBelow ? position.top + 84 : position.top - panelHeight - 14
    const top = Math.max(8, Math.min(rawTop, window.innerHeight - panelHeight - 8))
    return { position: 'fixed', left, top, width: panelWidth, height: panelHeight, minHeight: Math.min(300, panelHeight), right: 'auto', bottom: 'auto' }
  })() : undefined

  return (
    <div className={`cafe-chatbot${position ? ' is-positioned' : ''}`} style={position || undefined}>
      {open && <section className="cafe-chat-panel" style={panelStyle} role="dialog" aria-label="Chat with Chai Buddy">
        <header className="cafe-chat-header" onPointerDown={startDrag}>
          <span className="cafe-chat-avatar" aria-hidden="true"><img src={teaCupLogo} alt="" draggable="false" /><span className="cup-eye cup-eye-left" /><span className="cup-eye cup-eye-right" /><span className="cup-smile" /></span>
          <span><b>Chai Buddy</b><small>Menu helper · always steeping</small></span>
          <button className="cafe-chat-new" onClick={startNewChat} aria-label="Start a new chat" title="Start a new chat">New</button>
          <button className="cafe-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">×</button>
        </header>
        <div className="cafe-chat-messages" aria-live="polite">
          {messages.map((message, index) => <div className={`cafe-chat-turn ${message.from}`} key={`${index}-${message.from}`}><p className={`cafe-chat-message ${message.from}`}>{message.text}</p>{message.options?.length > 0 && <div className="cafe-chat-quick-questions">{message.options.map((option) => <button key={option} onClick={() => sendQuestion(option)}>{option}</button>)}</div>}</div>)}
          {messages.length === 1 && messages[0].from === 'bot' && <div className="cafe-chat-quick-questions">{quickQuestions.map((question) => <button key={question} onClick={() => sendQuestion(question)}>{question}</button>)}</div>}
          <div ref={bottomRef} />
        </div>
        <form className="cafe-chat-form" onSubmit={sendMessage}>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about the menu…" aria-label="Your message" />
          <button type="submit" aria-label="Send message">➤</button>
        </form>
      </section>}
      <button ref={launcherRef} className={`cafe-chat-launcher${open ? ' is-open' : ''}`} onPointerDown={startDrag} onClick={() => {
        if (draggedRef.current) { draggedRef.current = false; return }
        setOpen((current) => !current)
      }} aria-label={open ? 'Close Chai Buddy chat' : 'Open Chai Buddy chat'} aria-expanded={open}>
        <span className="cafe-chat-cup" aria-hidden="true"><img src={teaCupLogo} alt="" draggable="false" /><span className="cup-eye cup-eye-left" /><span className="cup-eye cup-eye-right" /><span className="cup-smile" /></span>
        {!open && <span className="cafe-chat-hint">Ask me! ☕</span>}
      </button>
    </div>
  )
}

export default Chatbot
