import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const url = req.nextUrl.pathname;

    // Check if the user is authenticated
    if (!token) {
        return NextResponse.redirect('/signin'); // Redirect to login if not authenticated
    }

    // Role-based redirection
    if (url.startsWith('/admin') && token.role !== 'admin') {
        return NextResponse.redirect('/admin'); // Redirect non-admin users
    }

    if (url.startsWith('/vendor') && token.role !== 'vendor') {
        return NextResponse.redirect('/dashboard'); // Redirect non-vendors
    }
    if (url.startsWith('/buyer') && token.role === 'buyer') {
        return NextResponse.redirect('/products'); // Redirect non-vendors
    }

    return NextResponse.next(); // Allow access if roles match
}

export const config = {
    matcher: ['/admin/:path*', '/vendor/:path*'], // Routes to protect
};