import prisma from "@/prisma";
import { synchronizeUsersDiagnosesHistories } from "@/utils/synchronizeUsersDiagnosesHistories";
import { deleteCookie, getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const isCookieExist = getCookie("user", { req, res });
    const userCookie = isCookieExist
        ? // @ts-ignore
        JSON.parse(getCookie("user", { req, res }))
        : null;

    if ((userCookie && userCookie.role !== "admin") || !userCookie) {
        return {
            redirect: {
                destination: "/login",
                permanent: true,
            },
        };
    }

    const foundedUser = await prisma.user.findUnique({
        where: {
            authToken: userCookie.authToken,
        },
    });

    if (!foundedUser) {
        deleteCookie("user", { req, res });
        return res.status(401).json({
            code: 401,
            message: "Unauthorized",
        });
    }

    const { method } = req;
    const { info, imageUrl }: { info: string, imageUrl: string } = req.body;

    switch (method) {
        case "POST":
            try {
                const createSymptom = await prisma.ketentuan.create({
                    // @ts-ignore
                    data: {
                        info,
                        imageUrl: imageUrl ? imageUrl : " https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
                    },
                });

                if (!createSymptom) {
                    return res.status(404).json({
                        code: 404,
                        message: "Data Pertanyaan gagal disimpan",
                    });
                }

                await prisma.$disconnect();
                res.status(200).json({
                    code: 200,
                    message: "Berhasil menyimpan data Pertanyaan",
                    data: createSymptom,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    code: 500,
                    message: "Gagal menyimpan data Pertanyaan",
                });
            }
            break;
        case "PUT":
            try {
                const updateSymptom = await prisma.ketentuan.update({
                    where: {
                        code: parseInt(req.body.symptomCode),
                    },
                    data: {
                        info,
                        imageUrl: imageUrl ? imageUrl : " https://res.cloudinary.com/sipbuk/image/upload/v1689001147/symptoms/default.webp",
                    },
                });

                if (!updateSymptom) {
                    return res.status(404).json({
                        code: 404,
                        message: "Data Pertanyaan gagal diperbarui",
                    });
                }

                await prisma.$disconnect();
                res.status(200).json({
                    code: 200,
                    message: "Berhasil mengubah data Pertanyaan",
                    data: updateSymptom,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    code: 500,
                    message: "Gagal mengubah data Pertanyaan",
                });
            }
            break;
        case "DELETE":
            try {
                const symptomsOnPestsAndDeseasesHasSymptoms = await prisma.rules.deleteMany({
                    where: {
                        symptomCode: {
                            in: req.body.selectedSymptoms,
                        }
                    }
                });

                if (!symptomsOnPestsAndDeseasesHasSymptoms) {
                    return res.status(404).json({
                        code: 404,
                        message: "Pertanyaan tidak ditemukan",
                    });
                }

                const deleteSymptom = await prisma.ketentuan.deleteMany({
                    where: {
                        code: {
                            in: req.body.selectedSymptoms,
                        },
                    },
                });

                if (!deleteSymptom) {
                    return res.status(404).json({
                        code: 404,
                        message: "Pertanyaan tidak ditemukan",
                    });
                }

                synchronizeUsersDiagnosesHistories();

                await prisma.$disconnect();

                res.status(200).json({
                    code: 200,
                    message: "Berhasil menghapus Pertanyaan",
                    data: symptomsOnPestsAndDeseasesHasSymptoms,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    code: 500,
                    message: "Gagal menghapus Pertanyaan",
                });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res
                .status(405)
                .end({ code: 405, message: `Method ${method} Not Allowed` });
            break;
    }
}
