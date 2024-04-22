// @ts-nocheck

import Head from 'next/head';
import { getCookie, hasCookie } from "cookies-next";
import Navbar from '@/components/Navbar';
import CertaintyFactor, { TCalculatedCombinationRuleCF } from '@/utils/certaintyFactor';
import Link from 'next/link';
import { NextApiRequest, NextApiResponse } from 'next';
import Footer from '@/components/Footer';
import prisma from '@/prisma';

type getServerSidePropsType = {
    params: {
        diagnoseId: string;
    };
    req: NextApiRequest;
    res: NextApiResponse;
}

export async function getServerSideProps({ params: { diagnoseId }, req, res }: getServerSidePropsType) {
    const isCookieExist = hasCookie("user", { req, res });

    const foundDiagnoseHistory = await prisma.usersDiagnoseHistory.findUnique({
        where: {
            id: diagnoseId
        },
        include: {
            jurusan: true,
        }
    });

    if (!foundDiagnoseHistory) {
        return {
            notFound: true,
        }
    }

    const userInput = JSON.parse(foundDiagnoseHistory.userInputData)
    const CFInstance = new CertaintyFactor(userInput)
    const newHistoryStep = (await CFInstance.calculateCombinationRule()).calculatedCombinationRuleCF;

    try {
        const userCookie = isCookieExist ? JSON.parse(getCookie("user", { req, res })) : null;

        await prisma.$disconnect();
        return {
            props: {
                user: userCookie,
                diagnoseHistory: JSON.parse(JSON.stringify(foundDiagnoseHistory)),
                diagnoseHistoryStep: JSON.parse(JSON.stringify(newHistoryStep))
            }
        }
    } catch (error) {
        console.error(error)
        return {
            props: {
                user: null,
                diagnoseHistory: JSON.parse(JSON.stringify(foundDiagnoseHistory)),
                diagnoseHistoryStep: JSON.parse(JSON.stringify(newHistoryStep))
            }
        }
    }

}

interface DiagnoseResultProps {
    user: loggedInUserDataType | null;
    diagnoseHistory: {
        id: string;
        userId: string;
        pestAndDeseaseCode: number;
        finalCF: number;
        userInputData: string; //json
        createdAt: string;
        updatedAt: string;
        jurusan: {
            code: number;
            name: string;
            imageUrl: string;
            solution: string; //string html
            activeIngredient: string; //string html
            createdAt: string;
            updatedAt: string
        }
    };
    diagnoseHistoryStep: TCalculatedCombinationRuleCF[];
}

