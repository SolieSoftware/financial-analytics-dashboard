import { Providers } from "./providers/providers";
import { SWRConfig } from "swr";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            keepPreviousData: true,
          }}
          >
          <Providers>
            {children}
          </Providers>
        </SWRConfig>
      </body>
    </html>
  );
}
