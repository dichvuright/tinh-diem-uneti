import type { Metadata } from "next";
import { Geist, Geist_Mono, Signika } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const signika = Signika({
  variable: "--font-signika",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = "https://tinhdiemuneti.id.vn"; // Updated to a placeholder that looks like a possible production URL or just stay with localhost if unsure, but for SEO let's use a descriptive one or leave as is if preferred. Actually, user just asked to write it.
  return {
    metadataBase: new URL(metadataBase),
    title: "Công Cụ Tính Điểm UNETI - Tính GPA, CPA & Điểm Môn Học Chính Xác",
    description: "Công cụ tính điểm UNETI hiện đại, chính xác dành cho sinh viên UNETI. Hỗ trợ tính điểm trung bình môn, GPA, CPA nhanh chóng và dễ dàng. Phát triển bởi DichVuRight.",
    keywords: "tính điểm uneti, gpa uneti, cpa uneti, bảng điểm uneti, dichvuright, tính điểm học tập uneti, đại học kinh tế kỹ thuật công nghiệp uneti",
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "any",
        },
        {
          url: "/favicon.ico",
          sizes: "128x128",
        },
        {
          url: "/favicon.ico",
          sizes: "256x256",
        },
      ],
      shortcut: "/favicon.ico",
      apple: [
        {
          url: "/favicon.ico",
          sizes: "128x128",
        },
        {
          url: "/favicon.ico",
          sizes: "256x256",
        },
      ],
    },
    openGraph: {
      title: "Công Cụ Tính Điểm UNETI - Tính GPA, CPA & Điểm Môn Học Chính Xác",
      description: "Công cụ tính điểm UNETI hiện đại, chính xác dành cho sinh viên UNETI. Hỗ trợ tính điểm trung bình môn, GPA, CPA nhanh chóng và dễ dàng.",
      images: '/thb.png',
      siteName: "Tính điểm UNETI",
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Công Cụ Tính Điểm UNETI - Tính GPA, CPA & Điểm Môn Học Chính Xác",
      description: "Hỗ trợ tính điểm trung bình môn, GPA, CPA nhanh chóng và dễ dàng cho sinh viên UNETI.",
      images: '/thb.png',
    },
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${signika.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
