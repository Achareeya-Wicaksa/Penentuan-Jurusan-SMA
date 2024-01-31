import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import forgotPasswordImage from "@/assets/forgot-password.webp";
import Head from "next/head";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { hasCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

type getServerSidePropsType = {
    query: {
        token: string | null;
    };
    req: NextApiRequest;
    res: NextApiResponse;
}

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
    const hasLoggedIn = hasCookie("user", { req, res });

    if (hasLoggedIn) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: true,
            }
        }
    }

    return {
        props: {
            AES_KEY: process.env.AES_KEY,
        },
    };
}

export default function ForgotPassword() {
    const [fetchIsLoading, setFetchIsLoading] = useState(false);

    const handleFormResendVerificationEmail = (e: any) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const { email } = Object.fromEntries(formData.entries());

        (async () => {
            const payload = JSON.stringify({
                email,
            });

            try {
                setFetchIsLoading(true);
                const forgotPasswordFetcher = await fetch("/api/auth/register/resend-email-verification", {
                    method: "PUT",
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

    return (
        <>
            <Head>
                <title>Kirim Ulang Email Verifikasi </title>
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
                            Kirim Ulang Email Verifikasi
                        </h2>
                        <p className="max-w-xl mb-4 text-base font-normal">
                            Masukkan email anda untuk mengirim ulang email verifikasi.
                        </p>

                        {/* form */}
                        <form onSubmit={handleFormResendVerificationEmail}>
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
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
