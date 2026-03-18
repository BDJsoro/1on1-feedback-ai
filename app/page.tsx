'use client'

import { useChat, type Message } from '@ai-sdk/react'
import { motion } from 'framer-motion'
import { Send, User, Bot, Loader2, PlayCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startPractice = () => {
    append({
      id: 'start',
      role: 'user',
      content: '시작'
    })
  }

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto bg-white shadow-xl overflow-hidden relative sm:border-x border-gray-100">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">1on1 Feedback Practice</h1>
          <p className="text-xs text-blue-600 font-medium">AI Coaching Agent</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
          <Bot className="w-5 h-5 text-blue-600" />
        </div>
      </header>

      {/* Intro Overlay */}
      {messages.length === 0 && (
        <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50/50 to-white pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center max-w-sm"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">피드백 실습 시작하기</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              AI 팀장과 함께 1on1 피드백 대화를 연습해 보세요. 당신은 팀원의 입장이 되어 편안하게 대화하시면 됩니다.
            </p>
            <button 
              onClick={startPractice}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              시뮬레이션 শুরু(시작)
            </button>
          </motion.div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-0 bg-gray-50/30">
        {messages.map((m: Message) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm",
              m.role === 'user' ? "bg-gray-900 text-white" : "bg-blue-600 text-white"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm block break-words",
              m.role === 'user' 
                ? "bg-gray-900 text-white rounded-tr-sm" 
                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
            )}>
              <span className="whitespace-pre-wrap">{m.content}</span>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-500 font-medium">AI 팀장이 고민 중입니다...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 relative z-10">
        <div className="relative flex items-center max-w-2xl mx-auto">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="상황에 맞게 답변해 보세요..."
            className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-[15px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <div className="text-center mt-3">
          <button 
            type="button" 
            onClick={() => append({ id: 'end', role: 'user', content: '대화 종료' })}
            className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            대화를 끝내려면 여기를 누르거나 '대화 종료'라고 입력하세요.
          </button>
        </div>
      </form>
    </div>
  )
}
