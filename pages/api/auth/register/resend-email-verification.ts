import { transporter } from "@/utils/nodemailer/transporter";
import { regexp } from "@/utils/regexp";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import verificationEmailOptions from "@/utils/nodemailer/options/verificationEmailOptions";
import prisma from "@/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PUT":
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ code: 400, message: "Email harus diisi!" });
      }
      if (!regexp.email.test(email)) {
        return res
          .status(400)
          .json({ code: 400, message: "Format email salah!" });
      }
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
            fullname: true,
            verifyToken: true,
            isVerified: true,
          },
        });

        if (!user) {
          return res
            .status(400)
            .json({ code: 400, message: "Email tidak terdaftar!" });
        }

        if (user.isVerified) {
          return res.status(400).json({
            code: 400,
            message: `Email anda sudah terverifikasi!`,
          });
        }

        const verifyToken = `vt-${uuidv4()}`;

        await prisma.user.update({
          where: {
            email,
          },
          data: {
            verifyToken,
          },
        });

        transporter.sendMail(
          verificationEmailOptions(user.fullname, email, verifyToken),
          function (error: any, info: any) {
            if (error) {
              console.log("nodemailer transporter", error);
              res.status(500).json({
                code: 500,
                message:
                  "Daftar Berhasil! Email verifikasi gagal dikirim karena kesalahan server",
              });
            } else {
              console.log("Email sent: " + info.response);
              res.status(201).json({
                code: 201,
                message: `Daftar Berhasil! Silahkan cek email anda untuk melakukan verifikasi akun. Jika tidak ada di inbox, silahkan cek di folder spam atau promosi.`,
              });
            }
          }
        );

        res.status(200).json({
          code: 200,
          message: `Kami telah mengirimkan email verifikasi ke email ${user.email}`,
          data: user,
        });
        await prisma.$disconnect();
      } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Internal server error!" });
      }
  }
}
