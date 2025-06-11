// ✅ Google fonts "Geist" aur "Geist_Mono" import kiye gaye hain
import { Geist, Geist_Mono } from "next/font/google";

// ✅ Global CSS file import ki gayi hai
import "./globals.css";

// ✅ StateContext import kiya gaya jo cart/wishlist ke liye use hota hai
import { StateContext } from "@/context/StateContext"; 

// ✅ UserContext import kiya gaya jo user authentication ke liye use hota hai
import { UserProvider } from "@/context/UserContext";   

// ✅ Common layout components
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// ✅ Notification toaster (success, error alerts) import kiya
import { Toaster } from "sonner";

// ✅ HTML <head> ke liye next/head import kiya
import Head from "next/head";

// ✅ Fonts ke liye variables define kiye ja rahe hain (custom CSS variable ban rahe)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Static metadata for SEO etc.
export const metadata = {
  title: "Book My Bus",
  description: "Book your bus tickets easily and quickly online",
};

// ✅ RootLayout component banaya gaya jo saari pages ko wrap karega
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* ✅ Body me font variables aur antialiasing ke saath class di gayi */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* ✅ Sabse outer wrapper me UserProvider use kiya (login/user info ke liye) */}
        <UserProvider>             

          {/* ✅ Uske andar cart/wishlist ke liye StateContext wrap kiya */}
          <StateContext>           

            {/* ✅ Layout container */}
            <div className="layout">

              {/* ✅ Page ke <head> element me title diya gaya */}
              <Head>
                <title>Dine Market</title>
              </Head>

              {/* ✅ Top navbar (header part) */}
              <header>
                <Navbar />
              </header>

              {/* ✅ Main dynamic content jaha children render hote hain */}
              <main className="main-container">{children}</main>

              {/* ✅ Page footer */}
              <footer>
                <Footer />
              </footer>

              {/* ✅ Notification ke liye toaster add kiya (center position me) */}
              <Toaster richColors position="top-center" />

            </div>
          </StateContext>
        </UserProvider>
      </body>
    </html>
  );
}