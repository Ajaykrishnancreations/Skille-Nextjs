'use client'
import { useState, useEffect } from "react";
import { UserAuth } from "@/context/AuthContext";
import SeoMeta from "@/partials/SeoMeta";
import Image from "next/image";
import { signIn } from 'next-auth/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "./firebase";
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Home = () => {
  const { data: session, status } = useSession();
  const data = UserAuth();
  const { user, googleSignIn } = data;
  const [userdata, setuserdata] = useState<any>();
  const [isPopOpen, setisPopOpen] = useState(false);
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
    signOut && signOut();
    localStorage.removeItem('userdata');
    window.open("http://localhost:3000/", "_self");
  };
  const handlePopToggle = () => {
    setisPopOpen(!isPopOpen);
  };
  const [register, setRegister] = useState(true);
  const Register = () => {
    setRegister((prev) => !prev);
  };
  const [emailid, setEmailid] = useState("");
  const [passwords, setPasswords] = useState("");
  const registerNewUser = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, emailid, passwords);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    signIn('credentials',
      { email, password, redirect: true, callbackUrl: '/' }
    )
  };
  useEffect(() => {
    if (localStorage.getItem("userdata")) {
      return;
    }
    if (status === "authenticated") {
      const data = {
        name:  session?.user?.email?.split('@')[0],
        email: session?.user?.email,
        profileurl: "https://lh3.googleusercontent.com/a/ACg8ocJ_Y5iKOOg5EGz69wWi6UymJjDwVblcw3YV-1tfFxUz=s96-c",
        login: "true"
      };
      localStorage.setItem("userdata", JSON.stringify(data));
      window.open("http://localhost:3000/", "_self");
      // redirect('/');
    }
  }, [session, status])
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
                <button onClick={handlePopToggle} className="btn btn-primary">
                  Login
                </button>
              }
              <>
                {isPopOpen && (
                  <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-900"></h3>
                        <button
                          onClick={handlePopToggle}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div>
                        <div className="flex flex-col justify-center items-center h-full gap-3">
                          <div>
                            {register === true ? (
                              <div className="shadow-lg p-5 rounded-lg border-t-4 border-gray-400">
                                <h1 className="text-xl font-bold my-4">Login</h1>
                                <form className="flex flex-col gap-3" onSubmit={login}>
                                  <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="text"
                                    placeholder="Email"
                                  />
                                  <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                  />
                                  <button className="bg-gray-600 text-white font-bold cursor-pointer px-6 py-2">
                                    Login
                                  </button>
                                  <a onClick={Register} className="text-sm mt-3 text-right">
                                    Don't have an account?{" "}
                                    <span className="underline cursor-pointer">Register</span>
                                  </a>
                                </form>
                              </div>
                            ) : (
                              <div className="shadow-lg p-5 rounded-lg border-t-4 border-gray-400">
                                <h1 className="text-xl font-bold my-4">Register</h1>
                                <form
                                  onSubmit={registerNewUser}
                                  className="flex flex-col gap-3"
                                >
                                  <input
                                    onChange={(e) => setEmailid(e.target.value)}
                                    type="text"
                                    placeholder="Email-id"
                                  />
                                  <input
                                    onChange={(e) => setPasswords(e.target.value)}
                                    type="password"
                                    placeholder="-Password"
                                  />
                                  <button className="bg-gray-600 text-white font-bold cursor-pointer px-6 py-2">
                                    Register
                                  </button>

                                  <p onClick={Register} className="text-sm mt-3 text-right">
                                    Already have an account?{" "}
                                    <span className="underline cursor-pointer">Login</span>
                                  </p>
                                </form>
                              </div>
                            )}
                          </div>
                          <p>{"(Or)"}</p>
                          <button
                            type="submit"
                            className="px-14 py-2 focus:outline-none text-white bg-gray-700 hover:bg-gray-500 rounded-lg"
                            onClick={handleFirebaseLogin}
                          >
                            Sign In with Google
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
