// import { verifyPayment } from "@/actions";
import { fetchUserAction, fetchUserOrders } from "@/actions";
import { OrdersDashboard } from "../OrderDasboard";
// import PaymentStatus from "../VerifyPayment";

const BuyerDashboard = async () => {
  const { data } = await fetchUserAction();
  const orders = await fetchUserOrders(data._id);

  if (!orders.success) {
    return <div>No order foind for: {orders.error}</div>;
  }

  // console.log(orders);

  return (
    <>
      <OrdersDashboard data={orders.data} role={data.role} />
    </>
    // <div>
    //   <h1>Your Orders</h1>
    //   <ul>
    //     {orders.data.map((order: any) => (
    //       <li key={order._id}>
    //         <p>Order ID: {order._id}</p>
    //         <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
    //         <p>Status: {order.paymentStatus}</p>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
};

export default BuyerDashboard;
