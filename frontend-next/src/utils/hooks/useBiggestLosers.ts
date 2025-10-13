"use client";

import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";

interface biggestLoserData {
    symbol: string;
    price: number;
    name: string;
    change: number;
    changesPercentage: number;
    exchange: string;
}

interface biggestLosersResponse {
    biggest_losers: biggestLoserData[];
}

export const useBiggestLosers = () => {
    const url = `${endpoints.getBiggestLosers}`;
    const { data, error, isLoading } = useSWR<biggestLosersResponse>(url, fetcher);

    return {
        data,
        error,
        isLoading,
    };
}