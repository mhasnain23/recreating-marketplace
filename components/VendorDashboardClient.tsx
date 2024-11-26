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
import { updateStatusByOrderIdAction } from "@/actions"; // Import action to update order status
import toast from "react-hot-toast"; // For displaying notifications
import { useRouter } from "next/navigation"; // For routing in Next.js

// Define the type for the order
interface Order {
  _id: string; // Order ID
  orderDate: string; // Date of the order
  paymentStatus: string; // Current payment status of the order
  products: [
    {
      _id: string; // Product ID
      price: string; // Price of the product
      quantity: number; // Quantity of the product ordered
      productId: string; // ID of the product
    }
  ];
}

// Main component for the Vendor Dashboard
export default function VendorDashboardClient({ orders }: { orders: Order[] }) {
  const [isUpdating, setIsUpdating] = useState(false); // State to track if an update is in progress
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [dialogOrderId, setDialogOrderId] = useState<string | null>(null); // State to manage the selected order for details
  const [newStatus, setNewStatus] = useState(""); // State for the new status to be set

  const router = useRouter(); // Router instance for navigation

  // Automatically refresh the page if updating
  useEffect(() => {
    if (isUpdating) {
      window.location.reload(); // Reload the page to reflect updates
      router.refresh(); // Refresh the router to ensure state is updated
    }
  }, [isUpdating, router]);

  // Filter orders based on search term
  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order) => order._id.toLowerCase().includes(searchTerm.toLowerCase()) // Filter orders by Order ID
      )
    : [];

  // Determine the color of the status badge based on payment status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"; // Green for paid
      case "pending":
        return "bg-yellow-100 text-yellow-800"; // Yellow for pending
      case "shipped":
        return "bg-blue-100 text-blue-800"; // Blue for shipped
      default:
        return "bg-gray-100 text-gray-800"; // Gray for unknown status
    }
  };

  // Open the dialog for the selected order
  const handleViewDetails = (orderId: string) => {
    setDialogOrderId(orderId); // Set the selected order ID
    const selectedOrder = orders.find((order: any) => order._id === orderId); // Find the selected order
    if (selectedOrder) {
      setNewStatus(selectedOrder.paymentStatus); // Set the initial status for the dialog
    }
  };

  // Handle updating the order status
  const handleStatusChange = async () => {
    if (dialogOrderId && newStatus) {
      try {
        setIsUpdating(true); // Set updating state to true

        // Call the action to update the order status
        const response = await updateStatusByOrderIdAction({
          orderId: dialogOrderId,
          status: newStatus,
        });

        if (response.ok) {
          toast.success(
            `Order #${dialogOrderId} status updated to ${newStatus}!` // Success message
          );
          setDialogOrderId(null); // Close the dialog
        } else {
          console.error("Error updating status"); // Log error if update fails
        }
      } catch (error) {
        console.error("Error updating order status:", error); // Log any caught errors
        toast.error("Failed to update order status!"); // Error message
      } finally {
        setIsUpdating(false); // Reset updating state
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 mt-24 shadow -md rounded-lg bg-[#111827] text-[#E5E5E5]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Orders Dashboard</h1>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#6D28D9]" />
          <Input
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
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
          const existingDate = acc.find((item) => item.date === date); // Check if date already exists in accumulator
          if (existingDate) {
            existingDate.orders += 1; // Increment order count for existing date
          } else {
            acc.push({ date, orders: 1 }); // Add new date entry
          }
          return acc; // Return updated accumulator
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
                    })}{" "}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="px-4 py-1 text-sm rounded bg-[#6D28D9] text-white hover:bg-purple-700"
                      onClick={() => handleViewDetails(order._id)} // Open details dialog on button click
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

      {dialogOrderId && ( // Render dialog if an order is selected
        <Dialog
          open={!!dialogOrderId}
          onOpenChange={() => setDialogOrderId(null)} // Close dialog on change
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
                  onChange={(e) => setNewStatus(e.target.value)} // Update new status on selection change
                  className="ml-2 bg-[#1F2937] text-[#E5E5E5] border border-[#6D28D9] rounded-md p-2"
                >
                  <option value="pending">pending</option>
                  <option value="paid">paid</option>
                  <option value="shipped">shipped</option>
                </select>
              </p>
              <p>
                <strong>Products:</strong>
              </p>
              <ul className="list-disc ml-5 gap-5 flex flex-col">
                {orders
                  .find((order) => order._id === dialogOrderId)
                  ?.products.map((product) => (
                    <li key={product._id} className="font-medium text-md">
                      {product.productId} - Price: ${product.price}, Quantity:{" "}
                      {product.quantity}
                    </li>
                  ))}
                <p>
                  <strong>Total Price:</strong> $
                  {orders
                    .find((order) => order._id === dialogOrderId)
                    ?.products.reduce((total: number, product) => {
                      const price =
                        typeof product.price === "number" ? product.price : 0; // Ensure price is a number
                      const quantity =
                        typeof product.quantity === "number"
                          ? product.quantity
                          : 0; // Ensure quantity is a number
                      return total + price * quantity; // Calculate total price
                    }, 0)
                    .toFixed(2)}{" "}
                </p>
              </ul>
            </div>
            <Button
              disabled={isUpdating} // Disable button while updating
              onClick={handleStatusChange} // Call function to update status
              className="mt-4 px-4 py-1 text-sm rounded bg-[#6D28D9] text-white hover:bg-purple-700"
            >
              Update Status
            </Button>
            <Button
              disabled={isUpdating} // Disable button while updating
              onClick={() => setDialogOrderId(null)} // Close dialog on button click
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
