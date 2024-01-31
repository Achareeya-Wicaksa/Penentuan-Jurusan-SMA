import React, { useEffect, useState } from 'react';
import { hasCookie, getCookie, deleteCookie } from "cookies-next";
import Navbar from '@/components/Navbar';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { NextApiRequest, NextApiResponse } from 'next';
import { loggedInUserDataType } from '@/types';
import prisma from '@/prisma';

type getServerSidePropsType = {
    req: NextApiRequest;
    res: NextApiResponse;
};

export async function getServerSideProps({ req, res }: getServerSidePropsType) {
    const hasLoggedIn = hasCookie("user", { req, res });

    if (!hasLoggedIn) {
        return {
            redirect: {
                destination: '/login?code=403',
                permanent: true,
            }
        }
    }

    try {
        // @ts-ignore
        const userCookie = JSON.parse(getCookie("user", { req, res }));
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
        const _userDiagnosesHistory = await prisma.usersDiagnoseHistory.findMany({
            where: {
                userId: foundedUser?.id,
            },
            include: {
                pestsAndDeseases: true,
            }
        })

        await prisma.$disconnect();

        return {
            props: {
                user: userCookie,
                _userDiagnosesHistory: JSON.parse(JSON.stringify(_userDiagnosesHistory)),
            },
        }
    } catch (error) {
        console.error(error)
        deleteCookie("user", { req, res });
        return {
            redirect: {
                destination: '/login?code=403',
                permanent: true,
            }
        };
    }
}

interface DashboardProps {
    user: loggedInUserDataType;
    _userDiagnosesHistory: {
        id: string;
        userId: string;
        pestsAndDeseasesId: string;
        finalCF: number;
        userInputData: string; //json
        createdAt: Date;
        updatedAt: Date;
        pestsAndDeseases: {
            code: number;
            name: string;
            imageUrl: string;
            createdAt: Date;
            updatedAt: Date;
            solution: string;
        }
    }[];
}

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

