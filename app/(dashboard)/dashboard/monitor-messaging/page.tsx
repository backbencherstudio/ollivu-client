'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ChevronDown, Flag, MessageSquare, Users } from "lucide-react";
import { PendingIcon } from "../../../../icons/PendingIcon";
import { MessageIcon } from "../../../../icons/MessageIcon";
import { ReportConversationIcon } from "../../../../icons/ReportConversationIcon";
import { ConfirmedIcon } from "../../../../icons/ConfirmedIcon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const conversations = [
  { id: "#0001", user1: "Kristin Watson", user2: "Jerome Bell", status: "Completed" },
  { id: "#0002", user1: "Eleanor Pena", user2: "Wade Warren", status: "Reported: pending" },
  { id: "#0003", user1: "Courtney Henry", user2: "Jane Cooper", status: "Completed" },
  { id: "#0004", user1: "Dianne Russell", user2: "Ronald Richards", status: "Reported" },
  { id: "#0005", user1: "Albert Flores", user2: "Floyd Miles", status: "Completed" },
];

const statusColor = {
  Completed: "text-green-600 bg-green-100",
  "Reported: pending": "text-yellow-600 bg-yellow-100",
  Reported: "text-red-600 bg-red-100",
};

// Add state for conversations
export default function MonitorMessaging() {
  const [filter, setFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("Last 30 days");
  const [conversationList, setConversationList] = useState(conversations);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  // Update filteredConversations to use conversationList instead of conversations
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
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
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
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex items-start justify-between">
              <div>
                <p className="text-base font-medium text-[#070707]">{stat.title}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
                <h2 className="text-3xl font-bold mt-2 mb-1 text-[#20B894]">{stat.value}</h2>
              </div>
              <div className={`p-3 border rounded-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conversation Tracking Tabs */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Conversation Tracking</h2>

        <Tabs defaultValue="All" onValueChange={(value) => setFilter(value)}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Completed Exchange">Completed Exchange</TabsTrigger>
            <TabsTrigger value="Reported Profile">Reported Profile</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filter */}
        <div className="flex items-center justify-between">
          <Input placeholder="Search by user name or id" className="w-1/3" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1 text-sm">
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4 text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">User Id</th>
                <th>User 1</th>
                <th>User 2</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredConversations.map((conv) => (
                <tr key={conv.id} className="border-b">
                  <td className="py-3">{conv.id}</td>
                  <td>{conv.user1}</td>
                  <td>{conv.user2}</td>
                  // Inside the table body, replace the Dialog with DropdownMenu
                  <td>
                    <DropdownMenu open={open[conv.id]} onOpenChange={(isOpen) => setOpen({ ...open, [conv.id]: isOpen })}>
                      <DropdownMenuTrigger asChild>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer hover:opacity-80 ${
                            statusColor[conv.status as keyof typeof statusColor] || ""
                          }`}
                        >
                          {conv.status.includes("Reported") ? conv.status : `✓ ${conv.status}`}
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[200px] p-2">
                        <div className="space-y-2">
                          {["Completed", "Reported", "Reported: pending"].map((status) => (
                            <div
                              key={status}
                              onClick={() => {
                                const updatedConversations = conversationList.map((c) =>
                                  c.id === conv.id ? { ...c, status } : c
                                );
                                setConversationList(updatedConversations);
                                setOpen({ ...open, [conv.id]: false }); // Close this specific dropdown
                              }}
                              className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-100 ${
                                conv.status === status ? "bg-gray-50" : ""
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                status === "Completed" ? "bg-green-500" : 
                                status === "Reported: pending" ? "bg-yellow-500" : "bg-red-500"
                              }`} />
                              {status}
                            </div>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  <td>
                    <Button variant="link" className="p-0 text-blue-600">
                      {conv.status.includes("Reported") ? "Take Action" : "View details"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}