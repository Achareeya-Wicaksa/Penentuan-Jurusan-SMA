import { serverSideAESDecrypt } from "@/utils/cryptoAES";
import { NextApiRequest, NextApiResponse } from "next";
import { regexp } from "@/utils/regexp";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      const hashAES: {
        password: string;
      } = req.body;

      const username = req.body.username;

      const password = req.body.password;

      if (!username) {
        return res
          .status(400)
          .json({ code: 400, message: "Email harus diisi!" });
      }

      

      if (!password) {
        return res
          .status(400)
          .json({ code: 400, message: "Kata sandi harus diisi!" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ code: 400, message: "Kata sandi kurang dari 6 karakter!" });
      }

      try {
        const foundedUser = await prisma.daftarSiswa.findFirst({
          where: {
            username,
          },
          select: {
            id: true,
            nim: true,
            fullname: true,
            password: true,
            
          },
        });

        if (!foundedUser) {
          return res
            .status(400)
            .json({ code: 400, message: "Username tidak terdaftar!" });
        }

        const decryptedUserPassword = (
          foundedUser.password
        );

        if (decryptedUserPassword !== password) {
          return res
            .status(400)
            .json({ code: 400, message: "Password salah!" });
        }

       

        const authToken = `at-${uuidv4()}`;

        const updatedUser = await prisma.daftarSiswa.update({
          where: {
            id: foundedUser.id,
          },
          data: {
           
          },
        });

        res.status(200).json({
          code: 200,
          message: `Selamat datang ${foundedUser.fullname}!`,
          data: {
            id: updatedUser.id,
            nim: updatedUser.nim,
            fullname: updatedUser.fullname,
            
          },
        });
        await prisma.$disconnect();
      } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: "Kesalahan Server!" });
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
