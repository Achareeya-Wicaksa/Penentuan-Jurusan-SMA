import { loggedInUserDataType } from '@/types';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Head from "next/head";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { NextApiRequest, NextApiResponse } from 'next';
import { uncertaintyValueRawData } from '@/prisma/data';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import prisma from '@/prisma';
import Image from 'next/image';

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

        const pestOrDesease = await prisma.pestsAndDeseases.findUnique({
            where: {
                code: parseInt(code),
            },
            include: {
                PestsAndDeseasesHasSymptoms: {
                    include: {
                        symptoms: true,
                    },
                },
            },
        })

        const symptoms = await prisma.symptoms.findMany()

        return {
            props: {
                user: userCookie,
                pestOrDesease: JSON.parse(JSON.stringify(pestOrDesease)),
                symptoms: JSON.parse(JSON.stringify(symptoms)),
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
    pestOrDesease: any;
    symptoms: any;
}

const Admin = ({ user, pestOrDesease, symptoms }: AdminProps) => {
    const [selectedSymptomData, setSelectedSymptomData] = useState<number[]>(() => {
        const _selectedSymptomData = pestOrDesease.PestsAndDeseasesHasSymptoms.map((v: any) => v.symptomCode)
        return _selectedSymptomData;
    });
    const [selectedSymptomDataCF, setSelectedSymptomDataCF] = useState<number[]>(() => {
        const _selectedSymptomDataCF = pestOrDesease.PestsAndDeseasesHasSymptoms.map((v: any) => v.expertCF)
        return _selectedSymptomDataCF;
    });
    const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pestAndDeseaseCode = pestOrDesease.code;
        // @ts-ignore
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        // remap var data to contain only selected symptoms by code
        const selectedSymptoms = selectedSymptomData.map((code) => {
            return {
                symptomCode: code,
                expertCF: data[code],
            }
        })

        if (selectedSymptomData.length === 0) {
            toast.error('Sistem gagal menyimpan rule, silahkan pilih gejala terlebih dahulu', {
                duration: 5000,
            });
            setFetchIsLoading(false);
            return;
        }

        const fetchCreatePestOrDesease = (async (pestAndDeseaseCode: number) => {
            setFetchIsLoading(true);

            return await fetch(`/api/admin/pests-deseases/set-rule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pestAndDeseaseCode,
                    data: [...selectedSymptoms.map((symptom) => ({
                        ...symptom,
                        pestAndDeseaseCode,
                        expertCF: Number(symptom.expertCF),
                    }))],
                }),
            })
        })

        toast.promise(fetchCreatePestOrDesease(pestAndDeseaseCode)
            .then((res) => res.json())
            .then((res) => {
                router.push(`/admin/pests-deseases`);
            })
            .catch(() => {
                toast.error('Sistem gagal menyimpan rule, ada kesalahan pada sistem', {
                    duration: 5000,
                });
                setFetchIsLoading(false);
            }), {
            loading: 'Sistem sedang menyimpan rule...',
            success: 'Sistem berhasil menyimpan rule',
            error: 'Sistem gagal menyimpan rule',
        }, {
            duration: 5000,
        });
    }

    const handleSelectOneSymptom = (symptomCode: number) => {
        if (selectedSymptomData.find((v) => v === symptomCode)) {
            setSelectedSymptomData(selectedSymptomData.filter((v) => v !== symptomCode))
        } else {
            setSelectedSymptomData([...selectedSymptomData, symptomCode])
        }
    }

    const handleToggleAll = () => {
        if (selectedSymptomData.length === symptoms.length) {
            setSelectedSymptomData([])
        } else {
            setSelectedSymptomData(symptoms.map((symptom: any) => symptom.code))
        }
    }

    return (
        <>
            <Head>
                <title>Pengaturan Rule untuk [HP{pestOrDesease.code}]: {pestOrDesease.name} - SIPBUK Admin</title>
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
                            <Link href="/admin/pests-deseases">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Data Hama dan Penyakit
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            Pengaturan Rule untuk [HP{pestOrDesease.code}]: {pestOrDesease.name}
                        </li>
                    </ul>
                </div>
                <form onSubmit={onSubmitHandler} ref={formRef}>
                    <div className="flex items-center justify-between">
                        <h4 className="mb-2 text-xl font-bold">
                            Pengaturan Rule untuk [HP{pestOrDesease.code}]: {pestOrDesease.name}
                        </h4>
                        <button className={`btn btn-primary ${fetchIsLoading ? 'loading' : ''}`} type='submit' disabled={fetchIsLoading}>Simpan Rule</button>
                    </div>
                    <div className="mt-4">
                        <div className="mb-4 mockup-code">
                            <pre data-prefix=">">
                                <code>Aturan gejala dipilih: </code>
                                <code>G{JSON.stringify(selectedSymptomData)}</code>
                            </pre>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>
                                            <label>
                                                <input type="checkbox" className="checkbox" onChange={handleToggleAll} checked={
                                                    selectedSymptomData.length === symptoms.length
                                                } />
                                            </label>
                                        </th>
                                        <th>Kode Gejala</th>
                                        <th>Gambar</th>
                                        <th>Info Gejala</th>
                                        <th>CF Pakar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {symptoms.map((symptom: any, index: number) => (
                                        <tr key={index}>
                                            <th>
                                                <label>
                                                    <input type="checkbox" className="checkbox" value={symptom.code} onChange={() => handleSelectOneSymptom(symptom.code)} checked={selectedSymptomData.find((v) => v === symptom.code) ? true : false} />
                                                </label>
                                            </th>
                                            <td>{`G${symptom.code}`}</td>
                                            <td>
                                                {/* The button to open modal */}
                                                <label htmlFor={`modal-${symptom.code}`} className='w-[110px] h-[100px]'>
                                                    <Image className='object-cover rounded-md w-[110px] h-[100px]' src={symptom.imageUrl} alt='' width={110} height={100} loader={({ src }) => src} />
                                                </label>

                                                {/* Put this part before </body> tag */}
                                                <input type="checkbox" id={`modal-${symptom.code}`} className="modal-toggle" />
                                                <label htmlFor={`modal-${symptom.code}`} className="cursor-pointer modal">
                                                    <label className="relative modal-box" htmlFor="">
                                                        <h3 className="text-lg font-bold">Gambar Gejala (G{symptom.code})</h3>
                                                        <Image className='bg-cover rounded-md' src={symptom.imageUrl} alt='' width={800} height={500} loader={({ src }) => src} />
                                                    </label>
                                                </label>
                                            </td>
                                            <td>{symptom.info}</td>
                                            <td>
                                                <select className="w-full max-w-xs select select-bordered" name={symptom.code} disabled={selectedSymptomData.find((v) => v === symptom.code) ? false : true} defaultValue={
                                                    selectedSymptomDataCF.find((v, i) => i === selectedSymptomData.findIndex((v) => v === symptom.code)) ? selectedSymptomDataCF.find((v, i) => i === selectedSymptomData.findIndex((v) => v === symptom.code)) : 0
                                                }>
                                                    {[...uncertaintyValueRawData].sort((a, b) => a.value - b.value).slice(1).map((item, index) => (
                                                        <option key={index} value={item.value}>{item.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}

export default Admin;