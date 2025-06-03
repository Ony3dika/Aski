import { Raleway, Jost, Mona_Sans } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-raleway",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-jost",
});

const mona = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-mona",
});

export const metadata = {
  title: "Aski",
  description: "Just Aski — we've got the answers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${raleway.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
