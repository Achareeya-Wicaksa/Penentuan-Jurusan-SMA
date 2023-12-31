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
        destination: "/dashboard",
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

  switch (method) {
    case "POST":
      try {
        const pestsAndDeseasesHasSymptoms: {
          pestAndDeseaseCode: number;
          symptomCode: number;
          expertCF: number;
        }[] = req.body.data;

        pestsAndDeseasesHasSymptoms.forEach(async (item) => {
          const findPestOrDesease =
            await prisma.pestsAndDeseasesHasSymptoms.findFirst({
              where: {
                pestAndDeseaseCode: item.pestAndDeseaseCode,
                AND: {
                  symptomCode: item.symptomCode,
                },
              },
            });

          if (findPestOrDesease) {
            await prisma.pestsAndDeseasesHasSymptoms.update({
              where: {
                id: findPestOrDesease.id,
              },
              data: {
                expertCF: item.expertCF,
              },
            });
          } else {
            await prisma.pestsAndDeseasesHasSymptoms.create({
              data: {
                pestAndDeseaseCode: item.pestAndDeseaseCode,
                symptomCode: item.symptomCode,
                expertCF: item.expertCF,
              },
            });
          }
        });

        await prisma.pestsAndDeseasesHasSymptoms.deleteMany({
          where: {
            pestAndDeseaseCode: req.body.pestAndDeseaseCode,
            AND: {
              symptomCode: {
                notIn: pestsAndDeseasesHasSymptoms.map((_) => _.symptomCode),
              },
            },
          },
        });

        await prisma.$disconnect();

        synchronizeUsersDiagnosesHistories();

        return res.status(200).json({
          code: 200,
          message: "Berhasil menyimpan rule",
          data: req.body,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Gagal menyimpan rule",
        });
      }
      break;
    case "PUT":
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res
        .status(405)
        .end({ code: 405, message: `Method ${method} Not Allowed` });
      break;
  }
}
