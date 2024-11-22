// import { useEffect, useState } from "react";
import { fetchUserAction, fetchUserOrders, fetchVendorOrders } from "@/actions";
// import SalesChart from "../SalesChart";
import { OrdersDashboard } from "../OrderDasboard";
// import PaymentStatus from "../VerifyPayment";

export default async function VendorDashboard() {
  const { data } = await fetchUserAction(); // Retrieve userId from action
  const order = await fetchVendorOrders(data._id);

  // console.log(data._id);

  console.log(order);

  // const sessionId = await order.data.stripeSessionId;

  return (
    <div className="max-w-7xl mx-auto mt-[10rem]">
      <h1>Vendor Dashboard</h1>
      <OrdersDashboard data={order.data} role={data.role} />
      {/* <PaymentStatus sessionId={sessionId} /> */}
    </div>
  );
}
