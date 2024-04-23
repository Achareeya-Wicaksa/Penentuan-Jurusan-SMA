import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import sma1 from "@/assets/sma1.jpg";
import foto1 from "@/assets/IMG_4277.jpg";
import foto2 from "@/assets/IMG_4271.jpg";
import foto3 from "@/assets/IMG_4288.jpg";
import foto4 from "@/assets/IMG_4302.jpg";
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

const gambar =[
    {url:sma1,
    info :"Tampak Depan SMA 1 Kedungwaru"},
    {url:foto1,
    info :"Saat tiba di kelas MIPA 2"},
    {url:foto2,
    info :"Saat Bertemu dengan Bu .. selaku Guru BK"},
    {url:foto3,
    info :"Saat Bertemu dengan Pak Agung selaku Wakil Kepala Sekolah"},
    {url:foto4,
    info :"Saat Melakukan Uji Coba sistem pada Mipa 4"},
]

interface AboutProps {
  user: loggedInUserDataType | null;
}
console.log(gambar)
export default function About({ user }: AboutProps) {
  return (
    <>
      <Head>
        <title>Tentang </title>
        <meta name="description" content="." />
      </Head>
      <Navbar userFullname={user?.fullname} role={user?.role} />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        {/* about the app */}
        <div className="h-full md:h-[100px] bg-primary rounded-2xl flex flex-col justify-center items-center p-8 md:p-6 mb-[60px]">
          <h2 className="text-center leading-[38px] md:leading-[48px] text-[30px] md:text-[40px] font-bold mb-2">
            Dokumentasi Kegiatan 
          </h2>
        </div>
        <div className="flex flex-wrap justify-around mb-[60px]">
      {gambar.map((item, index) => (
        <div key={index} className="card w-96 bg-base-100 shadow-xl mb-[20px]">
          <div className="card-body">
            <p>{item.info}</p>
          </div>
          <figure>
            {/* Menggunakan nilai dari objek gambar sesuai dengan kunci (key) */}
            <Image src={item.url} alt="Shoes" width={500} height={500} />
          </figure>
        </div>
      ))}
      </div>
      </main>
      <Footer />
    </>
  );
}
