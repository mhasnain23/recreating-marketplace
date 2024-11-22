import { fetchVendorOrders } from '@/actions';

export default async function handler(req: any, res: any) {
    const { vendorId } = req.query; // Replace with auth session vendor ID
    const response = await fetchVendorOrders(vendorId);
    res.json(response);
}
