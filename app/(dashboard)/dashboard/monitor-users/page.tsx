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
import { useGetAllExchangeDataQuery } from "@/src/redux/features/auth/authApi";

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

// Define TypeScript interface for the exchange data
interface ExchangeUser {
  _id: string;
  first_name: string;
  email: string;
  personalInfo: {
    display_name: string;
    first_name: string;
    last_name: string;
    phone_number: number;
    gender: string;
    dath_of_birth: string;
  };
}

interface Exchange {
  _id: string;
  senderUserId: ExchangeUser;
  reciverUserId: ExchangeUser;
  email: string;
  senderService: string;
  isAccepted: string;
  reciverUserAccepted: boolean;
  senderUserAccepted: boolean;
  my_service: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MonitorMessaging() {
  const [filter, setFilter] = useState("Completed Exchange");
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const { data: getAllExchange } = useGetAllExchangeDataQuery({});
  console.log("data", getAllExchange?.data);
  
  
  // Transform exchange data to match conversation format
  const transformedConversations = getAllExchange?.data?.map((exchange: Exchange) => ({
    id: exchange._id,
    user1: exchange.senderUserId.first_name,
    user2: exchange.reciverUserId.first_name,
    joinDate: new Date(exchange.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    status: exchange.reciverUserAccepted && exchange.senderUserAccepted ? "Completed" : "Pending",
    senderService: exchange.senderService,
    receiverServices: exchange.my_service,
    senderEmail: exchange.senderUserId.email,
    receiverEmail: exchange.reciverUserId.email,
    senderDetails: exchange.senderUserId,
    receiverDetails: exchange.reciverUserId
  })) || [];

  const handleStatusChange = (convId: string, status: string) => {
    // Implementation for status change if needed
    setOpen({ ...open, [convId]: false });
  };

  const filteredConversations = transformedConversations.filter((conv) => {
    if (filter === "Completed Exchange") {
      return conv.status === "Completed";
    }
    return conv.status === "Pending";
  });

  // Update STAT_CARDS with real data
  const updatedStatCards = [
    { 
      title: "Total Exchanges", 
      value: transformedConversations.length, 
      subtitle: "All exchanges",
      icon: MessageIcon,
    },
    { 
      title: "Pending Exchanges", 
      value: transformedConversations.filter(conv => conv.status === "Pending").length, 
      subtitle: "Awaiting Completion",
      icon: PendingIcon,
    },
    { 
      title: "Completed Exchanges", 
      value: transformedConversations.filter(conv => conv.status === "Completed").length, 
      subtitle: "Successful exchanges",
      icon: ConfirmedIcon,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {updatedStatCards.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Conversation Tracking</h2>

          <Tabs defaultValue="Completed Exchange" onValueChange={setFilter}>
            <TabsList>
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
                console.log("Taking action:", conversation);
              }}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}