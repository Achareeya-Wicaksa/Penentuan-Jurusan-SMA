import { transporter } from "@/utils/nodemailer/transporter";
import { serverSideAESDecrypt, serverSideAESEncrypt } from "@/utils/cryptoAES";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import passwordChangedEmailOptions from "@/utils/nodemailer/options/passwordChangedEmail";
import prisma from "@/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      const hashAES = req.body;
      const token = req.body.token;
      const password = serverSideAESDecrypt(hashAES.password);
      const passwordConfirm = serverSideAESDecrypt(hashAES.passwordConfirm);

      if (!token) {
        return res.status(400).json({
          code: 400,
          message: "Token tidak boleh kosong!",
        });
      }

      if (!password) {
        return res.status(400).json({
          code: 400,
          message: "Kata Sandi tidak boleh kosong",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          code: 400,
          message: "Kata Sandi minimal 6 karakter",
        });
      }

      if (!passwordConfirm) {
        return res.status(400).json({
          code: 400,
          message: "Konfirmasi Kata Sandi tidak boleh kosong",
        });
      }

      if (passwordConfirm.length < 6) {
        return res.status(400).json({
          code: 400,
          message: "Konfirmasi Kata Sandi minimal 6 karakter",
        });
      }

      if (password !== passwordConfirm) {
        return res.status(400).json({
          code: 400,
          message: "Kata Sandi dan Konfirmasi Kata Sandi tidak sama",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
        },
      });

      if (!user) {
        return res.status(400).json({
          code: 400,
          message: "Token tidak valid!",
        });
      }

      try {
        const userUpdated = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: serverSideAESEncrypt(password),
            passwordResetToken: null,
          },
        });

        transporter.sendMail(
          passwordChangedEmailOptions(
            userUpdated.fullname,
            userUpdated.email,
            user.updatedAt
          ),
          function (error: any, info: any) {
            if (error) {
              console.error(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );

        res.status(200).json({
          code: 200,
          message: "Password berhasil diubah, silahkan masuk kembali!",
        });

        await prisma.$disconnect();
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          code: 500,
          message: "Internal Server Error",
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
