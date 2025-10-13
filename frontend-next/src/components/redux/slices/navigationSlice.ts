import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface NavigationItem {
  label: string;
  href: string;
  iconName: string; // Store icon name instead of component
  active: boolean;
  badge: string | null;
}

interface NavigationState {
  navigation: NavigationItem[];
}

const initialState: NavigationState = {
  navigation: [
    {
      label: "Stock Profile",
      href: "/stock-profile",
      iconName: "BarChart",
      active: true,
      badge: null,
    },
    {
      label: "Market Overview",
      href: "/market-overview",
      iconName: "ShowChart",
      active: false,
      badge: null,
    },
    {
      label: "Live Trading View",
      href: "/trading-view",
      iconName: "ShowChart",
      active: false,
      badge: null,
    },
    {
      label: "Watchlist",
      href: "/watchlist",
      iconName: "Star",
      active: false,
      badge: "12",
    },
    {
      label: "Reports",
      href: "/reports",
      iconName: "PieChart",
      active: false,
      badge: null,
    },
  ],
};
const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigationState: (state, action: PayloadAction<any>) => {
      state.navigation = action.payload;
    },
  },
});

export const { setNavigationState } = navigationSlice.actions;
export default navigationSlice.reducer;
