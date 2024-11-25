"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Search, TrendingUp } from "lucide-react";

interface Order {
  _id: string;
  role: string;
  orderDate: string;
  paymentStatus: string;
  amount?: number;
}

interface OrdersProps {
  data: Order[];
  role: string;
}

export function OrdersDashboard({ data, role }: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter orders based on search term
  const filteredOrders = Array.isArray(data)
    ? data.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Prepare data for chart
  // const chartData = Array.isArray(data)
  //   ? data.reduce((acc: any[], order) => {
  //       const date = new Date(order.orderDate).toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       });

  //       const existingDate = acc.find((item) => item.date === date);

  //       if (existingDate) {
  //         existingDate.orders += 1;
  //       } else {
  //         acc.push({ date, orders: 1 });
  //       }
  //       return acc;
  //     }, [])
  //   : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen space-y-8 mt-24 dark:bg-[#111827] shadow-md rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white/80">
          Orders Dashboard
        </h1>
        {role === "vendor" ? (
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-white" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-2 py-2 border border-gray-200 placeholder:text-white bg-black/70 rounded-lg"
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">
              Total Orders
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white/70">
              {data.length}
            </div>
          </CardContent>
        </Card>

        {/* <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Orders Chart
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white/80">
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="text-white/70">
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium text-white/80">
                    {order._id}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(order.paymentStatus)}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* <TooltipProvider>
                      <Tooltip delayDuration={2}>
                        <TooltipTrigger>
                          <button className="text-sm text-white/80 text-primary hover:underline">
                            View Details
                          </button>
                        </TooltipTrigger> */}
                    {/* <TooltipContent className="bg-white/80">
                          <p className="text-gray-800">
                            Click to view order details
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
