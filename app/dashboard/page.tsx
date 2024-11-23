import VendorDashboard from "@/components/VendorDashboard";
import BuyerDashboard from "@/components/BuyerDashboard";
// import { fetchUserAction } from "@/actions";
import { getRole } from "../utils/getRole";

async function Dashboard() {
  // const { data } = await fetchUserAction();
  // const vendorId = (await data.role) === "vendor" ? data._id : null; // Retrieve userId from action

  try {
    const role = await getRole();

    if (role === "vendor") {
      return <VendorDashboard />;
    }
    if (role === "buyer") {
      return <BuyerDashboard />;
    }
    return <div className="mt-24">Unauthorized Access</div>;
  } catch (error: any) {
    return (
      <>
        <div>Error: {error.message}</div>;
      </>
    );
  }
}

export default Dashboard;
