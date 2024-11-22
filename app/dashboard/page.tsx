import { getRole } from "../utils/getRole";
import VendorDashboard from "@/components/VendorDashboard";
import BuyerDashboard from "@/components/BuyerDashboard";

async function Dashboard() {
  try {
    const role = await getRole();

    if (role === "vendor") {
      return <VendorDashboard />;
    }
    if (role === "buyer") {
      return <BuyerDashboard />;
    }
    return <div>Unauthorized Access</div>;
  } catch (error: any) {
    return (
      <>
        <div>Error: {error.message}</div>;
      </>
    );
  }
}

export default Dashboard;
