import { regexp } from "@/utils/regexp";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "@/utils/nodemailer/transporter";
import passwordResetEmaiOptions from "@/utils/nodemailer/options/passwordResetEmailOptions";
import prisma from "@/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ code: 400, message: "Email tidak boleh kosong!" });
      }

      if (!regexp.email.test(email)) {
        return res
          .status(400)
          .json({ code: 400, message: "Email tidak valid!" });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ code: 400, message: "Email tidak terdaftar!" });
      }

      try {
        const newToken = `t-${uuidv4()}`;

        const userUpdated = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            passwordResetToken: newToken,
          },
        });

        transporter.sendMail(
          passwordResetEmaiOptions(
            userUpdated.fullname,
            userUpdated.email,
            newToken
          ),
          function (error: any, info: any) {
            if (error) {
              console.error(error);
              res.status(200).json({
                code: 200,
                message:
                  "Email untuk ubah kata sandi gagal dikirim! silahkan coba lagi",
              });
            } else {
              console.log("Email sent: " + info.response);
              res.status(200).json({
                code: 200,
                message: "Email untuk ubah kata sandi berhasil dikirim!",
              });
            }
          }
        );

        await prisma.$disconnect();
      } catch (error) {
        console.error(error);
        res.status(500).json({
          code: 500,
          message: "Internal server error",
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
