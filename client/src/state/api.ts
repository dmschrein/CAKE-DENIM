/* API Slice service to handle API interactions in a declarative way */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Product,
  HomePageMetrics,
  User,
  NewUser,
  UserType,
  GuestUser,
} from "@/interfaces";

/* API Service to manage requests and stat in a declarative way */
export const api = createApi({
  /* Sets up the base URL for the API */
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api" /* unique path to store the API state in Redux store */,
  /* helps Redux Query manage cache invalidation by tagging resources. When a mutation (e.g., createProduct) occurs, the cache for certain tags can be invalidated*/
  tagTypes: ["HomePageMetrics", "Products", "Users", "Expenses"],

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

    getProducts: build.query<Product[], { search?: string; category?: string }>(
      {
        query: ({ search, category }) => {
          console.log("Getting products with data: ", { search, category });
          return {
            url: "/products",
            params: {
              ...(search && { search }),
              ...(category && { category }),
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
      },
    ),
    getProductById: build.query<Product, string>({
      query: (productId) => {
        console.log("Fetching product by ID: ", productId);
        return { url: `/products/${productId}` };
      },
      providesTags: (_, __, productId) => [{ type: "Products", id: productId }],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("Product fetched successfully:", data);
        } catch (error) {
          console.error("Error fetched producted by ID: ", error);
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
          url: "/users",
          method: "POST",
          body: newUser,
        };
      },
      invalidatesTags: ["Users"],
      onQueryStarted: async (_arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("User created sucessfully: ", data);
        } catch (error) {
          console.error("Error creating user: ", error);
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
      invalidatesTags: (result, error, { userId }) => [
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
        return "/users";
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
        return { url: `/users?${email}` };
      },
      providesTags: (_, __, email) => [{ type: "Users", id: email }],
      onQueryStarted: async (_args, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log("User fetched successfully: ", data);
        } catch (error) {
          console.error("Error fetching user by email: ", error);
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
          url: "/users",
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
  }),
});

/* Export React hooks for each query or mutation. Used in components to easily interact with API */
export const {
  useGetHomePageMetricsQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useGetUsersQuery,
  useCreateGuestUserMutation,
  useUpdateUserMutation,
} = api;
