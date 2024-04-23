import { loggedInUserDataType } from '@/types';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Head from "next/head";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

type getServerSidePropsType = {
    params: {
        code: string;
    };
    req: NextApiRequest;
    res: NextApiResponse;
}

export async function getServerSideProps({ params: { code }, req, res }: getServerSidePropsType) {
    const isCookieExist = hasCookie("user", { req, res });

    try {
        // @ts-ignore
        const userCookie = isCookieExist ? JSON.parse(getCookie("user", { req, res })) : null;

        if (userCookie && userCookie.role !== 'admin' || !userCookie) {
            return {
                redirect: {
                    destination: '/login',
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

        const jurusan = await prisma.ketentuan.findUnique({
            where: {
                code: parseInt(code),
            },
        })

        return {
            props: {
                user: userCookie,
                ketentuan: JSON.parse(JSON.stringify(jurusan)),
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
    ketentuan: {
        code: number;
        info: string;
        imageUrl: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

const AdminCreateSymptom = ({ user, ketentuan }: AdminCreateProps) => {
    const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<any>(ketentuan.imageUrl);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();

        // @ts-ignore
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        const fetchCreatePestOrDesease = (async () => {
            setFetchIsLoading(true);

            return await fetch('/api/admin/ketentuan', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptomCode: ketentuan.code,
                    info: data.info,
                    imageUrl: data.imageUrl,
                }),
            })
        })

        toast.promise(fetchCreatePestOrDesease()
            .then((res) => res.json())
            .then((res) => {
                router.push(`/admin/ketentuan`);
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
                <title>Ubah Data pertanyaan [{ketentuan.code}]: {ketentuan.info} Admin</title>
                <meta name="description" content="." />
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
                            <Link href="/admin/ketentuan">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Data pertanyaan
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Ubah Data pertanyaan [{ketentuan.code}]: {ketentuan.info}
                        </li>
                    </ul>
                </div>
                <h4 className="mt-1 mb-2 text-xl font-bold">
                    Ubah Data pertanyaan [{ketentuan.code}]: {ketentuan.info}
                </h4>
                <div className="mt-2">
                    <form onSubmit={onSubmitHandler} ref={formRef} encType='multipart/form-data'>
                        <div className='flex flex-col gap-4 lg:flex-row lg:gap-8 lg:justify-center lg:items-center'>
                            <div className='flex justify-center w-full lg:justify-start'>
                                <div className='rounded-md bg-primary'>
                                    <Image className='object-cover w-[480px] h-[432px] rounded-md' src={!selectedImageUrl ? " https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp" : selectedImageUrl} alt="Preview Gambar" loader={({ src }) => src} width={480} height={432} />
                                </div>
                            </div>
                            <div className='w-full'>
                                <div className="form-control">
                                    <label className="label" htmlFor='info'>
                                        <span className="label-text">Keterangan Ketentuan</span>
                                    </label>
                                    <label className="rounded-md input-group">
                                        <input type="text" name="info" placeholder="Ciri-Ciri Ketentuan" className="w-full input input-bordered" id='info' required disabled={fetchIsLoading} defaultValue={ketentuan.info} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label" htmlFor='imageUrl'>
                                        <span className="label-text">URL Gambar</span>
                                    </label>
                                    <label className="rounded-md input-group">
                                        <input
                                            type="text"
                                            name="imageUrl"
                                            placeholder="URL Gambar"
                                            className="w-full input input-bordered"
                                            id='imageUrl'
                                            disabled={fetchIsLoading}
                                            defaultValue={ketentuan.imageUrl}
                                            onChange={(e: any) => {
                                                setSelectedImageUrl(e.target.value);
                                            }}
                                        />
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