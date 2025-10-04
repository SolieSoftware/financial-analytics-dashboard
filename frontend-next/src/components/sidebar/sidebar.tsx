"use client";

import React from "react";
import { Menu, X, Gauge, Settings } from "lucide-react";
import { Navigation } from "./navigation";
import { QuickStats } from "./QuickStats";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSidebarOpen } from "../redux/slices/sidebarSlice";

function SideBar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  const toggleDrawer = () => {
    dispatch(setSidebarOpen(!isOpen));
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        aria-label="Toggle Sidebar"
        onClick={toggleDrawer}
        className="sidebar-toggle-btn"
        style={{
          left: isOpen ? 'calc(20vw + 10px)' : '22vw',
          top: "20px",
        }}
      >
        {isOpen ? (
          <X className="sidebar-icon" />
        ) : (
          <Menu className="sidebar-icon" />
        )}
      </button>

      {/* Drawer/Sidebar */}
      <div
        className={`sidebar-container ${  
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center mb-6 mt-4">
              <div className="sidebar-logo">
                <Gauge className="sidebar-logo-icon" />
              </div>
              <div>
                <h1 className="sidebar-title">
                  Financial Analytics
                </h1>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="sidebar-divider" />

          {/* Navigation */}
          <div className="p-6 pb-4">
            <Navigation />
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 mt-auto">
            <div className="sidebar-divider mb-4" />
            <div className="flex items-center justify-between">
              <p className="sidebar-footer-text">
                © 2024 Analytics Pro
              </p>
              <button
                className="sidebar-settings-btn"
                aria-label="Settings"
              >
                <Settings className="sidebar-settings-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1199]"
          onClick={toggleDrawer}
        />
      )}
    </>
  );
}

export default SideBar;
