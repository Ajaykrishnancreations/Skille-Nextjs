'use client'
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LearnPage() {
    const [userdata, setuserdata] = useState<any>();
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
    }, []);
    return (
        <div>
            {userdata?.login === "true" ?
                <div className="p-10">
                    <h2>Start learning with programming.</h2>
                    <div className="grid grid-cols-3 mt-4">
                        <div>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <a href="#">
                                        <img className="rounded-t-lg" style={{ height: "200px" }} src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20200114192751/How-to-Learn-Programming.png" alt="" />
                                    </a>
                                    <div className="p-5 h-50">
                                        <a href="#">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Start learning with a focus on front-end technologies.</h5>
                                        </a>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Front-end technologies refer to the tools and languages used to create the visual and interactive components of a website. Key elements include HTML for structure, CSS for styling, and JavaScript for interactivity. Frameworks like React and Angular enhance development efficiency, enabling dynamic..</p>
                                        <Link href="/course" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            view
                                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <section className="section pt-14 mb-10">
                    <div className="container">
                        <div className="row justify-center">
                            <div className="mt-10 mb-16 text-center lg:col-7">
                                <center>
                                </center>
                                <h1
                                    className="mb-4 mt-2"
                                >{"Hey :) User, you won't be able to access the courses without logging in"}</h1>
                                <Link href="/" className="btn btn-primary">
                                    Click to log in
                                </Link>

                            </div>
                        </div>
                    </div>
                </section>
            }
        </div>
    );
}