"use client";

import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";

interface watchlistResponse {
    data: {
        id: string;
        user_id: string;
        symbol: string;
        added_at: string;
    }[];
}

export const useWatchlist = () => {
    const url = `${endpoints.getWatchlist}`;
    const { data, error, isLoading } = useSWR<watchlistResponse>(url, fetcher);

    return {
        data,
        error,
        isLoading,
    };
}