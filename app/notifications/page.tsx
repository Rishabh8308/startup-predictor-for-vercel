"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageSquare, Handshake, Calendar, Check, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type NotificationType = "like" | "pitch" | "comment" | "meeting" | "system";

interface Notification {
  id: number;
  type: NotificationType;
  user: string;
  avatar?: string;
  action: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "meeting", user: "Alex Horowitz", avatar: "https://i.pravatar.cc/150?u=alex", action: "requested a 15-min intro call regarding your HealthTech idea.", time: "10m ago", read: false },
  { id: 2, type: "pitch", user: "Sequoia Cap", avatar: "https://i.pravatar.cc/150?u=sequoia", action: "requested to view your full pitch report for 'AI CRM'.", time: "2h ago", read: false },
  { id: 3, type: "like", user: "Eleanor Pena", avatar: "https://i.pravatar.cc/150?u=eleanor", action: "liked your post in the community feed.", time: "4h ago", read: false },
  { id: 4, type: "comment", user: "Jin Doe", avatar: "https://i.pravatar.cc/150?u=jin", action: "commented: 'Great insights on the TAM!'", time: "5h ago", read: true },
  { id: 5, type: "system", user: "System", action: "Your AI Viability Score improved to 8.5/10! Check your updated analysis.", time: "1d ago", read: true },
];

const getIcon = (type: NotificationType) => {
  switch (type) {
    case "like": return <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />;
    case "comment": return <MessageSquare className="w-4 h-4 text-blue-400" />;
    case "pitch": return <Handshake className="w-4 h-4 text-purple-500" />;
    case "meeting": return <Calendar className="w-4 h-4 text-amber-500" />;
    case "system": return <Sparkles className="w-4 h-4 text-cyan-400" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleAction = (id: number, actionType: "accept" | "decline") => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success(actionType === "accept" ? "Request accepted" : "Request declined");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/30">
              <Bell className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-extrabold animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    {unreadCount} New
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground text-sm">Stay updated with your startup network</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="border-purple-500/30 hover:bg-purple-500/10 transition-colors">
              <Check className="w-4 h-4 mr-2" /> Mark all as read
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-20 text-muted-foreground"
              >
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>You're all caught up!</p>
              </motion.div>
            ) : (
              notifications.map((notif, idx) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  layout
                >
                  <Card className={`glass-card overflow-hidden transition-all duration-300 border-border/40 ${!notif.read ? 'bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/30' : 'hover:bg-white/5'}`}>
                    <CardContent className="p-4 sm:p-6 flex items-start gap-4">
                      <div className="relative shrink-0 mt-1">
                        {notif.avatar ? (
                          <Avatar className="w-12 h-12 border-2 border-background">
                            <AvatarImage src={notif.avatar} />
                            <AvatarFallback>{notif.user[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border-2 border-background">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center shadow-lg">
                          {getIcon(notif.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <p className="text-sm">
                            <span className="font-semibold text-foreground">{notif.user}</span>{" "}
                            <span className="text-muted-foreground">{notif.action}</span>
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 font-medium">
                            {notif.time}
                          </span>
                        </div>
                        
                        {!notif.read && (notif.type === "meeting" || notif.type === "pitch") && (
                          <div className="mt-3 flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAction(notif.id, "accept")}
                              className="bg-purple-600 hover:bg-purple-700 h-8 text-xs px-4"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" /> Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAction(notif.id, "decline")}
                              className="h-8 text-xs border-border/50 hover:bg-red-500/10 hover:text-red-400"
                            >
                              <X className="w-3.5 h-3.5 mr-1" /> Decline
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0 mt-3 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
