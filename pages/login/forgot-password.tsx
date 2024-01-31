import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import forgotPasswordImage from "@/assets/forgot-password.webp";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clientSideAESEncrypt } from "@/utils/cryptoAES";
import { hasCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";

type getServerSidePropsType = {
  query: {
    token: string | null;
  };
  req: NextApiRequest;
  res: NextApiResponse;
}

export async function getServerSideProps({ query, req, res }: getServerSidePropsType) {
  const hasLoggedIn = hasCookie("user", { req, res });

  if (hasLoggedIn) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: true,
      }
    }
  }

  const { token = null } = query;

  try {
    if (!token) {
      return {
        props: {
          AES_KEY: process.env.AES_KEY,
          _nextStep: false,
          _token: null,
        },
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        // @ts-ignore
        passwordResetToken: token,
      },
    });

    await prisma.$disconnect();

    if (!user) {
      return {
        props: {
          AES_KEY: process.env.AES_KEY,
          _nextStep: false,
          _token: 'invalid',
        },
      };
    }

    return {
      props: {
        AES_KEY: process.env.AES_KEY,
        _nextStep: true,
        _token: token,
      },
    };
  } catch (error) {
    console.error(error)
    return {
      props: {
        AES_KEY: process.env.AES_KEY,
        _nextStep: false,
        _token: null,
      },
    };
  }
}

interface ForgotPasswordProps {
  AES_KEY: string;
  _nextStep: boolean;
  _token: string | null;
}

export default function ForgotPassword({
  AES_KEY,
  _nextStep,
  _token,
}: ForgotPasswordProps) {
  const [nextStep, setNextStep] = useState(() => _nextStep);
  const [fetchIsLoading, setFetchIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (_token && !_nextStep) {
      toast.error("Link rusak atau token sudah kadaluarsa", {
        duration: 5000,
      });
    }
  }, [_token, _nextStep])

  const handleFormFirstStep = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email } = Object.fromEntries(formData.entries());

    (async () => {
      const payload = JSON.stringify({
        email,
      });

      try {
        setFetchIsLoading(true);
        const forgotPasswordFetcher = await fetch("/api/auth/login/forgot-password", {
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await forgotPasswordFetcher.json();

        if (result.code === 200) {
          toast.success(result.message, {
            duration: 6000,
          });

          const timeout = setTimeout(() => {
            toast.success("Silakan periksa kotak masuk dan folder spam email Anda.", {
              duration: 7500,
              icon: "📧",
            });
            clearTimeout(timeout);
          }, 2000);
        } else {
          toast.error(result.message, {
            duration: 5000,
          });
        }

        e.target.email.value = "";
        setFetchIsLoading(false);
      } catch (error) {
        toast.error("Terjadi kesalahan, silahkan coba lagi.", {
          duration: 5000,
        });
        setFetchIsLoading(false);
      }
    })();
  };

  const handleFormNextStep = (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { password, passwordConfirm } = Object.fromEntries(
      formData.entries()
    );

    (async () => {
      const payload = JSON.stringify({
        token: _token,
        password: clientSideAESEncrypt(password.toString() || '', AES_KEY),
        passwordConfirm: clientSideAESEncrypt(passwordConfirm.toString() || '', AES_KEY)
      });

      try {
        setFetchIsLoading(true);
        const forgotPasswordNextStepFetcher = await fetch(
          "/api/auth/login/forgot-password/next-step",
          {
            method: "POST",
            body: payload,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await forgotPasswordNextStepFetcher.json();

        if (result.code === 200) {
          toast.success(result.message, {
            duration: 5000,
          });
          router.push("/login");
        } else {
          toast.error(result.message, {
            duration: 5000,
          });
        }
        setFetchIsLoading(false);
      } catch (error) {
        toast.error("Terjadi kesalahan, silahkan coba lagi.", {
          duration: 5000,
        });
        setFetchIsLoading(false);
      }

    })();
  };

  return (
    <>
      <Head>
        <title>{`${nextStep ? 'Ubah Kata Sandi' : 'Lupa Kata Sandi'} `}</title>
        <meta
          name="description"
          content="Sistem Pakar berbasis web ini dapat membantu anda dalam mendiagnosis hama dan penyakit pada tanaman jambu kristal anda, serta dapat memberikan solusi atas masalah yang dialami oleh tanaman jambu kristal anda secara gratis."
        />
      </Head>
      <Navbar />
      <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
        <div className="md:grid grid-flow-row grid-cols-2 gap-[32px] items-center">
          {/* image */}
          <div className="hidden lg:block">
            <Image
              className="object-cover bg-primary"
              src={forgotPasswordImage}
              alt=""
              priority
            />
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-[30px] md:text-[40px] font-bold leading-[38px] md:leading-[48px] mb-2 md:mb-4">
              {nextStep ? "Ubah Kata Sandi" : "Lupa Kata Sandi"}
            </h2>
            <p className="max-w-xl mb-4 text-base font-normal">
              {nextStep
                ? "Saat ini, Anda memiliki kesempatan untuk mengganti kata sandi Anda."
                : "Dengan memasukan Email dan klik tombol Kirimi Saya Email, kami akan mengirimkan email berisi link untuk mereset kata sandi anda."}
            </p>

            {/* form */}
            {nextStep ? (
              <form onSubmit={handleFormNextStep}>
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
                    disabled={fetchIsLoading}
                  />
                </div>

                <div className="w-full max-w-xl form-control">
                  <label className="label" htmlFor="confirm-password">
                    <span className="text-base label-text">
                      Konfirmasi Kata sandi
                    </span>
                  </label>
                  <input
                    type="password"
                    className="w-full input input-bordered"
                    name="passwordConfirm"
                    id="confirm-password"
                    placeholder=""
                    disabled={fetchIsLoading}
                  />
                </div>

                <button className="mt-4 text-blue-400" onClick={() => setNextStep(false)} type="button">
                  Kirimi saya email lagi
                </button>

                <button
                  className={`w-full max-w-xl mt-4 btn btn-outline btn-ghost ${fetchIsLoading ? 'loading' : ''}`}
                  type="submit"
                  disabled={fetchIsLoading}
                >
                  {fetchIsLoading ? "Memuat" : `Ubah Kata Sandi`}
                </button>
              </form>
            ) : (
              <form onSubmit={handleFormFirstStep}>
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
                    disabled={fetchIsLoading}
                  />
                </div>

                <button
                  className={`w-full max-w-xl mt-4 btn btn-outline btn-ghost ${fetchIsLoading ? 'loading' : ''}`}
                  type="submit"
                  disabled={fetchIsLoading}
                >
                  {fetchIsLoading ? "Memuat" : `Kirimi Saya Email`}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
