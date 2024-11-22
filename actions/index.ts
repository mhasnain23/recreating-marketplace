'use server';
import connectDB from "@/lib/mongodb";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import bcryptjs from "bcryptjs"
import { NextResponse } from "next/server";
import UserModel from "@/models/user";
import Product from "@/models/product";
import { revalidatePath } from "next/cache";
import Stripe from 'stripe';
import Order from "@/models/order";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// user register action
// This function is used to register a new user
export async function registerUserAction(formData: any) {
    await connectDB();
    try {
        const { userName, email, password, role } = formData;
        const existingUser = await UserModel.findOne({ email });

        // Check if user already exists
        if (existingUser) {
            return {
                success: false,
                message: "User already exists! please try with diffrent email",
            };
        }

        // Generate salt for password hashing
        const salt = await bcryptjs.genSalt(10);
        // Hash the password for secure storage
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create a new user instance
        const newUser = new UserModel({
            userName,
            email,
            password: hashedPassword,
            role,
        })

        // Save the new user to the database
        const savedUser = await newUser.save()
        // If user is saved successfully, return the user data
        if (savedUser) {
            return {
                success: true,
                data: JSON.parse(JSON.stringify(savedUser))
            }
            // If any error occurs during user registration, return an error message
        } else {
            return {
                success: false,
                message: "Something went wrong! please try again",
            };
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, "internal server error": error })
    }
}



// Login user actions
// This function is used to login a user
export async function loginUserAction(formData: any) {
    await connectDB();
    try {
        const { email, password } = formData;

        // Find the user with the provided email
        const existingUser = await UserModel.findOne({ email });

        // If user does not exist, return an error message
        if (!existingUser) {
            return {
                success: false,
                message: "user does'nt exist! please sign up",
            };
        }

        // Compare the provided password with the stored password
        const checkPassword = await bcryptjs.compare(password, existingUser.password);

        // If password is incorrect, return an error message
        if (!checkPassword) {
            return {
                success: false,
                message: "password is incorrect! please check",
            };
        }

        // If password is correct, create a JWT token for the user
        const createdTokenData = {
            id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
            role: existingUser.role
        };

        const token = jwt.sign(createdTokenData, "DEFAULT_KEY", {
            expiresIn: "1d",
        });

        // Set the token in the cookies
        const getCookies = cookies();
        getCookies.set("token", token);

        // Return a success message
        return {
            success: true,
            message: "Login successfull",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "something went wrong! please try again",
        };
    }
}


// fetch user action for authentication
// This function is used to fetch the user data for authentication
export async function fetchUserAction() {
    await connectDB();
    try {
        const getCookies = cookies()
        const token = getCookies.get("token")?.value || ""

        // If token is not provided, return an error message
        if (token === "") {
            return {
                success: false,
                message: "Token is invalid"
            }
        }

        // Verify the token and get the user data
        const decodedToken = jwt.verify(token, "DEFAULT_KEY") as jwt.JwtPayload; // Type assertion
        const getUserInfo = await UserModel.findOne({ _id: decodedToken.id });

        // If user data is found, return the user data
        if (getUserInfo) {
            return {
                success: true,
                data: JSON.parse(JSON.stringify(getUserInfo))
            }
        } else {
            return {
                success: false,
                message: "some error occured! please try again",
            };
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "something went wrong! please try again",
        };
    }
}


// Logout user
// This function is used to logout a user
export async function logoutAction() {
    const getCookies = cookies();
    getCookies.set("token", "");
}


// This function is used to add a new product
export async function productsFormAction(formData: any, pathToRevalidate: any) {
    await connectDB();
    try {
        const {
            productName,
            productDescription,
            productPrice,
            productStock,
            productImage
        } = formData;
        if (!productName || !productDescription || !productPrice || !productStock || !productImage) {
            return {
                success: false,
                message: "All feilds are required"
            }
        }

        const productFormData = new Product({
            productName,
            productDescription,
            productPrice,
            productStock,
            productImage
        })

        productFormData.save()


        if (productFormData) {
            return {
                success: true,
                message: "Product added successfully"
            }
        }
        revalidatePath(pathToRevalidate);
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong! please try again.",
        })
    }
}


// Fetch all products from mongoDB
// This function is used to fetch all products from the database
export async function fetchProductsAction() {
    await connectDB();
    try {
        const products = await Product.find({});
        return {
            success: true,
            data: JSON.parse(JSON.stringify(products))
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "something went wrong! please try again",
        };
    }
}



// fetch product by id for details page
// This function is used to fetch a product by its id
export async function fetchProductByIdAction(id: any) {
    await connectDB();
    try {
        const products = await Product.findById({ _id: id });
        return {
            success: true,
            data: JSON.parse(JSON.stringify(products))
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "something went wrong! please try again",
        };
    }
}


// fetch filter product
// This function is used to search for products
export const searchProducts = async (query: string) => {
    try {
        const products = await Product.find({
            $or: [
                { productName: { $regex: query, $options: 'i' } },
            ]
        }); // Add limit to prevent too many results

        return { success: true, data: products };
    } catch (error) {
        console.error('Error searching products:', error);
        return { success: false, error: 'Failed to search products' };
    }
}

