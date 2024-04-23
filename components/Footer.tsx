import Link from "next/link";

const email = process.env.NODEMAILER_USER;

const footLinks = [
  {
    heading: "Menu",
    links: [
      {
        name: "Beranda",
        href: "/",
      },
      {
        name: "Konsultasi",
        href: "/consult",
      },
      {
        name: "Tentang",
        href: "/about",
      },
    ],
  },
  {
    heading: "Lainnya",
    links: [
      {
        name: "Dokumentasi",
        href: "/docs",
      },
    ],
  },
];

export default function Footer() {
  return (
    <>
      <footer>
        <div className="pt-8 safe-horizontal-padding">
          <div className="block lg:flex lg:justify-between lg:gap-8">
            <div className="lg:max-w-sm lg:flex-1">
              <h1 className="text-3xl font-bold font-kodchasan">SMARIDUTA</h1>
              <p className="font-kodchasan font-bold text-[8.5px]">
              SMA Negeri 1 Kedungwaru Tulungagung
              </p>

              <p className="mt-4 text-base">
                
              </p>
            </div>

            <div className="flex flex-wrap mt-6 md:mt-8 lg:mt-0 lg:w-96 xl:w-1/2 lg:justify-between xl:justify-end lg:gap-14 gap-y-10">
              {footLinks.map(({ heading, links }, index) => (
                <div
                  key={index}
                  className="flex flex-col w-1/2 md:w-1/3 lg:w-auto"
                >
                  <h4 className="font-bold">
                    {heading}
                  </h4>

                  <ul>
                    {links.map(({ href, name }, index) => (
                      <li
                        key={index}
                        className="mt-4 text-base text-black/90 hover:text-blue-400"
                      >
                        {heading.toLowerCase() === "menu" ? (
                          <Link href={href}>{name}</Link>
                        ) : (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener"
                            referrerPolicy="no-referrer"
                          >
                            {name}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-6 md:py-8 safe-horizontal-padding">
         
        </div>
      </footer>
    </>
  );
}