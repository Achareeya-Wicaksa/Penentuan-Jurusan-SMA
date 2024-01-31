import { getServerSidePropsType, loggedInUserDataType } from '@/types';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Head from "next/head";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import prisma from '@/prisma';

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
    const isCookieExist = hasCookie("user", { req, res });

    try {
        // @ts-ignore
        const userCookie = isCookieExist ? JSON.parse(getCookie("user", { req, res })) : null;

        if (userCookie && userCookie.role !== 'admin' || !userCookie) {
            return {
                redirect: {
                    destination: '/dashboard',
                    permanent: true,
                }
            }
        }

        const foundedUser = await prisma.user.findUnique({
            where: {
                authToken: userCookie.authToken,
            }
        });
        if (!foundedUser) {
            deleteCookie("user", { req, res });
            return {
                redirect: {
                    destination: '/login?code=403',
                    permanent: true,
                }
            }
        }

        return {
            props: {
                user: userCookie,
            }
        }
    } catch (error) {
        console.error(error)
        return {
            redirect: {
                destination: '/login?code=403',
                permanent: true,
            }
        };
    }
}

type AdminCreateProps = {
    user: loggedInUserDataType;
}

const AdminCreateSymptom = ({ user }: AdminCreateProps) => {
    const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<any>("");
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();

        // @ts-ignore
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        const fetchCreatePestOrDesease = (async () => {
            setFetchIsLoading(true);

            return await fetch('/api/nilaisiswa/tambahdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nim: data.nim,
                    fullname: data.fullname,
                    username: data.nim,
                    password: 'sma1kedungwaru',
                    nilaiipa: ~~Math.round(data.nilaiipa),
                    nilaiips: ~~Math.round(data.nilaiips),
                }),
            })
        })

        toast.promise(fetchCreatePestOrDesease()
            .then((res) => res.json())
            .then((res) => {
                router.push(`/nilaisiswa`);
            })
            .catch(() => {
                toast.error('Sistem gagal menyimpan data, ada kesalahan pada sistem', {
                    duration: 5000,
                });
                setFetchIsLoading(false);
            }), {
            loading: 'Sistem sedang menyimpan data...',
            success: 'Sistem berhasil menyimpan data',
            error: 'Sistem gagal menyimpan data',
        }, {
            duration: 5000,
        });
    }
    return (
        <>
            <Head>
                <title>Tambah Data Siswa</title>
                <meta name="description" content="Sistem Pakar berbasis web ini dapat membantu anda dalam mendiagnosis hama dan penyakit pada tanaman jambu kristal anda, serta dapat memberikan solusi atas masalah yang dialami oleh tanaman jambu kristal anda secara gratis." />
            </Head>
            <Navbar userFullname={user.fullname} role={user.role} />
            <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
                <div className="text-sm breadcrumbs">
                    <ul>
                        <li>
                            <Link href="/admin">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Dashboard Admin
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/symptoms">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Data Siswa
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Tambah Data Siswa
                        </li>
                    </ul>
                </div>
                <h4 className="mt-1 mb-2 text-xl font-bold">
                    Tambah Data Siswa
                </h4>
                <div className="mt-16">
                    <form onSubmit={onSubmitHandler} ref={formRef} encType='multipart/form-data'>
                        <div className='flex flex-col  lg:flex-row  lg:justify-center lg:items-center'>
                            
                            <div className='w-full'>
                                <div className="form-control">
                                    <label className="label" htmlFor='nim'>
                                        <span className="label-text">Nim</span>
                                    </label>
                                    <label className="rounded-md input-group">
                                        <input type="text" name="nim" placeholder="Nomor Nim Siswa" className="w-full input input-bordered" id='nim' required disabled={fetchIsLoading} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor='fullname'>
                                        <span className="label-text">Nama Lengkap </span>
                                    </label>
                                    <label className="rounded-md input-group">
                                        <input type="text" name="fullname" placeholder="Nama Lengkap Siswa" className="w-full input input-bordered" id='fullname' required disabled={fetchIsLoading} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor='nilaiipa'>
                                        <span className="label-text">Nilai IPA </span>
                                    </label>
                                    <label className="rounded-md input-group">
                                        <input type="text" name="nilaiipa" placeholder="Nilai IPA" className="w-full input input-bordered" id='nilaiipa' required disabled={fetchIsLoading} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor='nilaiips'>
                                        <span className="label-text">Nilai IPS </span>
                                    </label>
                                    <label className="rounded-md input-group">
                                        <input type="text" name="nilaiips" placeholder="Nilai IPS" className="w-full input input-bordered" id='nilaiips' required disabled={fetchIsLoading} />
                                    </label>
                                </div>
                                
                                
                                <button type="submit" className={`mt-4 btn btn-primary ${fetchIsLoading ? 'loading' : ''}`} disabled={fetchIsLoading}>Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default AdminCreateSymptom;