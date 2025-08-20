"use client";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Finance from "./(finance)/page";
import Layout from "./layout";

export default function Home() {
  return (
    <Layout>
      <Finance />
    </Layout>
  );
}
