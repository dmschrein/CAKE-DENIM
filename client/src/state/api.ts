/* API Slice service to handle API interactions in a declarative way */

import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  Product,
  HomePageMetrics,
  User,
  NewUser,
  GuestUser,
  Order,
  NewOrder,
  PaymentData,
  PaymentResponse,
  Variant,
} from "shared/src/interfaces";

/* API Service to manage requests and stat in a declarative way */
export const api = createApi({
  /* Sets up the base URL for the API */
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api" /* unique path to store the API state in Redux store */,
  /* helps Redux Query manage cache invalidation by tagging resources. When a mutation (e.g., createProduct) occurs, the cache for certain tags can be invalidated*/
  tagTypes: [
    "HomePageMetrics",
    "Products",
    "Users",
    "Expenses",
    "Payments",
    "Orders",
    "Variants",
    "ProductsByCategory",
    "Favorites",
  ],

  /*
   * endpoints function where the actual API queries and mutations are defined
   * Queries are used to fetch data from the server. Each query is defined by calling build.query() and specifying:
   * Type: The type of data the query will return.
   * Parameters: Input for the query (if any).
   * Query function: Defines the URL and any additional request parameters (e.g., search strings).
   * Queries fetch data
   */
  endpoints: (build) => ({
    getHomePageMetrics: build.query<HomePageMetrics, void>({
      query: () => {
        console.log("Fetching home page metrics...");
        return "/home";
      },
      providesTags: ["HomePageMetrics"],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Home page metrics fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching home page metrics: ", error);
        }
      },
    }),

    /*
     * The query sends a GET request to /products and optionally includes a search parameter.
     * The response will be an array of Product[].
     * If a search term is provided, it appends ?search=<search> as a query string to the URL.
     * providesTags: ["Products"] caches the products and tags them under "Products" for potential invalidation later.
     */
    getProducts: build.query<
      {
        products: Product[];
        subcategories: { id: string; name: string }[];
        categories: { id: string; name: string };
      },
      { search?: string; categoryName?: string; subcategory?: string }
    >({
      query: ({ search, categoryName, subcategory }) => {
        console.log("Getting products with data: ", {
          search,
          categoryName,
          subcategory,
        });
        return {
          url: "/api/products",
          params: {
            ...(search && { search }),
            ...(categoryName && { categoryName }),
            ...(subcategory && { subcategory }),
          },
        };
      },
      providesTags: ["Products"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Products fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      },
    }),

    /*
     * The query sends a GET request to /products/collection/${categoryName} to return products of a specific category
     * The response will be an array of Product[]
     * providesTags: ["Products"] caches the products and tages them under "Products" for potential invalidation later
     */
    getProductsByPrimaryCategory: build.query<{ products: Product[] }, string>({
      query: (primaryCategory) => {
        console.log("Getting products for category: ", primaryCategory);
        return {
          url: `/api/products/collection/${primaryCategory}`,
        };
      },
      providesTags: (_, __, primaryCategory) => [
        { type: "Products", name: primaryCategory },
      ],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          console.log("Products for category fetched successfully: ", data);
        } catch (error) {
          console.error("Error fetching products for category: ", error);
        }
      },
    }),

    /*
     * The query sends a GET request to /products and optionally includes a search parameter.
     * The response will be an array of Product[].
     * If a search term is provided, it appends ?search=<search> as a query string to the URL.
     * providesTags: ["Products"] caches the products and tags them under "Products" for potential invalidation later.
     */
    searchProducts: build.query<Product[], { search: string }>({
      query: ({ search }) => ({
        url: "/api/products",
        params: { search },
      }),
      providesTags: ["Products"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Products fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      },
    }),
    /*
     * The query sends a GET request to /products.
     * The response will be an array of Product[].
     * If a search term is provided, it appends ?search=<search> as a query string to the URL.
     * providesTags: ["Products"] caches the products and tags them under "Products" for potential invalidation later.
     */
    getAllProducts: build.query<Product[], void>({
      query: () => {
        console.log("Fetching all products...");
        return {
          url: "/api/products",
        };
      },
      providesTags: ["Products"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Products fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching products: ", error);
        }
      },
    }),
    getProductById: build.query<Product, string>({
      query: (productId) => {
        console.log("Fetching product by ID: ", productId);
        return { url: `/api/products/${productId}` };
      },
      providesTags: (_, __, productId) => [{ type: "Products", id: productId }],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Product fetched successfully:", data);
        } catch (error) {
          console.error("Error fetched product by ID: ", error);
        }
      },
    }),
    /*
     * This query sends a GET request to /products
     * The response will be an array of Variants[]
     *
     */
    getVariantsByProductId: build.query<Variant[], string>({
      query: (productId) => {
        console.log("Fetching product variants by product ID:", productId);
        return { url: `/api/products/${productId}/variants` };
      },
      providesTags: (_, __, productId) => [{ type: "Variants", id: productId }],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Product variants fetched successfully:", data);
        } catch (error) {
          console.error(
            "Error fetching product variants by product ID:",
            error,
          );
        }
      },
    }),

    /*
     * * This mutation sends a POST request to /users with a NewUser object in the request body
     * and expects a User object in response.
     */
    createUser: build.mutation<User, NewUser>({
      query: (newUser) => {
        console.log("Creating user with data:", newUser);
        return {
          url: "/api/users",
          method: "POST",
          body: newUser,
        };
      },
      invalidatesTags: ["Users"],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("✅ User created successfully:", data);
        } catch (error: any) {
          // 1️⃣ Log the entire error object first
          // console.error(
          //   "❌ Full Error Object:",
          //   JSON.stringify(error, null, 2),
          // );
          // Correctly extract the server response
          const serverResponse = error?.error?.data || error?.data;

          if (serverResponse) {
            console.log("Extracted Server Response: ", serverResponse);
            console.log("Extracted Error Message:", serverResponse.message);
          } else {
            console.log(
              "Unexpected Error Format:",
              JSON.stringify(error, null, 2),
            );
          }
        }
      },
    }),
    /*
     * * This mutation sends a PUT request to /users with an updated User object in the request body
     * and expects a User object in response.
     */
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUserData }) => {
        console.log("Updated user with data: ", updatedUserData);
        return {
          url: `/users/${userId}`,
          method: "PATCH",
          body: updatedUserData,
        };
      },
      // eslint-disable-line
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Users", id: userId },
      ],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("User updated successfully: ", data);
        } catch (error) {
          console.log("Error updating user: ", error);
        }
      },
    }),
    /*
     * This query sends a GET request to /users and expects an array of User[] objects in response.
     */
    getUsers: build.query<User[], void>({
      query: () => {
        console.log("Fetching all users...");
        return "/api/users";
      },
      providesTags: ["Users"],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Users fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching users: ", error);
        }
      },
    }),
    /*
     * This query sends a GET request to /users and expects an User objects in response.
     */
    getUserByEmail: build.query<User, string>({
      query: (email) => {
        console.log("Fetching user by email:", email);
        return {
          url: `/api/users?email=${encodeURIComponent(email)}`,
          method: "GET",
        };
      },
      providesTags: (_, __, email) => [{ type: "Users", id: email }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("User fetched successfully: ", data);
        } catch (error: any) {
          console.error("Error fetching user by email: ", error);
          if (error instanceof Error) {
            console.error("Error message: ", error.message);
            console.error("Error stack: ", error.stack);
          } else {
            console.error("Error details: ", JSON.stringify(error, null, 2));
          }
        }
      },
    }),

    /*
     * This query sends a GET request to /users with the userId as a paramter and expects an User objects in response.
     */
    getUserById: build.query<User, string>({
      query: (userId) => {
        console.log(`Fetching user with ID: ${userId}`);
        return `/users/${userId}`;
      },
      providesTags: ["Users"],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("User fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching user: ", error);
        }
      },
    }),
    /*
     * This mutation sends a POST to /users with a GuestUser object in the request body
     * and expects a User object in response.
     */
    createGuestUser: build.mutation<GuestUser, { email: string }>({
      query: (guestUserData) => {
        console.log("Creating guest user with data:", guestUserData);
        return {
          url: "/api/users",
          method: "POST",
          body: guestUserData,
        };
      },
      invalidatesTags: ["Users"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Guest user created successfully: ", data);
        } catch (error) {
          console.error("Error creating guest user: ", error);
        }
      },
    }),
    /*
     * This mutation sends a POST to /api/payments to process a payment
     * Expects a payment response from Stripe API
     */
    createPayment: build.mutation<PaymentResponse, PaymentData>({
      query: (paymentData) => {
        console.log("Creating payment with data: ", paymentData);
        return {
          url: "/api/stripe/payments",
          method: "POST",
          body: paymentData,
        };
      },
      invalidatesTags: ["Payments"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Payment processed successfully: ", data);

          // Access the client_secret from the payment response
          const clientSecret = data.client_secret;
          if (!clientSecret) {
            throw new Error("Client secret not found in payment response.");
          }
          // Use the client_secret in your payment processing flow here
          console.log("Client secret received: ", clientSecret);
        } catch (error) {
          console.error("Error processing payment: ", error);
        }
      },
    }),
    /*
     * This mutation sends a POST to /orders to create an order for a customer
     * Expects an Order object response
     */
    createOrder: build.mutation<Order, NewOrder>({
      query: (newOrder) => {
        console.log("Creating an order with data: ", newOrder);
        return {
          url: "/api/orders",
          method: "POST",
          body: newOrder,
        };
      },
      invalidatesTags: ["Orders"],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Order created successfully: ", data);
        } catch (error) {
          console.error("Error creating order: ", error);
        }
      },
    }),
    /*
     * This query gets the Orders associated with an email
     */
    getOrdersByUserId: build.query<Order[], string>({
      query: (userId) => {
        console.log("Fetching orders from user: ", userId);
        return {
          url: `/api/orders?userId=${encodeURIComponent(userId)}`,
        };
      },
      providesTags: (_, __, userId) => [{ type: "Orders", id: userId }],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Order fetched successfully: ", data);
        } catch (error) {
          console.error("Error fetching order by userId: ", error);
        }
      },
    }),
    updatePassword: build.mutation<
      { message: string }, // Expected response
      { userId: string; currentPassword: string; newPassword: string } // Payload
    >({
      query: ({ userId, currentPassword, newPassword }) => {
        console.log("Updating password for user:", userId);
        return {
          url: `/api/users/${userId}/password`,
          method: "PATCH",
          body: { currentPassword, newPassword },
        };
      },
      invalidatesTags: ["Users"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Password updated successfully:", data);
        } catch (error) {
          console.error("Error updating password:", error);
        }
      },
    }),
    updateFavorites: build.mutation<
      { message: string }, // Expected response
      { userId: string; productId: string } // Payload
    >({
      query: ({ userId, productId }) => ({
        url: `/api/users/${userId}/favorites`,
        method: "PATCH",
        body: { productId },
      }),
      invalidatesTags: ["Favorites"],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Favorites updated successfully:", data);
        } catch (error) {
          console.error("Error updating favorites:", error);
        }
      },
    }),
    getFavorites: build.query<Product[], string>({
      query: (userId) => ({
        url: `/api/users/${userId}/favorites`,
        method: "GET",
      }),
      providesTags: (_, __, userId) => [{ type: "Favorites", id: userId }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Favorites fetched successfully:", data);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      },
    }),
  }),
});

/* Export React hooks for each query or mutation. Used in components to easily interact with API */
export const {
  useGetHomePageMetricsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetVariantsByProductIdQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateGuestUserMutation,
  useUpdateUserMutation,
  useGetOrdersByUserIdQuery,
  useCreatePaymentMutation,
  useCreateOrderMutation,
  useGetProductsByPrimaryCategoryQuery,
  useUpdatePasswordMutation,
  useUpdateFavoritesMutation,
  useGetFavoritesQuery,
} = api;
