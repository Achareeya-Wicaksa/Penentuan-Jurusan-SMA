import { getServerSidePropsType, loggedInUserDataType } from '@/types';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Head from "next/head";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import prisma from '@/prisma';

const dayTimeText = () => {
    const newDate = new Date();
    const time = newDate.getHours();
    if (time >= 0 && time < 12) {
        return "Pagi";
    }
    if (time >= 12 && time < 15) {
        return "Siang";
    }
    if (time >= 15 && time < 18) {
        return "Sore";
    }
    if (time >= 18 && time < 24) {
        return "Malam";
    }
}

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
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

        const pestsAndDeseasesCount = await prisma.jurusan.count()
        const symptomsCount = await prisma.ketentuan.count()
        const usersCount = await prisma.user.count()
        const siswaCount = await prisma.daftarSiswa.count()
        const usersDiagnosesHistoryCount = await prisma.usersDiagnoseHistory.count()

        return {
            props: {
                pestsAndDeseasesCount,
                symptomsCount,
                usersCount,
                usersDiagnosesHistoryCount,
                siswaCount,
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

type AdminProps = {
    user: loggedInUserDataType;
    pestsAndDeseasesCount: number;
    symptomsCount: number;
    usersCount: number;
    usersDiagnosesHistoryCount: number;
    siswaCount: number;
}

const Admin = ({ user, pestsAndDeseasesCount, symptomsCount, usersCount, usersDiagnosesHistoryCount, siswaCount }: AdminProps) => (
    <>
        <Head>
            <title>Dashboard </title>
            <meta name="description" content="." />
        </Head>
        <Navbar userFullname={user.fullname} role={user.role} />
        <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                        Dashboard Admin
                    </li>
                </ul>
            </div>
            <h4 className="py-2 mb-2 text-xl font-bold">
                Selamat {dayTimeText()} 👋 {user.fullname || "Tanpa nama"}
            </h4>
            <div className="grid w-full grid-flow-row gap-4 mt-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex justify-center shadow-xl card bg-base-100">
                    <div className="card-body">
                        <h2 className="card-title">
                            <span className="font-mono text-6xl font-bold countdown">
                                {/* @ts-ignore */}
                                <span style={{ "--value": pestsAndDeseasesCount }}></span>
                            </span>
                        </h2>
                        <p className='font-bold'>Manajemen Jurusan</p>
                        <div className="justify-end card-actions">
                            <Link href="/admin/jurusan" className="btn btn-primary">Lihat</Link>
                        </div>
                    </div>
                </div>
                <div className="shadow-xl card bg-base-100">
                    <div className="card-body">
                        <h2 className="card-title">
                            <span className="font-mono text-6xl font-bold countdown">
                                {/* @ts-ignore */}
                                <span style={{ "--value": symptomsCount }}></span>
                            </span>
                        </h2>
                        <p className='font-bold'>Manajemen Pertanyaan dan perpoinan Test Minat</p>
                        <div className="justify-end card-actions">
                            <Link href="/admin/ketentuan" className="btn btn-primary">Lihat</Link>
                        </div>
                    </div>
                </div>
                
                <div className="shadow-xl card bg-base-100">
                    <div className="card-body">
                        <h2 className="card-title">
                            <span className="font-mono text-6xl font-bold countdown">
                                {/* @ts-ignore */}
                                <span style={{ "--value": siswaCount }}></span>
                            </span>
                        </h2>
                        <p className='font-bold'>Manajemen akun Siswa</p>
                        <div className="justify-end card-actions">
                            <Link href="/nilaisiswa" className="btn btn-primary">Lihat</Link>
                        </div>
                    </div>
                </div>
                
                <div className="shadow-xl card bg-base-100">
                    <div className="card-body">
                        <h2 className="card-title">
                            <span className="font-mono text-6xl font-bold countdown">
                                {/* @ts-ignore */}
                                <span style={{ "--value": usersDiagnosesHistoryCount }}></span>
                            </span>
                        </h2>
                        <p className='font-bold'>Hasil Siswa yang telah mengerjakan</p>
                        <div className="justify-end card-actions">
                            <Link href="/hasiltest" className="btn btn-primary">Lihat</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
)

export default Admin;