"use client";

import "./globals.css";
import StyledComponentsRegistry from "./registry";
import { theme } from "./styles/theme";
import { ThemeProvider } from "styled-components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {" "}
        <StyledComponentsRegistry>
          {" "}
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
