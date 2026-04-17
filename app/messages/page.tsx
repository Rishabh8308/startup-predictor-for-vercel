"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { mockMessages, mockInvestors, mockEntrepreneurs } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search, Image as ImageIcon, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(mockMessages[0]);
  const [messageText, setMessageText] = useState("");
  const [localMessages, setLocalMessages] = useState<{id: string, text: string, sent: boolean, time: string}[]>([]);

  useEffect(() => {
    if (activeChat) {
      setLocalMessages([
        { id: activeChat.id + '-1', text: activeChat.lastMessage, sent: false, time: activeChat.timestamp }
      ]);
    }
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      text: messageText,
      sent: true,
      time: "Just now"
    };
    
    setLocalMessages(prev => [...prev, newMsg]);
    setMessageText("");
  };

  const getUser = (id: string) => {
    return mockInvestors.find(i => i.id === id) || mockEntrepreneurs.find(e => e.id === id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto h-[80vh] flex overflow-hidden glass-card rounded-2xl border border-border/40">
        
        {/* Left Sidebar - Chat List */}
        <div className="w-1/3 border-r border-border/40 flex flex-col bg-background/50">
          <div className="p-4 border-b border-border/40">
             <h2 className="text-xl font-bold mb-3">Messages</h2>
             <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
               <Input className="pl-9 bg-background" placeholder="Search conversations..." />
             </div>
          </div>
          <div className="overflow-y-auto flex-1">
             {mockMessages.map(msg => {
                const otherUser = getUser(msg.participants.find(p => p !== "ent-001") || msg.participants[0]);
                const isActive = activeChat.id === msg.id;
                return (
                  <div 
                    key={msg.id} 
                    onClick={() => setActiveChat(msg)}
                    className={`p-4 border-b border-border/20 cursor-pointer transition-colors ${isActive ? 'bg-purple-500/10 border-l-4 border-l-purple-500' : 'hover:bg-muted/50 border-l-4 border-l-transparent'}`}
                  >
                     <div className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser?.photoUrl} />
                          <AvatarFallback>{otherUser?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                           <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-sm truncate">{otherUser?.name}</h4>
                              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                           </div>
                           <p className={`text-xs truncate ${msg.unread ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                             {msg.lastMessage}
                           </p>
                        </div>
                     </div>
                  </div>
                )
             })}
          </div>
        </div>

        {/* Right Area - Active Chat */}
        <div className="flex-1 flex flex-col bg-background/30">
          {activeChat ? (
            <>
              {/* Chat Header */}
              {(() => {
                 const currentOther = getUser(activeChat.participants.find(p => p !== "ent-001") || activeChat.participants[0]);
                 return (
                  <div className="p-4 border-b border-border/40 flex items-center justify-between bg-background/50">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={currentOther?.photoUrl} />
                          <AvatarFallback>{currentOther?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold">{currentOther?.name}</h3>
                          <p className="text-xs text-muted-foreground">Active now</p>
                        </div>
                     </div>
                     <Button variant="outline" size="sm">View Profile</Button>
                  </div>
                 )
              })()}

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <AnimatePresence>
                   {localMessages.map((msg) => (
                     <motion.div 
                       key={msg.id}
                       initial={{ opacity: 0, scale: 0.95, y: 10 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       className={`flex gap-3 max-w-[80%] ${msg.sent ? 'ml-auto flex-row-reverse' : ''}`}
                     >
                        {!msg.sent && (
                           <Avatar className="h-8 w-8 mt-auto shrink-0">
                             <AvatarImage src={getUser(activeChat.participants.find(p => p !== "ent-001") || activeChat.participants[0])?.photoUrl} />
                             <AvatarFallback>U</AvatarFallback>
                           </Avatar>
                        )}
                        <div className={`p-3 rounded-2xl ${msg.sent ? 'bg-purple-600 shadow-lg shadow-purple-500/20 text-white rounded-br-sm' : 'bg-muted/50 rounded-bl-sm border border-border/40'}`}>
                          <p className="text-sm">{msg.text}</p>
                          <span className={`text-[10px] block mt-1 ${msg.sent ? 'text-purple-200 text-right' : 'text-muted-foreground'}`}>{msg.time}</span>
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-background/50 border-t border-border/40">
                 <div className="flex items-end gap-2">
                    <div className="flex gap-1 pb-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-purple-400"><ImageIcon className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-purple-400"><Paperclip className="w-4 h-4" /></Button>
                    </div>
                    <Input 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Write a message..." 
                      className="flex-1 bg-background/50 border-border/50 focus-visible:ring-purple-500 rounded-full px-4"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700">
                      <Send className="w-4 h-4 text-white" />
                    </Button>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to start messaging
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
