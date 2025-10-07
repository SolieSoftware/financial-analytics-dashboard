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
      >
        {isOpen ? (
          <X className="sidebar-icon" />
        ) : (
          <Menu className="sidebar-icon" />
        )}
      </button>

      {/* Drawer/Sidebar */}
      <div className={`sidebar-container ${isOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <div className="sidebar-content">
          {/* Header */}
          <div className="sidebar-header">
            <div className="sidebar-header-content">
              <div className="sidebar-logo">
                <Gauge className="sidebar-logo-icon" />
              </div>
              <div>
                <h1 className="sidebar-title">Financial Analytics</h1>
                <p className="sidebar-subtitle">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="sidebar-divider" />

          {/* Navigation */}
          <div className="sidebar-section">
            <Navigation />
          </div>

          {/* Quick Stats */}
          <div className="sidebar-section">
            <QuickStats />
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="sidebar-divider sidebar-divider-footer" />
            <div className="sidebar-footer-content">
              <p className="sidebar-footer-text">© 2024 Analytics</p>
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1199]"
          onClick={toggleDrawer}
        />
      )}
    </>
  );
}

export default SideBar;
