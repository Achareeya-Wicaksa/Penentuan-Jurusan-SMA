import SafeLayout from "@/layouts/SafeLayout";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { RxHamburgerMenu } from "react-icons/rx";

const navLinks = [
  {
    label: "Beranda",
    path: "/",
  },
 // {
 //   label: "Konsultasi",
 //   path: "/consult",
 // },
  {
    label: "Tentang",
    path: "/about",
  },
  {
    label: "Dokumentasi",
    path: "/dokumentasi",
  },
  {
    label: "Test Minat",
    path: "/test_siswa",
  },
];

interface NavbarProps {
  isSticky?: boolean;
  userFullname?: string | null;
  role?: string | null;
}

export default function Navbar({ isSticky = true, userFullname = null, role = null }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClickLogout = () => {
    toast.success(`Sampai jumpa ${userFullname}!`, {
      duration: 5000,
      icon: "👋",
    });
    deleteCookie("user");
    router.push("/");
  }

  return (
    <nav className={`${isSticky ? "sticky top-0" : ""} z-50`}>
      <div className="max-h-[76px] h-full bg-white py-2">
        {/* brand */}
        <div className="flex flex-row items-center justify-between w-full safe-horizontal-padding">
          <Link
            href="/"
            className="relative text-transparent transition-colors duration-300 bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text hover:from-blue-400 hover:to-red-400 hover:transition-transform hover:duration-1000"
          >
            <h1 className="text-4xl font-bold font-kodchasan">SMARIDUTA</h1>
            <p className="font-kodchasan font-bold text-[10px]">
              SMA Negeri 1 Kedungwaru Tulungagung
            </p>
          </Link>

          <div>
            {/* desktop navlink */}
            <div className="hidden lg:block">
              {navLinks.map((nl, index) => (
                <Link
                  className={`${index === navLinks.length ? "" : "mr-[38px]"} ${pathname === nl.path ? "font-semibold" : ""
                    } text-base`}
                  key={index}
                  href={nl.path}
                >
                  {nl.label}
                </Link>
              ))}
              {userFullname ? (
                <div className="dropdown dropdown-bottom dropdown-end">
                  <label
                    tabIndex={0}
                    className="m-1 text-white btn btn-outline btn-success"
                  >
                    {userFullname}
                  </label>
                  <ul
                    tabIndex={0}
                    className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
                  >
                    {role === "admin" && (
                      <li>
                        <Link href="/admin">Admin Dashboard</Link>
                      </li>
                    )}
                    <li>
                      <button onClick={handleClickLogout}>Keluar</button>
                    </li>
                  </ul>
                </div>
              ) : (
              //  <Link
              //    className="w-24 text-base capitalize btn btn-outline btn-success"
              //    href="/login"
              //  >
              //    Masuk
              //  </Link>
              ''
              )}
            </div>

            {/* mobile navlink */}
            <div className="relative lg:hidden">
              <div className="dropdown dropdown-bottom dropdown-end">
                <label
                  tabIndex={0}
                  className="m-1 text-white btn btn-outline btn-success"
                >
                  <RxHamburgerMenu />
                </label>
                <ul
                  tabIndex={0}
                  className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
                >
                  {role === "admin" && (
                    <li>
                      <Link href="/admin">Admin Dashboard</Link>
                    </li>
                  )}
                  {userFullname && (
                    <li>
                      <Link href="/login">{role === "admin" && "User "}Dashboard</Link>
                    </li>
                  )}
                  {navLinks.map((nl, index) => (
                    <li key={index}>
                      <Link href={nl.path}>{nl.label}</Link>
                    </li>
                  ))}
                  <li>
                    {userFullname ? (
                      <button onClick={handleClickLogout}>Keluar</button>
                    ) : (
                      <Link href="/login">Masuk</Link>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
