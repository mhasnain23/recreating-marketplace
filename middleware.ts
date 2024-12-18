import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes and their allowed roles
const protectedRoutes = {
    '/vendor': ['vendor'],
    '/buyer': ['buyer'],
} as const;

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const path = req.nextUrl.pathname;

    // Check if authentication is required for this path
    const isProtectedRoute = Object.keys(protectedRoutes).some(route =>
        path.startsWith(route)
    );

    // Redirect to signin if no token on protected routes
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Handle role-based access
    if (token?.role) {
        // Redirect buyers to products page
        if (path.startsWith('/buyer') && token.role === 'buyer') {
            return NextResponse.redirect(new URL('/products', req.url));
        }

        // Redirect non-vendors away from vendor routes
        if (path.startsWith('/vendor') && token.role !== 'vendor') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protected routes
        '/vendor/:path*',
        '/buyer/:path*',
        // Add other protected paths as needed
    ],
};