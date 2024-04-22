import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import loginRegisterImage from "@/assets/login-register.webp";
import Link from "next/link";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";
import { clientSideAESEncrypt } from "@/utils/cryptoAES";
import { hasCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

type getServerSidePropsType = {
  req: NextApiRequest;
  res: NextApiResponse;
}

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
  const hasLoggedIn = hasCookie("user", { req, res });

  if (hasLoggedIn) {
    return {
      redirect: {
        destination: '/login',
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

type RegisterPropsType = {
  AES_KEY: string;
}

export default function Register({ AES_KEY }: RegisterPropsType) {
  const [fetchIsLoading, setFetchIsLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { fullname, email, password } = Object.fromEntries(formData.entries());

    (async () => {
      const payload = JSON.stringify({
        fullname,
        email,
        password: clientSideAESEncrypt(password.toString() || '', AES_KEY),
      })

      try {
        setFetchIsLoading(true);
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          body: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.code === 201) {
          toast.success(result.message, {
            duration: 10000,
          })
          router.push('/login');
        }

        if (result.code === 400) {
          toast.error(result.message, {
            duration: 5000,
          })
        }

        if (result.code === 500) {
          toast.error(result.message, {
            duration: 5000,
          })
        }
        setFetchIsLoading(false);
      } catch (error: any) {
        setFetchIsLoading(false);
        if (error.code === 400) {
          toast.error(error.message, {
            duration: 5000,
          })
        }
      }
    })();
  }

  return (
    <>
      <Head>
        <title>Daftar </title>
        <meta name="description" content="." />
      </Head>
      <Navbar />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        <div className="md:grid grid-flow-row grid-cols-2 gap-[32px] items-start">
          {/* image */}
          <div className="hidden lg:block">
            <Image
              className="object-cover bg-primary"
              src={loginRegisterImage}
              alt=""
              priority
            />
          </div>
          {/* form */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-[30px] md:text-[40px] font-bold leading-[38px] md:leading-[48px] mb-2 md:mb-4">
              Daftar
            </h2>
            <p className="max-w-xl mb-4 text-base font-normal">
              Dengan mendaftar, anda dapat masuk serta melihat riwayat
              konsultasi sebelumnya dan menyimpan riwayat konsultasi
              selanjutnya.
            </p>
            <form onSubmit={handleFormSubmit}>
              {/* name */}
              <div className="w-full max-w-xl form-control">
                <label className="label" htmlFor="fullname">
                  <span className="text-base label-text">Nama Lengkap</span>
                </label>
                <input
                  type="fullname"
                  className="w-full input input-bordered"
                  name="fullname"
                  id="fullname"
                  placeholder=""
                />
              </div>
              {/* email */}
              <div className="w-full max-w-xl form-control">
                <label className="label" htmlFor="email">
                  <span className="text-base label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="w-full input input-bordered"
                  name="email"
                  id="email"
                  placeholder=""
                />
              </div>
              {/* password */}
              <div className="w-full max-w-xl form-control">
                <label className="label" htmlFor="password">
                  <span className="text-base label-text">Kata sandi</span>
                </label>
                <input
                  type="password"
                  className="w-full input input-bordered"
                  name="password"
                  id="password"
                  placeholder=""
                />
              </div>
              <p className="mt-4">
                Tidak menerima email verifikasi?{" "}
                <Link className="text-blue-400" href="/register/resend-email-verification">
                  Kirim ulang
                </Link>
              </p>
              <button
                className={`w-full max-w-xl mt-4 btn btn-outline btn-ghost ${fetchIsLoading ? 'loading' : ''}`}
                type="submit"
                disabled={fetchIsLoading}
              >
                {fetchIsLoading ? "Memuat" : "Daftar"}
              </button>
            </form>
            <p className="mt-4">
              Sudah Punya Akun?{" "}
              <Link className="text-blue-400" href="/login">
                Masuk disini
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
