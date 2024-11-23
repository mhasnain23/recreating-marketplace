"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import VendorDashboardChart from "./VendorDashboardChart";

export default function VendorDashboardClient({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter orders based only on `orderId`
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
    <div className="p-8 max-w-7xl mx-auto space-y-8 mt-24 shadow-md rounded-lg bg-[#111827] text-[#E5E5E5]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Orders Dashboard</h1>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#6D28D9]" />
          <Input
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-2 py-2 border border-[#6D28D9] bg-[#1F2937] text-[#E5E5E5] placeholder:text-gray-500 rounded-lg"
          />
        </div>
      </div>

      <VendorDashboardChart
        chartData={orders.reduce((acc: any[], order) => {
          const date = new Date(order.orderDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const existingDate = acc.find((item) => item.date === date);
          if (existingDate) {
            existingDate.orders += 1;
          } else {
            acc.push({ date, orders: 1 });
          }
          return acc;
        }, [])}
      />

      <Card className="shadow-md bg-[#1F2937]">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#E5E5E5]">Order ID</TableHead>
                <TableHead className="text-[#E5E5E5]">Date</TableHead>
                <TableHead className="text-[#E5E5E5]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
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
