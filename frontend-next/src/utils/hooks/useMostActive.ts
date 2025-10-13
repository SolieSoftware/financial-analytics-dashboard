"use client";

import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";

interface mostActiveData {
    symbol: string;
    price: number;
    name: string;
    change: number;
    changesPercentage: number;
    exchange: string;
}   

interface mostActiveResponse {
    most_active: mostActiveData[];
}

export const useMostActive = () => {
    const url = `${endpoints.getMostActive}`;
    const { data, error, isLoading } = useSWR<mostActiveResponse>(url, fetcher);

    return {
        data,
        error,
        isLoading,
    };
}   