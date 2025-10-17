"use client"

import ChatbotPanelWithHistory from "@/components/chatbot-panel-with-history"

export default function MobileChatPage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ChatbotPanelWithHistory 
        isMobile={true}
      />
    </div>
  )
}
