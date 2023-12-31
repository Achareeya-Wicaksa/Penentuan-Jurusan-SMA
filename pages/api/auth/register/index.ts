import { serverSideAESDecrypt } from "@/utils/cryptoAES";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { regexp } from "@/utils/regexp";
import { transporter } from "@/utils/nodemailer/transporter";
import verificationEmailOptions from "@/utils/nodemailer/options/verificationEmailOptions";
import prisma from "@/prisma";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      POST(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res
        .status(405)
        .end({ code: 405, message: `Method ${method} Not Allowed` });
      break;
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const hashAES: {
    password: string;
  } = req.body;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = serverSideAESDecrypt(hashAES.password);

  if (!fullname) {
    return res
      .status(400)
      .json({ code: 400, message: "Nama Lengkap tidak boleh kosong!" });
  }

  if (fullname.length < 2) {
    return res.status(400).json({
      code: 400,
      message: "Nama Lengkap setidaknya terdiri dari 2 huruf!",
    });
  }

  if (!regexp.fullname.test(fullname)) {
    return res
      .status(400)
      .json({ code: 400, message: "Nama Lengkap harus berupa huruf alfabet!" });
  }

  if (!email) {
    return res
      .status(400)
      .json({ code: 400, message: "Email tidak boleh kosong!" });
  }

  if (!regexp.email.test(email)) {
    return res.status(400).json({ code: 400, message: "Email tidak valid!" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ code: 400, message: "Password tidak boleh kosong!" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      code: 400,
      message: "Password setidaknya terdiri dari 6 karakter!",
    });
  }

  try {
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return res
        .status(400)
        .json({ code: 400, message: "Email sudah terdaftar!" });
    }

    const verifyToken = `vt-${uuidv4()}`;

    await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashAES.password,
        isVerified: false,
        verifyToken,
      },
    });

    transporter.sendMail(
      verificationEmailOptions(fullname, email, verifyToken),
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
            message:
              "Berhasil mendaftar! Cek email untuk verifikasi. Jika tidak di inbox, cek spam atau promosi.",
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Internal server error!" });
  }

  await prisma.$disconnect();
}
