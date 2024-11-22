import { fetchUserAction } from "@/actions";

export const getRole = async () => {
    // Replace this with your actual user role logic.
    const user = await fetchUserAction();
    return user.data?.role; // 'vendor' or 'buyer'
};