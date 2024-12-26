import VendorDashboard from "@/components/VendorDashboard";
import BuyerDashboard from "@/components/BuyerDashboard";
import { getRole } from "../utils/getRole";

export const dynamic = "force-dynamic";

async function Dashboard() {
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
