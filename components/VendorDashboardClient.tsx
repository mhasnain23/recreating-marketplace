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
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the type for the order
interface Order {
  _id: string;
  orderDate: string;
  paymentStatus: string;
  items: { _id: string; name: string; quantity: number }[];
}

export default function VendorDashboardClient({ orders }: { orders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

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

  const handleViewDetails = async (orderId: string) => {
    try {
      const res = await fetch(`/api/getOrderDetails?id=${orderId}`);
      const data = await res.json();

      if (data.success) {
        setSelectedOrder(data.order);
        setNewStatus(data.order.paymentStatus); // Set the current status
      } else {
        alert("Failed to fetch order details!");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("An error occurred while fetching order details.");
    }
  };

  const handleStatusChange = async () => {
    if (selectedOrder && newStatus !== selectedOrder.paymentStatus) {
      try {
        // Debug log to check the request payload
        console.log(
          "Updating status for order:",
          selectedOrder._id,
          "to:",
          newStatus
        );

        const res = await fetch(`/api/updateOrderStatus`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.parse(
            JSON.stringify({
              orderId: selectedOrder._id,
              newStatus,
            })
          ),
        });

        const data = await res.json();
        console.log("API response:", data); // Debug log

        if (data.success) {
          setSelectedOrder({
            ...selectedOrder,
            paymentStatus: newStatus,
          });
          alert("Status updated successfully!");
          setSelectedOrder(null);
        } else {
          alert("Failed to update status!");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        alert("An error occurred while updating the status.");
      }
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
                <TableHead className="text-[#E5E5E5]">Actions</TableHead>
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
                  <TableCell>
                    <Button
                      className="px-4 py-1 text-sm rounded bg-[#6D28D9] text-white hover:bg-purple-700"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-[#E5E5E5]">
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedOrder.orderDate).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="ml-2 bg-[#1F2937] text-[#E5E5E5] border border-[#6D28D9] rounded-md p-2"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </p>
              <p>
                <strong>Items:</strong>
              </p>
              <ul className="list-disc ml-5">
                {selectedOrder.items?.map((item) => (
                  <li key={item._id}>
                    {item.name} - {item.quantity} pcs
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={handleStatusChange}
              className="mt-4 px-4 py-1 text-sm rounded bg-[#6D28D9] text-white hover:bg-purple-700"
            >
              Update Status
            </Button>
            <Button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 px-4 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
