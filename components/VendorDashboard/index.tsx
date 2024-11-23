import { fetchAllOrderForVendorAction } from "@/actions";
import VendorDashboardClient from "@/components/VendorDashboardClient";
import VendorDashboardChart from "@/components/VendorDashboardChart";

export default async function VendorDashboard() {
  const result = await fetchAllOrderForVendorAction();

  if (!result.success) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <p className="text-red-500">{result.message}</p>
      </div>
    );
  }

  const orders = result.data;

  // Prepare data for the chart
  const chartData = Array.isArray(orders)
    ? orders.reduce((acc: any[], order) => {
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
      }, [])
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 mt-24 shadow-md rounded-lg">
      {/* Pass orders to client-side dashboard */}
      <VendorDashboardClient orders={orders} />

      {/* Display Chart */}
      {/* <VendorDashboardChart chartData={chartData} /> */}
    </div>
  );
}
