import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import expertImg from "@/assets/expert.webp";
import developerImg from "@/assets/developer.webp";
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

interface AboutProps {
  user: loggedInUserDataType | null;
}

export default function About({ user }: AboutProps) {
  return (
    <>
      <Head>
        <title>Tentang </title>
        <meta name="description" content="Sistem Pakar berbasis web ini dapat membantu anda dalam mendiagnosis hama dan penyakit pada tanaman jambu kristal anda, serta dapat memberikan solusi atas masalah yang dialami oleh tanaman jambu kristal anda secara gratis." />
      </Head>
      <Navbar userFullname={user?.fullname} role={user?.role} />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        {/* about the app */}
        <div className="h-full md:h-[482px] bg-primary rounded-2xl flex flex-col justify-center items-center p-8 md:p-6 mb-[112px] lg:mb-[172px]">
          <h2 className="text-center leading-[38px] md:leading-[48px] text-[30px] md:text-[40px] font-bold mb-4">
            Tentang SMA 1 Kedungwaru 
          </h2>
          <p className="text-center text-base leading-[24px] max-w-[660px]">
          Website SMA 1 Kedungwaru dirancang dengan tujuan utama untuk menyediakan 
          berbagai informasi penting kepada siswa, orang tua, dan masyarakat umum. 
          Melalui platform ini, pengguna dapat mengakses berita terkini seputar kegiatan
           sekolah, prestasi siswa, dan berbagai peristiwa penting lainnya. Selain itu, 
           website ini juga menjadi sarana yang efektif untuk memberikan informasi mengenai 
           proses penjurusan sesuai dengan peraturan sekolah. Dengan demikian, siswa dapat 
           memperoleh pemahaman yang jelas mengenai langkah-langkah dan persyaratan yang harus 
           dipenuhi dalam memilih jurusan. Keseluruhan, website SMA 1 Kedungwaru bertindak sebagai 
           wadah komunikasi yang transparan antara sekolah, siswa, dan orang tua guna meningkatkan
            pemahaman dan partisipasi dalam kehidupan pendidikan di sekolah tersebut.

          </p>
        </div>

        {/* expert info */}
        <div className="grid grid-flow-row grid-cols-2 items-center gap-[40px] md:gap-[80px] lg:gap-[50px] mb-[112px] lg:mb-[172px]">
          {/* image */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src={''}
              className="object-cover md:h-[332px] md:w-[380px] lg:h-auto lg:w-[480px] bg-primary rounded-2xl"
              alt=""
            />
          </div>
          {/* expert info */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-base lg:text-xl">
              <h3 className="font-bold text-2xl md:text-3xl leading-[37px] md:leading-[48px] mb-4">
                Kepala Sekolah
              </h3>
              <table className="mb-4 text-left">
                <tbody>
                  <tr className="align-text-top">
                    <th>Nama</th>
                    <td className="px-2">:</td>
                    <td>xx</td>
                  </tr>
                  
                  <tr className="align-text-top">
                    <th>Biodata singkat</th>
                    <td className="px-2">:</td>
                  </tr>
                </tbody>
              </table>
              <p>
                xxx
              </p>
            </div>
          </div>
        </div>

        {/* developer info */}
        <div className="grid grid-flow-row grid-cols-2 items-center gap-[40px] md:gap-[80px] lg:gap-[50px]">
          {/* image */}
          <div className="flex justify-start col-span-2 md:col-span-1 md:order-last md:justify-end">
            <Image
              src={''}
              className="lg:max-h-[432px] object-cover md:h-[332px] md:w-[380px] lg:h-auto lg:w-[480px] bg-primary rounded-2xl"
              alt=""
            />
          </div>
          {/* info */}
          <div className="col-span-2 md:col-span-1">
            <div className="text-base lg:text-xl">
              <h3 className="font-bold text-2xl md:text-3xl leading-[37px] md:leading-[48px] mb-4">
                Tentang Pengembang
              </h3>
              <table className="mb-4 text-left">
                <tbody>
                  <tr className="align-text-top">
                    <th>Nama</th>
                    <td className="px-2">:</td>
                    <td>Achareeya Wicaksa PP</td>
                  </tr>
                  <tr className="align-text-top">
                    <th>Pekerjaan</th>
                    <td className="px-2">:</td>
                    <td>Mahasiswa</td>
                  </tr>
                  <tr className="align-text-top">
                    <th>Biodata Singkat</th>
                    <td className="px-2">:</td>
                  </tr>
                </tbody>
              </table>
              <p>
                Sebagai pengembang aplikasi dan juga seorang knowledge engineer
                dari aplikasi .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
