/* API Slice service to handle API interactions in a declarative way */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product, HomePageMetrics, User, NewUser } from "@/interfaces";

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
      query: () => "/home",
      providesTags: ["HomePageMetrics"],
    }),

    /*
     * The query sends a GET request to /products and optionally includes a search parameter.
     * The response will be an array of Product[].
     * If a search term is provided, it appends ?search=<search> as a query string to the URL.
     * providesTags: ["Products"] caches the products and tags them under "Products" for potential invalidation later.
     */

    getProducts: build.query<Product[], { search?: string; category?: string }>(
      {
        query: ({ search, category }) => ({
          url: "/products",
          params: {
            ...(search && { search }),
            ...(category && { category }),
          },
        }),
        providesTags: ["Products"],
      },
    ),
    getProductById: build.query<Product, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
      }),
      providesTags: (_, __, productId) => [{ type: "Products", id: productId }],
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
     * This query sends a GET request to /users and expects an array of User[] objects in response.
     */
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    /*
     * This query sends a GET request to /users and expects an User objects in response.
     */
    getUserByEmail: build.query<User, string>({
      query: (email) => ({
        url: `/users?${email}`,
      }),
      providesTags: (_, __, email) => [{ type: "Users", id: email }],
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
} = api;
