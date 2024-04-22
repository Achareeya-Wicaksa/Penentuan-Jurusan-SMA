import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import prisma from "@/prisma";
import CertaintyFactor from "@/utils/certaintyFactor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const findManyUsersDiagnosesHistories =
        await prisma.daftarSiswa.findMany();
      const regenerateTemp: any[] = [];

      if (findManyUsersDiagnosesHistories.length > 0) {
        

        await Promise.all(
          regenerateTemp.map(async (item) => {
            await prisma.daftarSiswa.update({
              where: {
                id: item.id,
              },
              data: {
              
              nim: item.nim,
              fullname: item.fullname,
              username: item.username,
              password: item.password,
              },
            });
          })
        );
      }

      res.status(200).json({
        code: 200,
        oldData: findManyUsersDiagnosesHistories,
        newData: regenerateTemp,
      });
      break;
    default:
      res.status(405).json({
        code: 405,
        message: "Method Not Allowed",
      });
      break;
  }
}
