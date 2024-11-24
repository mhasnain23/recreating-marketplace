"use client";

import React, { useEffect, useState } from "react";
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
import { updateStatusByOrderIdAction } from "@/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define the type for the order
interface Order {
  _id: string;
  orderDate: string;
  paymentStatus: string;
  items: { _id: string; price: string; quantity: number }[];
}
//Order[]
export default function VendorDashboardClient({ orders }: { orders: any }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOrderId, setDialogOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const router = useRouter();

  // Automatically refresh the page if updating
  useEffect(() => {
    if (isUpdating) {
      window.location.reload();
      router.refresh();
    }
  }, [isUpdating, router]);

  // Filter orders based on search term
  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Determine the color of the status badge
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Open the dialog for the selected order
  const handleViewDetails = (orderId: string) => {
    setDialogOrderId(orderId);
    const selectedOrder = orders.find((order: any) => order._id === orderId);
    if (selectedOrder) {
      setNewStatus(selectedOrder.paymentStatus); // Set the initial status
    }
  };

  // Handle updating the order status
  const handleStatusChange = async () => {
    if (dialogOrderId && newStatus) {
      try {
        setIsUpdating(true);

        // console.log(
        //   "Updating status for order:",
        //   dialogOrderId,
        //   "to:",
        //   newStatus
        // );

        const response = await updateStatusByOrderIdAction({
          orderId: dialogOrderId,
          status: newStatus,
        });

        // console.log(response);

        if (response.ok) {
          toast.success(
            `Order #${dialogOrderId} status updated to ${newStatus}!`
          );
          setDialogOrderId(null); // Close the dialog
        } else {
          console.error("Error updating status");
        }
      } catch (error) {
        console.error("Error updating order status:", error);
        toast.error("Failed to update order status!");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // log

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
        chartData={orders.reduce((acc: any[], order: any) => {
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

      {dialogOrderId && (
        <Dialog
          open={!!dialogOrderId}
          onOpenChange={() => setDialogOrderId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-[#E5E5E5]">
              <p>
                <strong>Order ID:</strong> {dialogOrderId}
              </p>
              <p>
                <strong>Status:</strong>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="ml-2 bg-[#1F2937] text-[#E5E5E5] border border-[#6D28D9] rounded-md p-2"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="shipped">shipped</option>
                </select>
              </p>
              {/* <p>
                <strong>Items:</strong>
              </p> */}
            </div>
            <Button
              disabled={isUpdating}
              onClick={handleStatusChange}
              className="mt-4 px-4 py-1 text-sm rounded bg-[#6D28D9] text-white hover:bg-purple-700"
            >
              Update Status
            </Button>
            <Button
              disabled={isUpdating}
              onClick={() => setDialogOrderId(null)}
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
