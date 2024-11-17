import { fetchProductByIdAction } from "@/actions";
import DetailsPage from "@/components/details-page";

const Details = async ({ params }: { params: any }) => {
  console.log(params);

  // Assuming params contains an id property
  const productId = params.id; // Extract the ID from params

  // Fetch the product using the extracted ID
  const singleProduct = await fetchProductByIdAction(productId);

  //const getProductInfo = await singleProduct.data;
  // Log the plain product to see its structure
  // console.log(singleProduct, "singleProduct");

  return <DetailsPage getProductInfo={singleProduct.data} />; // Wrap in an array
};

export default Details;
