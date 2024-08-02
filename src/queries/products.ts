import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { AvailableProduct } from "~/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    "available-products",
    async () => {
      const res = await axios.get<AvailableProduct[]>(
        "https://nbe6zqyyod.execute-api.localhost.localstack.cloud:4566/prod/products"
      );
      return res.data;
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("available-products", { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `https://nbe6zqyyod.execute-api.localhost.localstack.cloud:4566/prod/products/${id}`
      );
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.put<AvailableProduct>(
      "https://nbe6zqyyod.execute-api.localhost.localstack.cloud:4566/prod/products",
      values,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    )
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(
      `https://nbe6zqyyod.execute-api.localhost.localstack.cloud:4566/prod/products/${id}`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    )
  );
}
