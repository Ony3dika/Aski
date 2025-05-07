import { Raleway, Jost } from "next/font/google";
import "./globals.css";

const defaultFont = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-raleway",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-jost",
});

export const metadata = {
  title: "Aski",
  description: "Just Aski — we've got the answers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${defaultFont.className} ${jost.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
