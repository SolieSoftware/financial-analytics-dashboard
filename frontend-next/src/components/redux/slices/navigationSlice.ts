import { createSlice } from "@reduxjs/toolkit";
import { BarChart, ShowChart, Business, AttachMoney, TrendingUp, Star, PieChart } from "@mui/icons-material";
import { PayloadAction } from "@reduxjs/toolkit";


interface NavigationItem {
    label: string;
    href: string;
    icon: any;
    active: boolean;
    badge: string | null;
}

interface NavigationState {
    navigation: NavigationItem[]
}

const initialState: NavigationState = {
    navigation: [
        {
          label: "Stock Profile",
          href: "/stock-profile",
          icon: BarChart,
          active: true,
          badge: null,
        },
        {
          label: "Market Overview",
          href: "/market-overview",
          icon: ShowChart,
          active: false,
          badge: null,  
        },
        {
          label: "Portfolio",
          href: "/portfolio",
          icon: Business,
          active: false,
          badge: "3",
        },
        {
          label: "Dividend Picks",
          href: "/dividend",
          icon: AttachMoney,
          active: false,
          badge: "New",
        },
        {
          label: "Market Analysis",
          href: "/analysis",
          icon: TrendingUp,
          active: false,
          badge: null,
        },
        {
          label: "Watchlist",
          href: "/watchlist",
          icon: Star,
          active: false,
          badge: "12",
        },
        {
          label: "Reports",
          href: "/reports",
          icon: PieChart,
          active: false,
          badge: null,
        },
      ]
}
;

const navigationSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        setNavigationState: (state, action: PayloadAction<any>) => {
            state.navigation = action.payload;
        }
    }
});

export const { setNavigationState } = navigationSlice.actions;
export default navigationSlice.reducer;