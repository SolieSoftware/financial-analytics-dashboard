import { ReduxProvider } from "./providers/ReduxProvider";
import { SWRConfig } from "swr";
import "./global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
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
