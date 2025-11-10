import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  avatar?: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 여기 계신가요?",
      sender: "other",
      timestamp: "13:53",
      avatar: "/diverse-person-portrait.png",
    },
    {
      id: 2,
      text: "네, 있어요!",
      sender: "user",
      timestamp: "13:53",
    },
    {
      id: 3,
      text: "프로젝트 진행 잘 되고 있나요? 정말 멋진 작업이에요!",
      sender: "other",
      timestamp: "13:53",
      avatar: "/diverse-person-portrait.png",
    },
    {
      id: 4,
      text: "감사합니다! 거의 다 끝났어요. 한 가지만 더 확인하면 됩니다...",
      sender: "other",
      timestamp: "13:53",
      avatar: "/diverse-person-portrait.png",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputValue("");

      // Simulate other user typing
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyMessage: Message = {
          id: messages.length + 2,
          text: "알겠습니다! 확인했어요 👍",
          sender: "other",
          timestamp: new Date().toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: "/diverse-person-portrait.png",
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/diverse-person-portrait.png" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              크
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold text-card-foreground">
              크리에이티브 팀
            </h2>
            <p className="text-xs text-muted-foreground">온라인</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                message.sender === "user" && "flex-row-reverse"
              )}
            >
              {message.sender === "other" && (
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={message.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    크
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "flex flex-col gap-1 max-w-[70%]",
                  message.sender === "user" && "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 shadow-sm",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card text-card-foreground rounded-tl-sm border"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <span className="text-xs text-muted-foreground px-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/diverse-person-portrait.png" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  크
                </AvatarFallback>
              </Avatar>
              <div className="bg-card text-card-foreground rounded-2xl rounded-tl-sm px-4 py-3 border">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="메시지 입력..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 rounded-full bg-secondary border-0 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full h-10 w-10 bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
