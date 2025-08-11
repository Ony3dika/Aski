import { Raleway } from "next/font/google";
import "./styles/globals.css";
import { Toaster } from "sonner";
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-raleway",
});

export const metadata = {
  title: "Aski",
  description: "Just Aski — we've got the answers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${raleway.className} antialiased`}>
        <Toaster richColors theme='system' closeButton position='top-right' />
        {children}
      </body>
    </html>
  );
}
