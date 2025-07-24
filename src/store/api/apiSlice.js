import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllEtudiants: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/api/etudiants?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["etudiants"],
    }),
    addEtudiant: builder.mutation({
      query: (data) => ({
        url: "/api/etudiants",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["etudiants"],
    }),
    getEtudiant: builder.query({
      query: (id) => ({
        url: `/api/etudiants/${id}`,
        method: "GET",
      }),
      providesTags: ["etudiants"],
    }),
  }),
});

export const { useGetAllEtudiantsQuery, useAddEtudiantMutation, useGetEtudiantQuery } = apiSlice;