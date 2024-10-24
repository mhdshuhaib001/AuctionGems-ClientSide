import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  FormDataType,
  SellerCreationRequest,
  SellerResponse,
  AddProductResponse,
  ProductsResponse,
} from '../../interface/sellerTypes/sellerApiTypes';
import { OrderResponse } from '../../interface/orderTypes/orderType';

// Define the seller API using RTK Query
export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8001',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const seller = localStorage.getItem('sellerToken');
      const user = localStorage.getItem('accessToken');
      if (seller) {
        headers.set('SellerAuthorization', `Bearer ${seller}`);
      }
      if (user) {
        headers.set('UserAuthorization', `Bearer ${user}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createSeller: builder.mutation<SellerResponse, SellerCreationRequest>({
      query: (sellerBrand) => ({
        url: '/api/seller/createseller',
        method: 'POST',
        body: sellerBrand,
      }),
    }),
    updateSellerProfile: builder.mutation<SellerResponse, FormData>({
      query: (formData) => ({
        url: '/api/seller/updateseller',
        method: 'PUT',
        body: formData,
      }),
    }),
    fetchSellerById: builder.query<SellerResponse, string>({
      query: (sellerId) => ({
        url: `/api/seller/${sellerId}`,
        method: 'GET',
      }),
    }),
    

    addProduct: builder.mutation<AddProductResponse, FormDataType>({
      query: (formData) => ({
        url: '/api/seller/createproduct',
        method: 'POST',
        body: formData,
      }),
    }),
    fetchProducts: builder.query<ProductsResponse, string>({
      query: (sellerId) => ({
        url: `/api/seller/fetchProducts/${sellerId}`,
        method: 'GET',
      }),
    }),
    fetchAllProducts: builder.query<ProductsResponse, void>({
      query: () => ({
        url: '/api/seller/fetchAllProducts',
        method: 'GET',
      }),
    }),
    getProduct: builder.query<any, string>({
      query: (productId) => ({
        url: `/api/products/getProduct/${productId}`,
        method: 'GET',
      }),
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/api/seller/deleteProduct/${productId}`,
        method: 'DELETE',
      }),
    }),
    updateProduct: builder.mutation<AddProductResponse, { productId: string; formData: FormDataType }>({
      query: ({ productId, formData }) => ({
        url: `/api/seller/updateProduct/${productId}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    fetchOrders: builder.query<OrderResponse, string>({
      query: (sellerId) => ({
        url: `/api/seller/orders/${sellerId}`,
        method: 'GET',
      }),
    }),     
    updateOrderStatus: builder.mutation<void, { orderId: string; status: string }>({
      query: ({ orderId, status }) => ({
        url: `/api/seller/order/${orderId}`,
        method: 'PUT',
        body: { status },
      }),
    }),
    fetchAllSeller: builder.query<any, void>({
      query: () => ({
        url: '/api/seller/get-seller',
        method: 'GET',
      }),
    }),
  }),

});

export const {
  useFetchSellerByIdQuery,
  useCreateSellerMutation,
  useUpdateSellerProfileMutation,
  useAddProductMutation,
  useFetchProductsQuery,
  useFetchAllProductsQuery,
  useGetProductQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useFetchOrdersQuery,
  useUpdateOrderStatusMutation,
  useFetchAllSellerQuery
} = sellerApi;
