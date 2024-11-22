import { getRole } from "../utils/getRole";
import VendorDashboard from "@/components/VendorDashboard";
import BuyerDashboard from "@/components/BuyerDashboard";
import { fetchUserAction } from "@/actions";

async function Dashboard() {
  const user = await fetchUserAction();
  const vendorId = user.data.role === "vendor" ? user.data._id : null;

  try {
    const role = await getRole();

    if (role === "vendor") {
      return <VendorDashboard vendorId={vendorId} />;
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