export default function DiagnoseResult({ user, diagnoseHistory, diagnoseHistoryStep }: DiagnoseResultProps): JSX.Element {

    const getPercentageAccuration = (floatAccuration: number): string => {
        if (floatAccuration === 1) return `${(floatAccuration * 100).toFixed(0)}%`;
        if ((floatAccuration * 100) % 2 === 0) return `${(floatAccuration * 100).toFixed(0)}%`;
        return `${(floatAccuration * 100).toFixed(2)}%`;
    }

    const getAccurationLevel = (accurate: number): string => {
        if (accurate >= 0.9 && accurate <= 1) {
            return "Sangat Tinggi"
        } else if (accurate >= 0.8 && accurate < 0.9) {
            return "Tinggi"
        } else if (accurate >= 0.6 && accurate < 0.8) {
            return "Sedang"
        } else if (accurate >= 0.4 && accurate < 0.6) {
            return "Rendah"
        } else {
            return "Sangat Rendah"
        }
    }

    const toFixedEmitter = (num: number): number => {
        return Number(num) % 2 == 0 ? Number(num).toFixed(0) : Number(num).toFixed(2);
    }

    return (
        <>
            <Head>
                <title>Hasil test</title>
                <meta name="description" content="." />
            </Head>
            <Navbar isSticky={true} userFullname={user?.fullname} role={user?.role} />
            <main className="safe-horizontal-padding my-[16px] md:my-[48px]">
                <div className="h-full md:h-[482px] bg-primary rounded-2xl flex flex-col justify-center items-center p-6 md:p-6">
                    <h2 className="text-center leading-[38px] md:leading-[48px] text-[30px] md:text-[40px] font-bold mb-4">
                        Hasil Diagnosis
                    </h2>
                    <p className="text-center text-base leading-[24px] max-w-[660px]">
                        Hasil Diagnosis menunjukan bahwa anda cocok pada <b className='capitalize'>{diagnoseHistory.jurusan.name}</b> dengan tingkat <b>Akurasi {getAccurationLevel(diagnoseHistory.finalCF)}</b> sebesar <b>{getPercentageAccuration(diagnoseHistory.finalCF)}</b>
                    </p>
                    <a href="#solusi" className="mt-5 btn btn-active btn-ghost">Lihat Solusi</a>
                </div>

                <section id='solusi' className='pt-20'>
                    <h2 className="text-center leading-[38px] md:leading-[48px] text-[30px] md:text-[40px] font-bold mb-4">
                        test
                    </h2>
                    <p className="text-center text-base leading-[24px] max-w-[660px] m-auto mb-2">
                        Berikut hasil
                    </p>
                    <p className='text-center text-base leading-[24px] max-w-[660px] m-auto mb-10 text-gray-500'>Terakhir diperbarui pada {new Date(diagnoseHistory.jurusan.updatedAt).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</p>
                    <div className='flex flex-col gap-0 lg:gap-3 lg:flex-row'>
                        <div className='flex-grow'>
                            <h3 className="text-center leading-[38px] md:leading-[48px] text-[20px] md:text-[30px] font-bold mb-4">
                                diisi
                            </h3>
                            <p className='text-justify md:text-left text-base leading-[24px] max-w-[660px] m-auto'>
                                diisi admin
                            </p>
                            <div className='text-justify md:text-left prose prose-p:my-3 text-base leading-[24px] max-w-[660px] m-auto' dangerouslySetInnerHTML={{ __html: diagnoseHistory.jurusan.solution }}></div>
                        </div>
                        <div className="hidden divider lg:flex lg:divider-horizontal">
                            disi admin
                        </div>
                        <div className="flex divider lg:hidden lg:divider-horizontal">
                        </div>
                        <div>
                            <h3 className="text-center leading-[38px] md:leading-[48px] text-[20px] md:text-[30px] font-bold mb-4">
                            test
                            </h3>
                            <p className='text-justify md:text-left text-base leading-[24px] max-w-[660px] m-auto'>
                                test
                            </p>
                            <div className='text-justify md:text-left prose prose-p:my-3 text-base leading-[24px] max-w-[660px] m-auto' dangerouslySetInnerHTML={{ __html: diagnoseHistory.jurusan.activeIngredient }}></div>
                        </div>
                    </div>
                </section>

                <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box my-[42px] lg:my-[102px]">
                    <input type="checkbox" className="peer" />

                    <div className="text-xl font-medium collapse-title">
                        Persentase 
                    </div>
                    <div className="collapse-content">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Kode</th>
                                        <th>Nama jurusan</th>
                                        <th>Persentase</th>
                                        <th>Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {diagnoseHistoryStep.sort((a, b) => b.finalCF - a.finalCF).map((step, i) => (
                                        <tr key={i} className={i == 0 ? 'text-green-500' : ''}>
                                            <td>{step.code}</td>
                                            <td>{step.name}</td>
                                            <td>{toFixedEmitter(step.finalCF * 100)}%</td>
                                            <td>{getAccurationLevel(step.finalCF)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center my-[82px] lg:my-[142px]">
                    <h4 className="mb-3 text-3xl font-bold max-w-[552px]">
                        Apakah anda ingin melakukan diagnosis lagi?
                    </h4>
                    <p className="mb-6 text-base max-w-[552px]">
                        Jika iya, klik tombol <b>*Diagnosis Ulang*</b> dibawah
                    </p>
                    <Link
                        href="/consult"
                        className={`capitalize btn btn-active btn-ghost`}
                    >
                        Diagnosis Ulang
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    )
}