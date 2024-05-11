import { getServerSidePropsType, loggedInUserDataType } from '@/types';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Head from "next/head";
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import prisma from '@/prisma';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

        const ketentuan = await prisma.usersDiagnoseHistory.findMany()

        return {
            props: {
                user: userCookie,
                _ketentuan: JSON.parse(JSON.stringify(ketentuan)),
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
    _ketentuan: any;
}

const Admin = ({ user, _ketentuan }: AdminProps) => {
    const [ketentuan, setketentuan] = useState(() => [..._ketentuan]);
    const [selectedSymptoms, setSelectedKetentuan] = useState<any[]>([]);
    const [fetchIsLoading, setFetchIsLoading] = useState<boolean>(false);

    const handleDeleteSelectedSymptoms = async () => {
        const fetchDeletePestAndDesease = (async () => {
            setFetchIsLoading(true);

            return await fetch('/api/nilaisiswa/tambahdata/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedSymptoms,
                }),
            })
        })

        toast.promise(fetchDeletePestAndDesease()
            .then((res) => res.json())
            .then((res) => {
                setFetchIsLoading(false);
                setketentuan(ketentuan.filter((ketentuan: any) => !selectedSymptoms.includes(ketentuan.id)));
                setSelectedKetentuan([]);
            })
            .catch(() => {
                toast.error('Sistem gagal menghapus data, ada kesalahan pada sistem', {
                    duration: 5000,
                });
                setFetchIsLoading(false);
            }), {
            loading: 'Sistem sedang menghapus data...',
            success: 'Sistem berhasil menghapus data',
            error: 'Sistem gagal menghapus data',
        }, {
            duration: 5000,
        });
    }

    const handleSelectOneSymptom = (id: number) => {
        if (selectedSymptoms.find((v) => v === id)) {
            setSelectedKetentuan(selectedSymptoms.filter((v) => v !== id))
        } else {
            setSelectedKetentuan([...selectedSymptoms, id])
        }
    }

    const handleToggleAll = () => {
        if (selectedSymptoms.length === ketentuan.length) {
            setSelectedKetentuan([])
        } else {
            setSelectedKetentuan(ketentuan.map((ketentuan: any) => ketentuan.id))
        }
    }

    const ketentuanWithoutActions = ketentuan.map(({ id, userId, nama, finalCF, userInputData, pestAndDeseaseCode }) => ({
        id,
        userId,
        nama,
        finalCF,
        userInputData,
        pestAndDeseaseCode
    }));

    const exportPDF = () => {
        const doc = new jsPDF();
    
        const text1 = "SMA 1 Kedungwaru Tulungagung";
        const text2 = "Jl. Dr. Wahidin Sudiro Husodo No.12, Kedung Indah,";
        const text3 = "Kedungwaru, Kec. Kedungwaru, Kabupaten Tulungagung, Jawa Timur 66224";
        const text4 = "Hasil Prediksi Jurusan dengan test minat";
    
        // Mengukur lebar teks
        const textWidth1 = doc.getTextWidth(text1);
        const textWidth2 = doc.getTextWidth(text2);
        const textWidth3 = doc.getTextWidth(text3);
        const textWidth4 = doc.getTextWidth(text4);
    
        // Mengatur posisi x agar berada di tengah
        const xPosition1 = (doc.internal.pageSize.width - textWidth1) / 2;
        const xPosition2 = (doc.internal.pageSize.width - textWidth2) / 2;
        const xPosition3 = (doc.internal.pageSize.width - textWidth3) / 4;
        const xPosition4 = (doc.internal.pageSize.width - textWidth4) / 2;
    
        doc.text(text1, xPosition1, 15);
        doc.text(text4, xPosition4, 40); 
        doc.setFontSize(10); 
        doc.text(text2, xPosition1, 20);    
        doc.text(text3, xPosition1, 25);    

        doc.autoTable({
            head: [['Nim', 'Nama Lengkap', 'Prediksi perhitungan CF', 'Jawaban yang dipilih', 'Hasil Prediksi']],
            body: ketentuanWithoutActions.map(({ userId, nama, finalCF, userInputData, pestAndDeseaseCode }) => [userId, nama, finalCF, userInputData, pestAndDeseaseCode]),
            startY: 60 // Tentukan posisi tabel untuk dimulai setelah teks di bagian atas
        });
    
        doc.save('hasil_test_siswa.pdf');
    };
    
    return (
        <>
            <Head>
                <title>hasil test</title>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            Hasil Test Siswa
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col flex-wrap items-start justify-between lg:items-center lg:flex-row">
                    <h4 className="mb-2 text-xl font-bold">
                        Hasil Test Siswa
                    </h4>
                    <div className='flex flex-row-reverse items-center justify-center gap-4 lg:flex-row'>
                        {selectedSymptoms.length > 0 && (
                            <button className={`btn btn-error text-white ${fetchIsLoading ? "loading" : ""}`} onClick={handleDeleteSelectedSymptoms} disabled={fetchIsLoading}>Hapus {selectedSymptoms.length} Data</button>
                        )}
                        <button className="btn btn-primary" onClick={exportPDF}>Unduh PDF</button>
                    </div>
                </div>
                <div className="mt-4 pt-10">
                    <div className="w-full overflow-x-auto">
                        <table id="dataTable" className="table w-full">
                            <thead>
                                <tr>
                                    <th>
                                        <label>
                                            <input type="checkbox" className="checkbox" onChange={handleToggleAll} checked={
                                                selectedSymptoms.length === ketentuan.length ? true : false
                                            } disabled={fetchIsLoading} />
                                        </label>
                                    </th>
                                    <th>Nim</th>
                                    <th>Nama Lengkap</th>
                                    <th>Prediksi perhitungan CF</th>
                                    <th>Jawaban yang dipilih</th>
                                    <th>Hasil Prediksi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ketentuan.length > 0 ? ketentuan.map((ketentuan: any, index: number) => (
                                    <tr key={index}>
                                        <th>
                                            <label>
                                                <input type="checkbox" className="checkbox" onChange={() => handleSelectOneSymptom(ketentuan.id)} checked={
                                                    selectedSymptoms.find((v) => v === ketentuan.id) ? true : false
                                                } disabled={fetchIsLoading} />
                                            </label>
                                        </th>
                                        <td>{`${ketentuan.userId}`}</td>
                                        <td>
                                        {`${ketentuan.nama}`}
                                        </td>
                                        <td>{ketentuan.finalCF}</td>
                                        <td>{ketentuan.userInputData}</td>
                                        <td>{ketentuan.pestAndDeseaseCode}</td>
                                        <td>
                                            <div className='flex flex-row items-center justify-start gap-2'>
                                                <Link href={`/daftarsiswa/edit/${ketentuan.id}`} className="btn btn-outline btn-info btn-xs">Ubah</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            <div className="text-gray-500">Tidak ada Hasil Test Siswa</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Admin;