export default function Dashboard({ user, _userDiagnosesHistory }: DashboardProps) {
    const [userDiagnosesHistory, setUserDiagnosesHistory] = useState(_userDiagnosesHistory);
    const [localStorageDiagnosesHistory, setLocalStorageDiagnosesHistory] = useState([]);
    const [selectedDiagnosesHistoryId, setSelectedDiagnosesHistoryId]: string[] | any = useState([]);
    const [onDeleteSelectedDiagnoseHistory, setOnDeleteSelectedDiagnoseHistory] = useState(false);
    const [isLoadingSaveDiagnoseHistory, setIsLoadingSaveDiagnoseHistory] = useState(false);
    const globalCheckboxRef = React.useRef<HTMLInputElement>(null);

    // setDataState setState function type
    const sortSaveByNewestDate = (data: any[], setState: any) => {
        const sorted = data.sort((a, b) => {
            const createdAtA: any = new Date(a.createdAt);
            const createdAtB: any = new Date(b.createdAt);
            return createdAtB - createdAtA;
        })

        setState(sorted);
    }

    const handleClickAcceptSaveDiagnoseHistory = async () => {
        const savedLocalStorageDiagnosesHistory = (async () => {
            setIsLoadingSaveDiagnoseHistory(true);
            return await fetch("/api/dashboard/diagnoses-history", {
                headers: {
                    "Content-Type": "application/json",
                    // bearer token using user.authToken
                    "Authorization": `Bearer ${user.authToken}`
                },
                method: "POST",
                body: JSON.stringify({
                    diagnosesId: localStorageDiagnosesHistory,
                    userId: user.id,
                }),
            })
        });

        toast.promise(savedLocalStorageDiagnosesHistory()
            .then((res) => res.json())
            .then((res) => {
                sortSaveByNewestDate([...userDiagnosesHistory, ...res.data], setUserDiagnosesHistory);

                if (typeof window !== "undefined") {
                    localStorage.removeItem("diagnosesHistoryId");
                }

                setLocalStorageDiagnosesHistory([]);
                setIsLoadingSaveDiagnoseHistory(false);
            })
            .catch(() => {
                toast.error("Riwayat diagnosis gagal disimpan", {
                    duration: 5000,
                });
            }), {
            loading: "Menyimpan riwayat diagnosis...",
            success: "Riwayat diagnosis berhasil disimpan",
            error: "Riwayat diagnosis gagal disimpan",
        }, {
            duration: 5000,
        });
    }

    const handleClickRefuseSaveDiagnoseHistory = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("diagnosesHistoryId");
            setLocalStorageDiagnosesHistory([]);
        }
        setLocalStorageDiagnosesHistory([]);
    }

    const handleClickDeleteSelectedDiagnoseHistory = async () => {
        const deletedDiagnosesHistory = (async () => {
            setOnDeleteSelectedDiagnoseHistory(true);

            return await fetch("/api/dashboard/diagnoses-history", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "DELETE",
                body: JSON.stringify({
                    diagnosesId: selectedDiagnosesHistoryId,
                    userId: user.id,
                }),
            })
        });

        toast.promise(deletedDiagnosesHistory()
            .then((res) => {
                setOnDeleteSelectedDiagnoseHistory(false);
                return res.json()
            })
            .then((res) => {
                setUserDiagnosesHistory(userDiagnosesHistory.filter((diagnosesHistory: any) => !selectedDiagnosesHistoryId.includes(diagnosesHistory.id)));
                setSelectedDiagnosesHistoryId([]);
            })
            .catch(() => {
                setOnDeleteSelectedDiagnoseHistory(false);
                toast.error("Riwayat diagnosis gagal dihapus", {
                    duration: 5000,
                });
            }), {
            loading: "Menghapus riwayat diagnosis...",
            success: "Riwayat diagnosis berhasil dihapus",
            error: "Riwayat diagnosis gagal dihapus",
        }, {
            duration: 7000,
        });
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLocalStorageDiagnosesHistory(JSON.parse(localStorage.getItem("diagnosesHistoryId") || "[]"));
        }
    }, [])

    useEffect(() => {
        sortSaveByNewestDate(userDiagnosesHistory, setUserDiagnosesHistory);
    }, [userDiagnosesHistory]);

    return (
        <>
            <Head>
                <title>Dashboard </title>
                <meta name="description" content="Sistem Pakar berbasis web ini dapat membantu anda dalam mendiagnosis hama dan penyakit pada tanaman jambu kristal anda, serta dapat memberikan solusi atas masalah yang dialami oleh tanaman jambu kristal anda secara gratis." />
            </Head>
            <Navbar userFullname={user.fullname} role={user?.role} />
            <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
                <h4 className="mb-3 text-xl font-bold">
                    Selamat {dayTimeText()} 👋 {user.fullname || "Tanpa nama"}
                </h4>
                <div className='transition-all duration-500 ease-in-out'>
                    {localStorageDiagnosesHistory.length > 0 && (
                        <div className={`my-6 shadow-lg alert`}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 w-6 h-6 stroke-info"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>{`Kamu punya ${localStorageDiagnosesHistory.length} riwayat diagnosis sebelumnya, apakah ingin anda simpan?`}</span>
                            </div>
                            <div className="flex-none">
                                <button className={`btn btn-sm btn-ghost`} onClick={handleClickRefuseSaveDiagnoseHistory} disabled={isLoadingSaveDiagnoseHistory}>Tolak</button>
                                <button className={`btn btn-sm btn-primary ${isLoadingSaveDiagnoseHistory ? 'loading' : ''}`} onClick={handleClickAcceptSaveDiagnoseHistory} disabled={isLoadingSaveDiagnoseHistory}>Terima</button>
                            </div>
                        </div>
                    )}
                    {selectedDiagnosesHistoryId.length > 0 && (
                        <div className={`my-6 shadow-lg alert`}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="flex-shrink-0 w-6 h-6 stroke-info"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>{`${selectedDiagnosesHistoryId.length} riwayat diagnosis dipilih`}</span>
                            </div>
                            <div className="flex-none">
                                <button className={`btn btn-sm btn-primary ${onDeleteSelectedDiagnoseHistory ? "loading" : ""}`} onClick={handleClickDeleteSelectedDiagnoseHistory} disabled={onDeleteSelectedDiagnoseHistory}>{onDeleteSelectedDiagnoseHistory ? "Menghapus" : "Hapus"}</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="w-full mt-8 overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" ref={globalCheckboxRef} onChange={() => {
                                            if (globalCheckboxRef.current?.checked) {
                                                setSelectedDiagnosesHistoryId(userDiagnosesHistory.map((diagnosesHistory: any) => diagnosesHistory.id));
                                            } else {
                                                setSelectedDiagnosesHistoryId([]);
                                            }
                                        }} />
                                    </label>
                                </th>
                                <th>Terdiagnosis</th>
                                <th>Persentase</th>
                                <th>Tanggal Konsultasi</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userDiagnosesHistory.length > 0 ? (
                                <>
                                    {userDiagnosesHistory.map((diagnosesHistory: {
                                        id: string;
                                        userId: string;
                                        pestsAndDeseasesId: string;
                                        finalCF: number;
                                        userInputData: string; //json
                                        createdAt: Date;
                                        updatedAt: Date;
                                        pestsAndDeseases: {
                                            code: number;
                                            name: string;
                                            imageUrl: string;
                                            createdAt: Date;
                                            updatedAt: Date;
                                            solution: string;
                                        }
                                    }, index: number) => (
                                        <tr key={index.toString()}>
                                            <th>
                                                <label>
                                                    <input type="checkbox" className="checkbox" value={diagnosesHistory.id} checked={
                                                        selectedDiagnosesHistoryId.includes(diagnosesHistory.id)
                                                    } onChange={() => {
                                                        if (selectedDiagnosesHistoryId.includes(diagnosesHistory.id)) {
                                                            setSelectedDiagnosesHistoryId(selectedDiagnosesHistoryId.filter((selectedDiagnosesHistoryId: string) => selectedDiagnosesHistoryId !== diagnosesHistory.id));
                                                        } else {
                                                            setSelectedDiagnosesHistoryId([...selectedDiagnosesHistoryId, diagnosesHistory.id]);
                                                        }
                                                    }} />
                                                </label>
                                            </th>
                                            <td>
                                                {diagnosesHistory.pestsAndDeseases.name}
                                            </td>
                                            <td>
                                                {diagnosesHistory.finalCF % 2 === 0 ? (diagnosesHistory.finalCF * 100).toFixed(0) : (diagnosesHistory.finalCF * 100).toFixed(2)}%
                                            </td>
                                            <td>{new Date(diagnosesHistory.createdAt).toLocaleString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "numeric",
                                                second: "numeric",
                                            })}</td>
                                            <th>
                                                <Link href={`/consult/${diagnosesHistory.id}`} className="btn btn-ghost btn-xs">Lihat Detail</Link>
                                            </th>
                                        </tr>
                                    ))}
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        <div className="text-gray-500">Tidak ada riwayat diagnosis</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    )
}
