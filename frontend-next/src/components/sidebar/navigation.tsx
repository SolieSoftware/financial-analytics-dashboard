"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { setNavigationState } from "../redux/slices/navigationSlice";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const navigationItems = useAppSelector(
    (state) => state.navigation.navigation
  );
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    const selectedItem = navigationItems.find((item) => item.href === pathname);
    if (selectedItem) {
      handleItemClick(selectedItem);
    }
  }, [pathname]);

  const handleItemClick = (selectedItem: any) => {
    const updatedItems = navigationItems.map((item) => ({
      ...item,
      active: item.href === selectedItem.href,
    }));
    dispatch(setNavigationState(updatedItems));
  };

  return (
    <div>
      {/* Navigation Header */}
      <div className="mb-4">
        <h2 className="nav-header">Navigation</h2>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-1">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              href={item.href}
              key={item.label}
              onClick={() => {
                handleItemClick(item);
              }}
              className="block"
            >
              <div
                className={`nav-item ${
                  item.active ? "nav-item-active" : "nav-item-inactive"
                }`}
              >
                <IconComponent size={16} className="nav-icon" />
                <span
                  className={`nav-text ${item.active ? "nav-text-active" : ""}`}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <div
                    className={`nav-badge ${
                      item.badge === "New"
                        ? "nav-badge-new"
                        : "nav-badge-default"
                    }`}
                  >
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className="nav-divider" />
    </div>
  );
};
