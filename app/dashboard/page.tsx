"use client";

import React, { useState, useEffect } from "react";

// import { fetchVendorData, fetchBuyerOrders } from "@/actions"; // Assume these actions are defined

const Dashboard = () => {
  const [vendorData, setVendorData] = useState<any>(null);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    const loadVendorData = async () => {
      //   const data = await fetchVendorData();
      //   setVendorData(data);
    };
    loadVendorData();
  }, []);

  useEffect(() => {
    const loadBuyerOrders = async () => {
      //   const orders = await fetchBuyerOrders();
      //   setBuyerOrders(orders);
    };
    loadBuyerOrders();
  }, []);

  const handleSearch = () => {
    // Logic to filter orders by searchId
    const filteredOrders = buyerOrders.filter((order) =>
      order.id.includes(searchId)
    );
    setBuyerOrders(filteredOrders);
  };

  return (
    <div className="dashboard mt-[10rem]">
      <h1>Vendor Dashboard</h1>
      <div>
        <h2>Sales Overview</h2>
        {/* Display vendor data */}
        {vendorData && (
          <div>
            <p>Total Sales: ${vendorData.totalSales}</p>
            <p>Pending Payments: ${vendorData.pendingPayments}</p>
            <p>Order Status: {vendorData.orderStatus}</p>
          </div>
        )}
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h1>Buyer Dashboard</h1>
      <div>
        <h2>Your Orders</h2>
        {buyerOrders.map((order) => (
          <div key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Order Date: {order.date}</p>
            <p>Status: {order.status}</p>
            <button
              onClick={() => {
                /* Logic to track order */
              }}
            >
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
