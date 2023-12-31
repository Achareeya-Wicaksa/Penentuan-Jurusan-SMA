import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      const token: any = req.query.token;

      try {
        const user = await prisma.user.findFirst({
          where: {
            verifyToken: token,
          },
        });

        if (user) {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              isVerified: true,
            },
          });

          await prisma.$disconnect();

          if (!user.isVerified) {
            return res.redirect(
              `/register/email-verification?status=success&email=${user.email}`
            );
          }

          return res.redirect(
            `/register/email-verification?status=failed&email=${user.email}&reason=already_verified`
          );
        } else {
          return res.redirect(
            `/register/email-verification?status=failed&reason=broken_link`
          );
        }
      } catch (error) {
        console.error(error);
        res.redirect(`/register/email-verification?status=failed`);
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
