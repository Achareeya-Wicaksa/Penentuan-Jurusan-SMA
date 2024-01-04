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
          findManyUsersDiagnosesHistories.map(async (item) => {
            const CFInstance = await new CertaintyFactor(
              //@ts-ignore
              JSON.parse(item.userInputData)
            ).generateConclusion();

            const conclusion = await CFInstance.conclusion;
            const userInputData = await CFInstance.userInputData;

            regenerateTemp.push({
              id: item.id,
              userId: item.nim,
              pestAndDeseaseCode: conclusion.fullname,
              finalCF: conclusion.username,
              //userInputData: JSON.stringify(userInputData),
            });
          })
        );

        await Promise.all(
          regenerateTemp.map(async (item) => {
            await prisma.usersDiagnoseHistory.update({
              where: {
                id: item.id,
              },
              data: {
                pestAndDeseaseCode: item.pestAndDeseaseCode,
                finalCF: item.finalCF,
                userInputData: item.userInputData,
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
