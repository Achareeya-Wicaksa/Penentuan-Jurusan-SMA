import fs from "fs";
import path from "path";

const verificationEmailHTMLPath = path.join(
  process.cwd(),
  "public/templates/verificationEmail.html"
);

export default function verificationEmailOptions(
  fullname: string,
  email: string,
  verificationToken: string
) {
  const verificationEmailHTML = fs.readFileSync(
    verificationEmailHTMLPath,
    "utf8"
  );
  return {
    from: `SIPBUK <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Verifikasi Email Akun SIPBUK",
    html: verificationEmailHTML
      .replaceAll("{{FULL_NAME}}", fullname)
      .replaceAll("{{VERIFICATION_TOKEN}}", verificationToken)
      .replaceAll("{{APP_URL}}", process.env.APP_URL || "")
      .replaceAll("{{APP_NAME}}", process.env.APP_NAME || "")
      .replaceAll(
        "{{APP_DOMAIN}}",
        process.env.APP_URL?.replace(/^https?:\/\/|\/+$/g, "") || ""
      ),
  };
}
