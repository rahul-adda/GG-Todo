import "../styles/globals.css";
import { ReactNode } from "react";
import Layout from "@/components/layout/Layout";
import Providers from "@/providers/Providers";

export const metadata = {
  title: "Todo App",
  description: "TODO Frontend App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "rgba(250,250,250,1)", padding: 0 }}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
