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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// user register action
export async function registerUserAction(formData: any) {
    await connectDB();
    try {
        const { userName, email, password, role } = formData;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return {
                success: false,
                message: "User already exists! please try with diffrent email",
            };
        }

        const salt = await bcryptjs.genSalt(10);
        // hashed the pass for comparing in user login action
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new UserModel({
            userName,
            email,
            password: hashedPassword,
            role,
        })

        const savedUser = await newUser.save()
        // saving our user to db and accessing the data in json formatted from mongoDB
        if (savedUser) {
            return {
                success: true,
                data: JSON.parse(JSON.stringify(savedUser))
            }
            // if any network issue or db is cruppted then this happens
        } else {
            return {
                success: false,
                message: "Something went wrong! please try again",
            };
        }
        // same for this if any network issue or db is cruppted then this happens
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, "internal server error": error })
    }
}



// Login user actions
export async function loginUserAction(formData: any) {
    await connectDB();
    try {
        const { email, password } = formData;

        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return {
                success: false,
                message: "user does'nt exist! please sign up",
            };
        }

        const checkPassword = await bcryptjs.compare(password, existingUser.password);

        if (!checkPassword) {
            return {
                success: false,
                message: "password is incorrect! please check",
            };
        }

        const createdTokenData = {
            id: existingUser._id,
            userName: existingUser.userName,
            email: existingUser.email,
            role: existingUser.role
        };

        const token = jwt.sign(createdTokenData, "DEFAULT_KEY", {
            expiresIn: "1d",
        });

        const getCookies = cookies();
        getCookies.set("token", token);

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
export async function fetchUserAction() {
    await connectDB();
    try {
        const getCookies = cookies()
        const token = getCookies.get("token")?.value || ""

        if (token === "") {
            return {
                success: false,
                message: "Token is invalid"
            }
        }

        const decodedToken = jwt.verify(token, "DEFAULT_KEY") as jwt.JwtPayload; // Type assertion
        const getUserInfo = await UserModel.findOne({ _id: decodedToken.id });

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
export async function logoutAction() {
    const getCookies = cookies();
    getCookies.set("token", "");
}


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
                allowed_countries: ["US", "PK", "CA"], // Add countries as needed
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
export const fetchUserOrders = async (userId: string) => {
    try {
        await connectDB();

        const orders = await Order.find({ userId })
            .populate('products.productId')
            .sort({ orderDate: -1 });

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