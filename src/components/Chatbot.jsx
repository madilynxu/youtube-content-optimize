import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Bot, User } from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your Video Analyst. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    if (input.includes('correlation') || input.includes('factors') || input.includes('view count')) {
      return 'Based on the cross-video analysis: Video duration shows a moderate correlation with view count, but engagement rate is more strongly correlated. Videos between 5-15 minutes tend to perform best. Gaming content and music videos show the highest view counts, while tutorials have the most consistent engagement rates.'
    } else if (input.includes('genre') || input.includes('topic') || input.includes('engagement')) {
      return 'Topic category analysis reveals: Gaming content generates the highest average views (55K+) and strong engagement. Music videos have excellent engagement rates despite shorter durations. Tutorial content shows the most consistent performance across all metrics. Comedy and review content perform well but vary more in success.'
    } else if (input.includes('duration') || input.includes('length')) {
      return 'Duration analysis shows: Optimal video length varies by category. Gaming videos perform best at 10-20 minutes, while music videos excel at 3-5 minutes. Tutorial content works well at 5-15 minutes. There\'s a sweet spot where engagement rate peaks - typically around 8-12 minutes for most content types.'
    } else if (input.includes('tag') || input.includes('tags')) {
      return 'Tag analysis reveals: Gaming-related tags appear most frequently and drive high engagement. Tutorial and "how-to" tags consistently perform well. Music and entertainment tags show strong view counts. The most successful videos use 5-8 relevant tags, with gaming, tutorial, and entertainment being the top performers.'
    } else if (input.includes('channel') || input.includes('top channels')) {
      return 'Channel performance analysis: The top 10 channels by total views show diverse content strategies. Gaming channels dominate the top spots, followed by music and entertainment. Successful channels maintain consistent upload schedules (2-3 videos per week) and focus on specific niches with high engagement potential.'
    } else if (input.includes('subscriber') || input.includes('subscribers')) {
      return 'Subscriber growth analysis: Channels with consistent upload schedules (2-3 videos/week) show the strongest subscriber growth. Gaming and music channels have the highest subscriber acquisition rates. Content that combines entertainment with education tends to drive the most sustainable subscriber growth.'
    } else if (input.includes('engagement') || input.includes('engagement per upload')) {
      return 'Engagement analysis: Gaming content shows the highest engagement rates, followed by music and tutorial content. Videos with clear calls-to-action and interactive elements perform better. Engagement rates are more strongly correlated with content quality than video length.'
    } else if (input.includes('views') || input.includes('views per upload')) {
      return 'View performance analysis: Gaming and music videos achieve the highest average views per upload. Content with trending topics or popular tags performs significantly better. Videos published during peak hours (6-9 PM) show 20-30% higher view counts.'
    } else if (input.includes('upload') || input.includes('frequency')) {
      return 'Upload frequency insights: Channels uploading 2-3 times per week show the best performance metrics. Consistency is more important than frequency - channels with regular schedules outperform those with sporadic uploads. Weekend uploads (Saturday/Sunday) show 15-25% higher engagement.'
    } else if (input.includes('content') || input.includes('video type')) {
      return 'Content strategy insights: Gaming content dominates in both views and engagement. Music videos excel in engagement rates despite shorter durations. Tutorial content shows the most consistent performance. Comedy and review content have high potential but require strong execution to succeed.'
    } else if (input.includes('trend') || input.includes('decreasing')) {
      return 'Trend analysis: If you\'re seeing decreases, focus on: 1) Content consistency and upload schedule, 2) Video quality and thumbnail optimization, 3) Trending topics and relevant tags, 4) Engagement with audience through comments and community features.'
    } else if (input.includes('help') || input.includes('support')) {
      return 'I can help you analyze: Video performance correlations, Topic category insights, Duration optimization, Tag effectiveness, Channel performance comparisons, Subscriber growth patterns, Engagement strategies, and Content optimization. What would you like to explore?'
    } else {
      return 'I understand you\'re asking about "' + userInput + '". Based on the comprehensive YouTube analytics data, I can provide insights about video performance factors, content strategy, engagement optimization, and cross-channel performance analysis. What specific aspect would you like to explore?'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-40"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-40">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <span className="font-semibold">Video Analyst</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    message.type === 'user' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`chat-message ${message.type}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <Bot size={12} />
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your key metrics..."
                className="flex-1 input-field text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot 