import prisma from "@/prisma";
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
  const {
    name,
    solution,
    activeIngredient,
  }: { name: string; solution: string; activeIngredient: string } = req.body;

  switch (method) {
    case "POST":
      try {
        const createPestOrDesease = await prisma.jurusan.create({
          // @ts-ignore
          data: {
            name,
            solution,
            activeIngredient,
          },
        });

        if (!createPestOrDesease) {
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
          data: createPestOrDesease,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Gagal menyimpan riwayat diagnosis sebelumnya",
        });
      }
      break;
    case "PUT":
      try {
        const { pestOrDeseaseCode, data }: any = req.body;
        const updatePestOrDesease = await prisma.jurusan.update({
          where: {
            code: parseInt(pestOrDeseaseCode),
          },
          data: {
            name: data.name,
            solution: data.solution,
            activeIngredient: data.activeIngredient,
          },
        });

        if (!updatePestOrDesease) {
          res.status(404).json({
            code: 404,
            message: "tidak ditemukan",
          });
        }

        await prisma.$disconnect();

        res.status(200).json({
          code: 200,
          message: "Berhasil mengubah",
          data: updatePestOrDesease,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Gagal mengubah",
        });
      }
      break;
    case "DELETE":
      try {
        await prisma.rules.deleteMany({
          where: {
            pestAndDeseaseCode: {
              in: req.body.selectedPestsDeseases,
            },
          },
        });


        const deletePestOrDesease = await prisma.jurusan.deleteMany({
          where: {
            code: {
              in: req.body.selectedPestsDeseases,
            },
          },
        });

        if (!deletePestOrDesease) {
          res.status(404).json({
            code: 404,
            message: "tidak ditemukan",
          });

          return res.status(404).json({
            code: 404,
            message: "tidak ditemukan",
          });
        }

        await prisma.$disconnect();

        res.status(200).json({
          code: 200,
          message: "Berhasil menghapus",
          data: deletePestOrDesease,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Gagal menghapus",
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
