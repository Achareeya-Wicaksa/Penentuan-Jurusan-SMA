import Image from "next/image";
import Navbar from "@/components/Navbar";
import guavaImg from "@/assets/guava.webp";
import Link from "next/link";
import Footer from "@/components/Footer";
import Head from "next/head";
import { getCookie, hasCookie } from "cookies-next";
import { getServerSidePropsType, loggedInUserDataType } from "@/types";

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
  const isCookieExist = hasCookie("user", { req, res });
  try {
    // @ts-ignore
    const userCookie = isCookieExist ? JSON.parse(getCookie("user", { req, res })) : null;

    return {
      props: {
        user: userCookie,
      }
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        user: null,
      }
    };
  }
}

interface HomeProps {
  user: loggedInUserDataType | null;
}

export default function Home({ user }: HomeProps) {
  return (
    <>
      <Head>
        <title>Beranda - SIPBUK</title>
        <meta name="description" content="Sistem Pakar berbasis web ini dapat membantu anda dalam mendiagnosis hama dan penyakit pada tanaman jambu kristal anda, serta dapat memberikan solusi atas masalah yang dialami oleh tanaman jambu kristal anda secara gratis." />
      </Head>
      <Navbar userFullname={user?.fullname} role={user?.role} />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        <div className="md:grid grid-flow-row grid-cols-12 gap-[32px] items-center">
          {/* hero left */}
          <div className="col-span-12 lg:col-span-7 lg:max-w-[600px]">
            <h2 className="text-[30px] md:text-[40px] font-bold leading-[38px] md:leading-[48px] mb-2 md:mb-4">
              Diagnosis Hama dan Penyakit Pada Tanaman Jambu Kristal Anda
              Sekarang
            </h2>
            <p className="mb-3 text-base font-normal md:text-lg md:mb-7">
              Sistem berbasis web ini dapat membantu anda dalam mendiagnosis
              hama dan penyakit pada tanaman jambu kristal anda, serta dapat
              memberikan solusi atas masalah yang dialami oleh tanaman jambu
              kristal anda secara gratis.
            </p>

            <div className="flex flex-wrap flex-1 gap-4 mt-4 md:gap-4 md:mt-6">
              <Link
                className="text-sm capitalize btn btn-outline btn-info md:text-base"
                href="/consult"
              >
                Konsultasi Sekarang
              </Link>
              <Link
                className="text-sm capitalize btn btn-outline btn-success md:text-base"
                href="/about"
              >
                Tentang Aplikasi
              </Link>
            </div>
          </div>
          {/* hero right */}
          <div className="justify-end hidden lg:flex lg:col-span-5">
            <Image
              className="w-[481px] h-[410px] bg-primary rounded-2xl object-cover"
              src={guavaImg}
              alt=""
              priority
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
