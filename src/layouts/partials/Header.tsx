"use client";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import config from "@/config/config.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
export interface IChildNavigationLink {
  name: string;
  url: string;
}

export interface INavigationLink {
  name: string;
  url: string;
  hasChildren?: boolean;
  children?: IChildNavigationLink[];
}

const Header = () => {
  const { navigation_button, settings } = config;
  const pathname = usePathname();
  const [userdata, setuserdata] = useState<any>();
  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    setuserdata(parsedUserData);
    window.scroll(0, 0);
  }, [pathname]);

  return (
    <header
      className={`header z-30 ${settings.sticky_header && "sticky top-0"}`}
    >
      <nav className="navbar container">
        <div className="order-0">
          <Logo />
        </div>
        <input id="nav-toggle" type="checkbox" className="hidden" />
        <label
          htmlFor="nav-toggle"
          className="order-3 cursor-pointer flex items-center lg:hidden text-dark dark:text-white lg:order-1"
        >
          <svg
            id="show-button"
            className="h-6 fill-current block"
            viewBox="0 0 20 20"
          >
            <title>Menu Open</title>
            <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
          </svg>
          <svg
            id="hide-button"
            className="h-6 fill-current hidden"
            viewBox="0 0 20 20"
          >
            <title>Menu Close</title>
            <polygon
              points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
              transform="rotate(45 10 10)"
            ></polygon>
          </svg>
        </label>
        <ul
          id="nav-menu"
          className="navbar-nav order-3 hidden w-full pb-6 lg:order-1 lg:flex lg:w-auto lg:space-x-2 lg:pb-0 xl:space-x-8"
        >
          <li className="nav-item">
            <Link href="/">
              <div className={`nav-link block ${pathname === "/" ? " text-black" : " text-light font-normal"}`}>
                Home
              </div>
            </Link>
          </li>
          {userdata?.login === "true" ?
            <li className="nav-item">
              <Link href="/about">
                <div className={`nav-link block ${pathname === "/about" ? " text-black" : " text-light font-normal"}`}>
                  Profile
                </div>
              </Link>
            </li>
            :
            null
          }

          {userdata?.role === "admin" ? null :
            <li className="nav-item">
              <Link href="/course">
                <div className={`nav-link block ${pathname === "/course" ? " text-black" : " text-light font-normal"}`}>
                  Learn
                </div>
              </Link>

            </li>
          }
          {userdata?.login === "true" ?
            <>
              {userdata?.role === "admin" ?
                null :
                <li className="nav-item">
                  <Link href="/mycourse">
                    <div className={`nav-link block ${pathname === "/mycourse" ? " text-black" : " text-light font-normal"}`}>
                      My Course
                    </div>
                  </Link>
                </li>
              }
            </>
            :
            null
          }
          {userdata?.login === "true" ?
            <>
              {userdata?.role === "user" ?
                null :
                <li className="nav-item">
                  <Link href="/creatorcourse">
                    <div className={`nav-link block ${pathname === "/creatorcourse" ? " text-black" : " text-light font-normal"}`}>
                      Create Course
                    </div>
                  </Link>
                </li>
              }
            </>
            :
            null
          }
          {userdata?.login === "true" && userdata?.role === "admin" && (
            <li className="nav-item">
              <Link href="/adminconsole">
                <div className={`nav-link block ${pathname === "/adminconsole" ? " text-black" : " text-light font-normal"}`}>
                  Admin Console
                </div>
              </Link>
            </li>
          )}
          {userdata?.login === "true" ?
            <>
              {userdata?.role === "user" ?
                null :
                <li className="nav-item">
                  <Link href="/studyhublist">
                    <div className={`nav-link block ${pathname === "/studyhublist" ? " text-black" : " text-light font-normal"}`}>
                      StudyHubList
                    </div>
                  </Link>
                </li>
              }
            </>
            :
            null
          }
        </ul>
        <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
          {/* {settings.search && (
            <button
              className="border-border text-dark hover:text-primary dark:border-darkmode-border mr-5 inline-block border-r pr-5 text-xl dark:text-white dark:hover:text-darkmode-primary"
              aria-label="search"
              data-search-trigger
            >
              <IoSearch />
            </button>
          )} */}
          <ThemeSwitcher className="mr-5" />
        </div>
      </nav>
    </header>
  );
};

export default Header;