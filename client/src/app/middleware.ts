import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized: ({ token }) => !!token, // User must be authenticated
  },
});

// Apply middleware only to protected routes
export const config = {
  matcher: ["/account/:path*"],
};
