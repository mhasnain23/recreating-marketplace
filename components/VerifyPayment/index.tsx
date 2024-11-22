import { verifyPayment } from "@/actions";

const PaymentStatus = async ({ sessionId }: { sessionId: any }) => {
  const result = await verifyPayment(sessionId);

  console.log(result);

  if (!result.success) {
    return <div>Failed to verify payment: {result.error}</div>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ marginBottom: "10px" }}>Payment Status</h1>
      {result.data ? (
        <>
          <p style={{ marginBottom: "10px" }}>
            Status: {result.data.paymentStatus}
          </p>
          <p style={{ marginBottom: "10px" }}>
            Order Details: {JSON.stringify(result.data.orderDetails)}
          </p>
        </>
      ) : (
        <p style={{ marginBottom: "10px" }}>No payment data available.</p>
      )}
    </div>
  );
};

export default PaymentStatus;
