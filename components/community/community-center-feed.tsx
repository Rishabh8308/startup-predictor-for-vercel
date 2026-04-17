"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Share2, Repeat2, Send, Loader2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Post Item Component handles individual state like upvoting and expanding comments
function PostItem({ post }: { post: any }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setUpvotes((p: number) => p - 1);
      setIsLiked(false);
    } else {
      setUpvotes((p: number) => p + 1);
      setIsLiked(true);
    }
  };

  const handleRepost = () => {
    toast.success("Post reposted to your feed!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://startup-predictor.app/post/${post.id}`);
    toast("Link copied to clipboard", {
      description: "You can now share this post.",
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success("Post saved", { description: "Added to your Saved Posts." });
    } else {
      toast.success("Post removed", { description: "Removed from your Saved Posts." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      layout
    >
      <Card className="glass-card overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-purple-500/30 transition-all duration-300 border-border/40">
      <CardHeader className="p-5 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorPhoto} />
              <AvatarFallback>{post.authorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2">
                {post.authorName}
                <span className="text-muted-foreground text-xs font-normal">• {post.timestamp}</span>
              </h4>
              <p className="text-xs text-muted-foreground">{post.authorHeadline}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 font-medium hover:bg-purple-500/20">
            {post.postType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-3">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span key={tag} className="text-xs text-purple-500 bg-purple-500/5 px-2 py-0.5 rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 border-t border-border/40 bg-muted/20 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className={`flex-1 ${isLiked ? 'text-purple-500' : 'text-muted-foreground hover:text-purple-500'}`}
        >
          <ThumbsUp className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {upvotes}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowComments(!showComments)}
          className="flex-1 text-muted-foreground hover:text-blue-500"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {post.comments.length}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleRepost} className="flex-1 text-muted-foreground hover:text-emerald-500">
          <Repeat2 className="w-4 h-4 mr-2" />
          Repost
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare} className="flex-1 text-muted-foreground hover:text-foreground hidden sm:flex">
          <Share2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSave} 
          className={`flex-1 ${isSaved ? 'text-purple-500' : 'text-muted-foreground hover:text-purple-500'}`}
        >
          <Bookmark className={`w-4 h-4 mr-1 sm:mr-2 ${isSaved ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </CardFooter>
      
      {/* Expandable Comments Area */}
      {showComments && (
        <div className="bg-muted/10 border-t border-border/40 p-4 space-y-4">
           {post.comments.length === 0 ? (
             <p className="text-xs text-center text-muted-foreground py-2">No comments yet. Be the first to start the discussion!</p>
           ) : (
             post.comments.map((c: any) => (
               <div key={c.id} className="flex gap-3">
                 <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={c.authorPhoto} />
                    <AvatarFallback>{c.authorName[0]}</AvatarFallback>
                 </Avatar>
                 <div className="bg-background/50 border border-border/50 p-2.5 rounded-xl text-sm flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-xs">{c.authorName}</span>
                      <span className="text-[10px] text-muted-foreground">{c.timestamp}</span>
                    </div>
                    <p>{c.text}</p>
                 </div>
               </div>
             ))
           )}
           <div className="flex gap-3 pt-2">
             <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback>U</AvatarFallback>
             </Avatar>
             <div className="relative flex-1">
               <Textarea placeholder="Add a comment..." className="min-h-[40px] h-[40px] py-2 bg-background pr-10 resize-none" />
               <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-purple-500 hover:bg-purple-500/10">
                 <Send className="w-3.5 h-3.5" />
               </Button>
             </div>
           </div>
        </div>
      )}
    </Card>
    </motion.div>
  );
}

export function CommunityCenterFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newPostText, setNewPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    // Fetch initial mocked posts
    fetch("/api/community/posts")
      .then(res => res.json())
      .then(data => {
         setPosts(data);
         setIsLoading(false);
      });
  }, []);

  const handlePublishPost = async () => {
    if (!newPostText.trim()) return;
    setIsPosting(true);
    
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        body: JSON.stringify({
          authorName: "Current User",
          authorHeadline: "Founder @ MyStartup",
          authorRole: "founder",
          content: newPostText,
          postType: "Discussion",
          tags: ["Startup", "Update"],
          upvotes: 0,
          comments: []
        })
      });
      const data = await res.json();
      
      setPosts(prev => [data.post, ...prev]);
      setNewPostText("");
      toast.success("Post published successfully");
    } catch(e) {
      toast.error("Failed to post");
    }
    
    setIsPosting(false);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card mb-8 border-purple-500/10">
        <CardContent className="p-4 pt-6">
          <div className="flex gap-4 mb-4">
            <Avatar>
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <Textarea 
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share an update, ask a question, or pitch an idea..." 
              className="resize-none border-border/50 bg-background/50 focus-visible:ring-purple-500"
            />
          </div>
          <div className="flex justify-between items-center ml-14">
            <div className="flex gap-2 text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-8 hover:text-purple-400">Image/Video</Button>
              <Button variant="ghost" size="sm" className="h-8 hover:text-purple-400">Tag Event</Button>
            </div>
            <Button 
              size="sm" 
              onClick={handlePublishPost}
              disabled={isPosting || !newPostText.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6"
            >
              {isPosting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} 
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="font-semibold text-lg">Professional Feed</h2>
        <span className="text-sm text-muted-foreground">Sort by: Top</span>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="loading-skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 space-y-4 border border-border/40 rounded-xl">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-muted/30 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted/30 rounded w-1/4 animate-pulse" />
                      <div className="h-3 bg-muted/30 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-4 bg-muted/30 rounded w-full animate-pulse" />
                    <div className="h-4 bg-muted/30 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
