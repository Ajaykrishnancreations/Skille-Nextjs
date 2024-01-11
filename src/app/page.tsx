'use client'
import { useState, useEffect } from "react";
import { UserAuth } from "@/context/AuthContext";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
const Home = () => {
  const data = UserAuth();
  const { user, googleSignIn } = data;
  const [userdata, setuserdata] = useState<any>();
  const { logOut } = data;
  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    setuserdata(parsedUserData);
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    };
    checkAuth();
  }, [user]);
  const handleFirebaseLogin = () => {
    googleSignIn && googleSignIn();
  };
  const handleSignOut = async () => {
    logOut && logOut();
    localStorage.removeItem('userdata');
    window.open("http://localhost:3000/", "_self");
  };
  return (
    <>
      <SeoMeta />
      <section className="section pt-14 mb-10">
        <div className="container">
          <div className="row justify-center">
            <div className="mt-10 mb-16 text-center lg:col-7">
              <center>
                {userdata?.login === "true" ?
                  <Image
                    src={userdata?.profileurl}
                    width={100}
                    height={100}
                    alt="Profile Photo"
                    className="rounded-full w-25"
                  /> : ""
                }              </center>
              {userdata?.login === "true" ?
                <h1
                  className="mb-4 mt-2"
                >{"Hey :) "}{userdata?.name}</h1>
                :
                <h1
                  className="mb-4 mt-2"
                >{"learn . build . get-hired"}</h1>
              }
              <p
                className="mb-8"
              >Build projects, gain skill certificates, become a master and get hired.</p>
              {userdata?.login === "true" ?
                <button onClick={handleSignOut} className="btn btn-primary">
                  SignOut
                </button>
                :
                <button onClick={handleFirebaseLogin} className="btn btn-primary">
                  Login
                </button>
              }
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
