"use client";
import Logo from "@/components/Logo";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import config from "@/config/config.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5/index.js";
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
              <div className={`nav-link block ${pathname === "/" && "active"}`}>
                Home
              </div>
            </Link>
          </li>
          {userdata?.login === "true" ?
            <li className="nav-item">
              <Link href="/about">
                <div className={`nav-link block ${pathname === "/about" && "active"}`}>
                  Profile
                </div>
              </Link>
            </li>
            :
            ""
          }
          <li className="nav-item">
            <Link href="/learn">
              <div className={`nav-link block ${pathname === "/learn" && "active"}`}>
                {userdata?.role==="creator"?"Add Coures":"Learn"}
              </div>
            </Link>
          </li>
          {/* <li className="nav-item">
            <Link href="/elements">
              <div className={`nav-link block ${pathname === "/elements" && "active"}`}>
                Elements
              </div>
            </Link>
          </li> */}
          {/* <li className="nav-item nav-dropdown group relative">
            <span className={`nav-link inline-flex items-center ${pathname.includes("/pages") && "active"}`}>
              Pages
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </span>
            <ul className="nav-dropdown-list hidden lg:invisible lg:absolute lg:block lg:opacity-0">
              <li className="nav-dropdown-item">
                <Link href="/contact">
                  <div className={`nav-dropdown-link block ${pathname === "/contact" && "active"}`}>
                    Contact
                  </div>
                </Link>
              </li>
              <li className="nav-dropdown-item">
                <Link href="/blog">
                  <div className={`nav-dropdown-link block ${pathname === "/blog" && "active"}`}>
                    Blog
                  </div>
                </Link>
              </li>
              <li className="nav-dropdown-item">
                <Link href="/authors">
                  <div className={`nav-dropdown-link block ${pathname === "/authors" && "active"}`}>
                    Authors
                  </div>
                </Link>
              </li>
              <li className="nav-dropdown-item">
                <Link href="/categories">
                  <div className={`nav-dropdown-link block ${pathname === "/categories" && "active"}`}>
                    Categories
                  </div>
                </Link>
              </li>
              <li className="nav-dropdown-item">
                <Link href="/tags">
                  <div className={`nav-dropdown-link block ${pathname === "/tags" && "active"}`}>
                    Tags
                  </div>
                </Link>
              </li>
              <li className="nav-dropdown-item">
                <Link href="/404">
                  <div className={`nav-dropdown-link block ${pathname === "/404" && "active"}`}>
                    404 Page
                  </div>
                </Link>
              </li>
            </ul>
          </li> */}
        </ul>
        <div className="order-1 ml-auto flex items-center md:order-2 lg:ml-0">
          {settings.search && (
            <button
              className="border-border text-dark hover:text-primary dark:border-darkmode-border mr-5 inline-block border-r pr-5 text-xl dark:text-white dark:hover:text-darkmode-primary"
              aria-label="search"
              data-search-trigger
            >
              <IoSearch />
            </button>
          )}
          <ThemeSwitcher className="mr-5" />
          {navigation_button.enable && (
            <Link href={navigation_button.link}>
              <div className="btn btn-outline-primary btn-sm hidden lg:inline-block">
                {navigation_button.label}
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;