"use client";

import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";

interface biggestGainerData {
    symbol: string;
    price: number;
    name: string;
    change: number;
    changesPercentage: number;
    exchange: string;
}

interface biggestGainersResponse {
    biggest_gainers: biggestGainerData[];
}

export const useBiggestGainers = () => {
    const url = `${endpoints.getBiggestGainers}`;
    const { data, error, isLoading } = useSWR<biggestGainersResponse>(url, fetcher);

    return {
        data,
        error,
        isLoading,
    };
}