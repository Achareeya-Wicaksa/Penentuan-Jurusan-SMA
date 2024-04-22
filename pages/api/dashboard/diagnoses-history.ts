import prisma from "@/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { diagnosesId, userId }: { diagnosesId: string[]; userId: number } =
    req.body;

  switch (method) {
    case "POST":
      try {
        const updatedData = await prisma.usersDiagnoseHistory.updateMany({
          where: {
            id: {
              in: diagnosesId,
            },
          },
          data: {
            userId,
          },
        });

        const getUpdatedData = await prisma.usersDiagnoseHistory.findMany({
          where: {
            id: {
              in: diagnosesId,
            },
          },
          include: {
            jurusan: true,
          },
        });

        if (updatedData.count === 0) {
          res.status(404).json({
            code: 404,
            message: "Riwayat diagnosis tidak ditemukan",
          });
          return;
        }

        await prisma.$disconnect();
        res.status(200).json({
          code: 200,
          message: "Berhasil menyimpan riwayat diagnosis sebelumnya",
          data: getUpdatedData,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Gagal menyimpan riwayat diagnosis sebelumnya",
        });
      }

      break;

    case "DELETE":
      try {
        const deletedData = await prisma.usersDiagnoseHistory.deleteMany({
          where: {
            id: {
              in: diagnosesId,
            },
            userId: {
              equals: userId,
            },
          },
        });

        if (deletedData.count === 0) {
          res.status(404).json({
            code: 404,
            message: "Riwayat diagnosis tidak ditemukan",
          });
          return;
        }

        res.status(200).json({
          code: 200,
          message: "Berhasil menghapus riwayat diagnosis sebelumnya",
        });

        await prisma.$disconnect();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Gagal menghapus riwayat diagnosis sebelumnya",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res
        .status(405)
        .end({ code: 405, message: `Method ${method} Not Allowed` });
      break;
  }
}
