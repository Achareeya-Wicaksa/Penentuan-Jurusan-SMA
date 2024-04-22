import Image from "next/image";
import Navbar from "@/components/Navbar";
import sma1 from "@/assets/sma1.jpg";
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
        <title>Beranda </title>
        <meta name="description" content="." />
      </Head>
      <Navbar  />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        <div className="md:grid grid-flow-row grid-cols-12 gap-[32px] items-center mb-40 mt-20">
          {/* hero left */}
          <div className="col-span-12 lg:col-span-7 lg:max-w-[600px]">
            <h2 className="text-[30px] md:text-[40px] font-bold leading-[38px] md:leading-[48px] mb-2 md:mb-4">
              SMA Negeri 1 Kedungwaru Tulungagung
            </h2>
            <p className="mb-3 text-base font-normal md:text-lg md:mb-7">
              Website ini bertujuan untuk mempermudah penyampaian informasi 
              serta proses akademik dapat berjalan secara lancar dan tersusun
            </p>

            <div className="flex flex-wrap flex-1 gap-4 mt-4 md:gap-4 md:mt-6">
              <Link
                className="text-sm capitalize btn btn-outline btn-info md:text-base"
                href="/consult"
              >
                Pelajari lebih lanjut
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
              className=" bg-primary rounded-2xl object-cover"
              src={sma1}
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
