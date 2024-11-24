"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function OrderDetailsModal({ order }: { order: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-[#E5E5E5]">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {order.paymentStatus}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul className="list-disc ml-5">
              {order.items.map((item: any) => (
                <li key={item._id}>
                  {item.name} - {item.quantity} pcs
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
      <button
        className="px-4 py-1 text-sm rounded bg-[#6D28D9] text-white hover:bg-purple-700"
        onClick={() => setOpen(true)}
      >
        View Details
      </button>
    </>
  );
}
