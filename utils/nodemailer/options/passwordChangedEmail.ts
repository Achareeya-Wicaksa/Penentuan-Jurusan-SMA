import fs from "fs";
import path from "path";

const passwordChangedHTMLPath = path.join(
  process.cwd(),
  "public/templates/passwordChangedEmail.html"
);

export default function passwordChangedEmailOptions(
  fullname: string,
  email: string,
  changedDate: Date
) {
  const resetPasswordEmailHTML = fs.readFileSync(
    passwordChangedHTMLPath,
    "utf8"
  );
  return {
    from: `SIPBUK <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Kata Sandi Telah Diubah",
    html: resetPasswordEmailHTML
      .replaceAll("{{FULL_NAME}}", fullname)
      .replaceAll(
        "{{CHANGE_DATE}}",
        `${new Date(changedDate).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}`
      )
      .replaceAll("{{APP_URL}}", process.env.APP_URL || "")
      .replaceAll("{{APP_NAME}}", process.env.APP_NAME || "")
      .replaceAll(
        "{{APP_DOMAIN}}",
        process.env.APP_URL?.replace(/^https?:\/\/|\/+$/g, "") || ""
      ),
  };
}
