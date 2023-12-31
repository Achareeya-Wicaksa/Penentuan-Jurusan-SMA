import fs from "fs";
import path from "path";

const resetPasswordEmailHTMLPath = path.join(
  process.cwd(),
  "public/templates/resetPasswordEmail.html"
);

export default function passwordResetEmaiOptions(
  fullname: string,
  email: string,
  resetToken: string
) {
  const resetPasswordEmailHTML = fs.readFileSync(
    resetPasswordEmailHTMLPath,
    "utf8"
  );
  return {
    from: `SIPBUK <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Pengaturan Ulang Kata Sandi Akun SIPBUK",
    html: resetPasswordEmailHTML
      .replaceAll("{{FULL_NAME}}", fullname)
      .replaceAll("{{RESET_TOKEN}}", resetToken)
      .replaceAll("{{APP_URL}}", process.env.APP_URL || "")
      .replaceAll("{{APP_NAME}}", process.env.APP_NAME || "")
      .replaceAll(
        "{{APP_DOMAIN}}",
        process.env.APP_URL?.replace(/^https?:\/\/|\/+$/g, "") || ""
      ),
  };
}
