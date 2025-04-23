'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PendingIcon } from "../../../../icons/PendingIcon";
import { MessageIcon } from "../../../../icons/MessageIcon";
import { ReportConversationIcon } from "../../../../icons/ReportConversationIcon";
import { ConfirmedIcon } from "../../../../icons/ConfirmedIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatCard } from "./components/StatCard";
import { ConversationTable } from "./components/ConversationTable";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";

const conversations = [
  { id: "#0001", user1: "Kristin Watson", user2: "Jerome Bell", joinDate: "Jan 4, 2025", status: "Completed" },
  { id: "#0002", user1: "Eleanor Pena", user2: "Wade Warren", joinDate: "April 4, 2025", status: "Reported: pending" },
  { id: "#0003", user1: "Courtney Henry", user2: "Jane Cooper", joinDate: "Mar 4, 2025", status: "Completed" },
  { id: "#0004", user1: "Dianne Russell", user2: "Ronald Richards", joinDate: "Feb 4, 2025", status: "Reported" },
  { id: "#0005", user1: "Albert Flores", user2: "Floyd Miles", joinDate: "Mar 4, 2025", status: "Completed" },
];

const statusColor = {
  Completed: "text-green-600 bg-green-100",
  "Reported: pending": "text-yellow-600 bg-yellow-100",
  Reported: "text-red-600 bg-red-100",
};

const STAT_CARDS = [
  { 
    title: "Total Conversation", 
    value: 60, 
    subtitle: "Active chats",
    icon: MessageIcon,
  },
  { 
    title: "Pending Connection", 
    value: 10, 
    subtitle: "Awaiting Approval",
    icon: PendingIcon,
  },
  { 
    title: "Reported Conversations", 
    value: 4, 
    subtitle: "Flagged for review",
    icon: ReportConversationIcon,  
  },
  { 
    title: "Confirmed Swaps", 
    value: 20, 
    subtitle: "Successful exchanges",
    icon: ConfirmedIcon,
  },
];

export default function MonitorMessaging() {
  const [filter, setFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [conversationList, setConversationList] = useState(conversations);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const handleStatusChange = (convId: string, status: string) => {
    setConversationList(prev =>
      prev.map(conv => conv.id === convId ? { ...conv, status } : conv)
    );
    setOpen({ ...open, [convId]: false });
  };

  const filteredConversations = conversationList.filter((conv) => {
    switch (filter) {
      case "Completed Exchange":
        return conv.status === "Completed";
      case "Reported Profile":
        return conv.status.includes("Reported");
      default:
        return true;
    }
  });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Conversation Tracking</h2>

        <Tabs defaultValue="All" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Completed Exchange">Completed Exchange</TabsTrigger>
            <TabsTrigger value="Reported Profile">Reported Profile</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Input 
            placeholder="Search by user name or id" 
            className="w-full sm:w-1/3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto gap-1 text-sm">
                {dateFilter} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {["Last 30 days", "Last 60 days", "Last 120 days"].map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setDateFilter(option)}
                  className="cursor-pointer"
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="max-w-[calc(100vw-3rem)]">
          <ConversationTable 
            conversations={filteredConversations}
            open={open}
            setOpen={setOpen}
            onStatusChange={handleStatusChange}
            onTakeAction={(conversation) => {
              // console.log("Taking action:", conversation);
            }}
          />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}