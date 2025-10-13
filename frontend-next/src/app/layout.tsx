import { ReduxProvider } from "./providers/ReduxProvider";
import { SWRConfig } from "swr";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.variable}>
      <body className={inter.className}>
        <ReduxProvider>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              revalidateOnReconnect: true,
              keepPreviousData: true,
            }}
          >
            {children}
          </SWRConfig>
        </ReduxProvider>
        </body>
      </html>
  );
}
