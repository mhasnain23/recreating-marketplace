// Function to fetch orders for a specific vendor using their vendor ID
async function fetchVendorOrders(vendorId: string) {
  // Perform a GET request to the API endpoint for fetching vendor orders
  const res = await fetch(`/api/vendor/${vendorId}`, {
    method: "GET", // Specify the HTTP method
    cache: "no-store", // Ensure that the response is not cached, allowing fresh data on each request
  });

  // Check if the response is not OK (status code outside of the range 200-299)
  if (!res.ok) {
    // If the response is not OK, throw an error with the response text
    throw new Error(`Failed to fetch orders: ${await res.text()}`);
  }

  // Parse the response JSON data
  const data = await res.json();
  // Return the 'data' property from the parsed response
  return data.data;
}

// Main component for the Vendor Dashboard
export default async function VendorDashboard({
  vendorId,
}: {
  vendorId: string;
}) {
  // Hardcoded vendor ID; in a real application, this should be replaced with dynamic logic to get the current vendor's ID
  // const vendorId = "6738df1cd3e702d6dcd3c948";

  try {
    // Attempt to fetch the vendor's orders using the fetchVendorOrders function
    const orders = await fetchVendorOrders(vendorId);

    console.log(orders);

    // Return the JSX for rendering the Vendor Dashboard
    return (
      <div>
        <h1>Vendor Dashboard</h1>
        <h2>Your Orders</h2>
        <ul>
          {/* Map over the orders array to create a list of order items */}
          {orders.map((order: any) => (
            <li key={order._id}>
              {" "}
              {/* Use the order ID as the unique key for each list item */}
              <p>
                <strong>Order ID:</strong> {order._id}{" "}
                {/* Display the Order ID */}
              </p>
              <p>
                <strong>Customer:</strong> {order.userId.name} (
                {order.userId.email}){" "}
                {/* Display the customer's name and email */}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {new Date(order.orderDate).toLocaleDateString()}{" "}
                {/* Format and display the order date */}
              </p>
              <p>
                <strong>Products:</strong> {/* Heading for the product list */}
              </p>
              <ul>
                {/* Map over the products array within the order to list each product */}
                {order.products.map((product: any, index: number) => (
                  <li key={product._id}>
                    {" "}
                    {/* Use the index as the key for each product item */}
                    {product.productId.name} - ${product.productId.price} (x
                    {product.quantity}){" "}
                    {/* Display product name, price, and quantity */}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error: any) {
    // If an error occurs during the fetch or rendering, display the error message
    return <div>Error: {error.message}</div>;
  }
}