// Edit product action
// This function is used to edit a product
interface EditProductData {
    productId: string;
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: string;
    productImage: string;
}


export const editProductAction = async (data: EditProductData) => {
    try {
        await connectDB();

        const updatedProduct = await Product.findByIdAndUpdate(
            data.productId,
            {
                productName: data.productName,
                productDescription: data.productDescription,
                productPrice: parseFloat(data.productPrice),
                productStock: parseInt(data.productStock),
                productImage: data.productImage,
            },
            { new: true } // Returns the updated document
        );

        if (!updatedProduct) {
            return { success: false, message: "Product not found" };
        }

        return { success: true, data: updatedProduct };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, message: "Failed to update product" };
    }
};

// Delete product action
// This function is used to delete a product
export const deleteProductAction = async (productId: string) => {
    try {
        await connectDB();

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return { success: false, message: "Product not found" };
        }

        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, message: "Failed to delete product" };
    }
};

// Create payment session
// This function is used to create a payment session for the user
export const createPaymentSession = async (items: any[], userId: string) => {
    try {
        if (!items || items.length === 0) {
            return { success: false, error: 'Cart is empty' };
        }

        if (!userId) {

            return { success: false, error: 'User not authenticated' };
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ["US", "PK"], // Add countries as needed
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
            ],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.productName,
                        images: [item.productImage],
                    },
                    unit_amount: Math.round(item.productPrice * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
            metadata: {
                userId: userId,
            },
        });

        // Create pending order in database with a temporary shipping address
        await Order.create({
            userId: userId,
            products: items.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                price: item.productPrice
            })),
            totalAmount: items.reduce((total, item) => total + (item.productPrice * item.quantity), 0),
            stripeSessionId: session.id,
            paymentStatus: 'pending',
            shippingAddress: 'Pending Stripe Checkout', //lu Temporary vae, will be updated in webhook
        });

        return { success: true, url: session.url };
    } catch (error: any) {
        console.error('Payment session error:', error);
        return {
            success: false,
            error: error.message || 'Failed to create payment session'
        };
    }
};

// Handle Stripe webhook
// This function is used to handle Stripe webhooks
export const handleStripeWebhook = async (event: any) => {
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;

                // Format shipping address
                const shippingAddress = session.shipping ?
                    `${session.shipping.address.line1}, 
                     ${session.shipping.address.city}, 
                     ${session.shipping.address.state}, 
                     ${session.shipping.address.postal_code}, 
                     ${session.shipping.address.country}`
                    : 'No shipping address provided';

                // Update order status in database
                await Order.findOneAndUpdate(
                    { stripeSessionId: session.id },
                    {
                        paymentStatus: 'completed',
                        shippingAddress: shippingAddress,
                        '$set': {
                            'metadata.stripePaymentId': session.payment_intent,
                            'metadata.paymentMethod': session.payment_method_types[0],
                        }
                    }
                );

                // Update product stock
                const order = await Order.findOne({ stripeSessionId: session.id });
                if (order) {
                    for (const item of order.products) {
                        await Product.findByIdAndUpdate(
                            item.productId,
                            { $inc: { productStock: -item.quantity } }
                        );
                    }
                }
                break;

            case 'checkout.session.expired':
                await Order.findOneAndUpdate(
                    { stripeSessionId: event.data.object.id },
                    { paymentStatus: 'failed' }
                );
                break;
        }

        return { success: true };
    } catch (error) {
        console.error('Webhook error:', error);
        return { success: false, error: 'Webhook handler failed' };
    }
};

// Fetch orders for a user
// This function is used to fetch all orders for a user
export const fetchUserOrders = async (userId: string) => {
    try {
        await connectDB();

        const orders = await Order.find({ userId })
            .populate('products.productId')
            .sort({ orderDate: -1 });

        if (!orders) {
            throw new Error('No orders found for the user');
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(orders))
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { success: false, error: 'Failed to fetch orders' };
    }
};

// Verify payment status
// This function is used to verify the payment status of an order
export const verifyPayment = async (sessionId: string) => {
    try {
        await connectDB();

        const order = await Order.findOne({ stripeSessionId: sessionId });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        return {
            success: true,
            data: {
                paymentStatus: order.paymentStatus,
                orderDetails: order
            }
        };
    } catch (error) {
        console.error('Error verifying payment:', error);
        return { success: false, error: 'Failed to verify payment' };
    }
};


// Fetch all orders for a vendor
// This function is used to fetch all orders for a vendor
// export const fetchVendorOrders = async (vendorId: string) => {
//     try {
//         await connectDB();

//         // Update query to reflect the actual schema
//         const orders = await Order.find({ 'products.vendorId': vendorId })
//             .populate('userId', 'email name')
//             .populate('products.productId', 'name email') // Adjust fields as per schema
//             .sort({ orderDate: -1 });

//         if (!orders || orders.length === 0) {
//             console.log(`No orders found for vendorId: ${vendorId}`);
//             throw new Error('No orders found for the vendor');
//         }

//         return {
//             success: true,
//             data: JSON.parse(JSON.stringify(orders)),
//         };
//     } catch (error: any) {
//         console.error('Error fetching orders for vendor:', error.message);
//         return { success: false, error: 'Failed to fetch orders for vendor' };
//     }
// };

