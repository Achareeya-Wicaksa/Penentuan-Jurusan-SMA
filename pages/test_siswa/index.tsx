import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import loginRegisterImage from "@/assets/login-register.webp";
import Link from "next/link";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { hasCookie, setCookie } from 'cookies-next';
import { clientSideAESEncrypt } from "@/utils/cryptoAES";
import { useEffect, useState } from "react";
import { getServerSidePropsType } from "@/types";

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
  const hasLoggedIn = hasCookie("user", { req, res });

  if (hasLoggedIn) {
    return {
      redirect: {
        destination: '/consult',
        permanent: true,
      }
    }
  }

  return {
    props: {
      AES_KEY: process.env.AES_KEY
    }
  }
}

interface LoginProps {
  AES_KEY: string;
}

export default function Login({ AES_KEY }: LoginProps) {
  const [fetchIsLoading, setFetchIsLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { username, password } = Object.fromEntries(formData.entries());

    (async () => {
      const payload = JSON.stringify({
        username,
        password,
      })

      try {
        setFetchIsLoading(true);
        const loginFetcher = await fetch('/api/loginsiswa', {
          method: 'POST',
          body: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const response = await loginFetcher.json();

        if (response.code === 200) {
          setCookie('user', JSON.stringify(response.data), {
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          });

          toast.success(response.message, {
            duration: 5000,
            icon: '👋',
          })

          if (response.data.role === "admin") {
            router.push('/admin');
          } else {
            router.push('/consult');
          }
        }

        if (response.code === 400) {
          toast.error(response.message, {
            duration: 5000,
          })
        }

        if (response.code === 500) {
          toast.error(response.message, {
            duration: 5000,
          })
        }
        setFetchIsLoading(false);
      } catch (error: any) {
        if (error.code === 400) {
          toast.error(error.message, {
            duration: 5000,
          })
        }
        setFetchIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    if (router.query.code === "403") {
      toast.error("Anda tidak memiliki akses ke halaman tersebut", {
        duration: 5000,
      })

      const timeout = setTimeout(() => {
        router.replace(router.pathname, undefined, { shallow: false });
      }, 100);

      return () => clearTimeout(timeout);
    }

  }, [router])

  return (
    <>
      <Head>
        <title>Masuk </title>
        <meta name="description" content="." />
      </Head>
      <Navbar />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        <div className="md:grid grid-flow-row grid-cols-1 items-center">
          {/* image */}
          
          {/* form */}
          <div className="mx-auto mt-10 mb-10">
            <h2 className="text-[30px] md:text-[40px] font-bold leading-[38px] md:leading-[48px] mb-2 md:mb-4">
              Kerjakan Test Minat & Bakat
            </h2>
            <p className="max-w-xl mb-4 text-base font-normal">
              Masuk untuk mulai mengerjakan test Minat serta bakat, Berguna untuk menentukan
              penjurusan yang lebih tepat sasaran pada SMA 1 Kedungwaru Tulungagung. Gunakan Username serta Password yang 
              telah dibagikan oleh pihak Sekolah, apabila terjadi kendala harap hubungi guru pendamping.
            </p>
            <form onSubmit={handleFormSubmit}>
              {/* email */}
              <div className="w-full max-w-xl form-control">
                <label className="label" htmlFor="username">
                  <span className="text-base label-text">Username</span>
                </label>
                <input
                  type="username"
                  className="w-full input input-bordered"
                  name="username"
                  id="username"
                  placeholder=""
                  disabled={fetchIsLoading}
                />
                {/* email error */}
              </div>
              {/* password */}
              <div className="w-full max-w-xl form-control mb-4">
                <label className="label" htmlFor="password">
                  <span className="text-base label-text">Kata sandi</span>
                </label>
                <input
                  type="te"
                  className="w-full input input-bordered"
                  name="password"
                  id="password"
                  placeholder=""
                  disabled={fetchIsLoading}
                />
                {/* password error */}
              </div>
              
              <button
                className={`w-full max-w-xl mt-4 btn btn-outline btn-ghost ${fetchIsLoading ? 'loading' : ''}`}
                type="submit"
                disabled={fetchIsLoading}
              >
                {fetchIsLoading ? "Memuat" : "Masuk"}
              </button>
            </form>
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
