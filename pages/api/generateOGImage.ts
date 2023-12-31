import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";

// Usage Example:
// But puppeteer need chromium to run, so we need have a executablePath to chromium browser path
// const ogImageUrl = `${process.env.APP_URL}/api/generateOGImage?url=${encodeURIComponent(
//   `${process.env.APP_URL}${router.asPath}`
// )}&height=680`;

// <meta property="og:image" content={ogImageUrl} />

// access example: example: http://localhost:3000/api/generateOGImage?url=http://localhost:3000/&width=1200&height=630

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url: any = req.query.url;
  const width = req.query.width || 1200;
  const height = req.query.height || 630;

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: Number(width), height: Number(height) });
  await page.goto(url, { waitUntil: "networkidle2" });

  const file = await page.screenshot({ type: "jpeg", quality: 75 });

  await browser.close();

  res.setHeader("Content-Type", `image/jpeg`);
  res.setHeader(
    "Cache-Control",
    "public, immutable, no-transform, s-maxage=31536000, max-age=31536000"
  );
  res.end(file);
}
