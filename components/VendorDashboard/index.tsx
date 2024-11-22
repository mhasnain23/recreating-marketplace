import { fetchUserAction } from "@/actions";
//fetchVendorOrders
import { OrdersDashboard } from "../OrderDasboard";

export default async function VendorDashboard() {
  try {
    // console.log("Vendor ID:", data._id); // Ensure vendorId is correct

    // const orderResponse = await fetchVendorOrders(data._id);

    // console.log(orderResponse);    const { data } = await fetchUserAction(); // Fetch user data

    // if (!orderResponse.success) {
    //   console.error("Error fetching orders:", orderResponse.error);
    //   return <div>Error fetching vendor orders</div>;
    // }

    return (
      <div className="max-w-7xl mx-auto mt-[10rem]">
        <h1>Vendor Dashboard</h1>
        {/* <OrdersDashboard data={orderResponse.data} role={data.role} /> */}
      </div>
    );
  } catch (error: any) {
    console.error("Error in VendorDashboard:", error.message);
    return <div>Failed to load dashboard</div>;
  }
}
