"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Send, Calendar, Star, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ConnectActionsProps {
  type: "investor" | "founder";
  name?: string; // Optional context for dialog headers
}

export function ConnectActions({ type, name = "this user" }: ConnectActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  
  const [pitchOpen, setPitchOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFollow = () => {
    setIsFollowLoading(true);
    setTimeout(() => {
      setIsFollowLoading(false);
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? `Unfollowed ${name}` : `You are now following ${name}`);
    }, 600);
  };

  const handleSendPitch = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/pitches", { method: "POST", body: JSON.stringify({ target: name }) });
      toast.success(`Pitch sent to ${name} successfully`);
      setPitchOpen(false);
    } catch (e) {
      toast.error("Failed to send pitch");
    }
    setIsSubmitting(false);
  };

  const handleRequestMeeting = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/meetings", { method: "POST", body: JSON.stringify({ target: name }) });
      toast.success(`Meeting requested with ${name}`);
      setMeetingOpen(false);
    } catch (e) {
      toast.error("Failed to request meeting");
    }
    setIsSubmitting(false);
  };

  if (type === "investor") {
    return (
      <div className="flex gap-3 flex-wrap">
        <Dialog open={pitchOpen} onOpenChange={setPitchOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md whitespace-nowrap px-2">
              <Send className="w-4 h-4 mr-1.5 shrink-0" />
              Send Pitch
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
               <DialogTitle>Send Pitch to {name}</DialogTitle>
               <DialogDescription>
                 Share your startup deck and highlight your best metrics.
               </DialogDescription>
             </DialogHeader>
             <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                 <label htmlFor="deck">Upload Deck (PDF)</label>
                 <Input id="deck" type="file" />
               </div>
               <div className="grid gap-2">
                 <label htmlFor="message">Introductory Message</label>
                 <Textarea id="message" placeholder="A brief note about your traction..." />
               </div>
             </div>
             <DialogFooter>
               <Button onClick={() => setPitchOpen(false)} variant="outline">Cancel</Button>
               <Button onClick={handleSendPitch} disabled={isSubmitting} className="bg-purple-600">
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Submit Pitch
               </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={meetingOpen} onOpenChange={setMeetingOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 border-purple-500/30 hover:bg-purple-500/10 whitespace-nowrap px-2">
              <Calendar className="w-4 h-4 mr-1.5 shrink-0" />
              Request Meet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
             <DialogHeader>
               <DialogTitle>Request Meeting</DialogTitle>
               <DialogDescription>
                 Propose a time to discuss synergies. We'll send an invite to {name}.
               </DialogDescription>
             </DialogHeader>
             <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                 <label htmlFor="date">Date</label>
                 <Input id="date" type="date" />
               </div>
               <div className="grid gap-2">
                 <label htmlFor="time">Time Slot</label>
                 <Input id="time" type="time" />
               </div>
               <div className="grid gap-2">
                 <label htmlFor="agenda">Agenda</label>
                 <Textarea id="agenda" placeholder="Agenda topics..." />
               </div>
             </div>
             <DialogFooter>
               <Button onClick={() => setMeetingOpen(false)} variant="outline">Cancel</Button>
               <Button onClick={handleRequestMeeting} disabled={isSubmitting} className="bg-purple-600">
                 {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Send Request
               </Button>
             </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button 
          variant={isFollowing ? "secondary" : "outline"} 
          onClick={handleFollow}
          disabled={isFollowLoading}
          className={`flex-1 ${isFollowing ? 'bg-muted border-border/50' : 'border-border/50 hover:bg-muted/50'} whitespace-nowrap px-2`}
        >
          {isFollowLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : 
           isFollowing ? <Check className="w-4 h-4 mr-1.5 text-emerald-500" /> : <Star className="w-4 h-4 mr-1.5" />}
          {isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <Button 
         onClick={() => {
           toast.success("Connection request sent!");
         }}
         className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md whitespace-nowrap px-2"
      >
        <UserPlus className="w-4 h-4 mr-1.5 shrink-0" />
        Connect
      </Button>
      <Button 
        onClick={() => {
          toast.info("Opening chat window...");
          // In a real app we'd redirect to /messages?focus=user_id
          window.location.href = '/messages';
        }}
        variant="outline" 
        className="flex-1 border-blue-500/30 hover:bg-blue-500/10 whitespace-nowrap px-2"
      >
        <Send className="w-4 h-4 mr-1.5 shrink-0" />
        Message
      </Button>
    </div>
  );
}
