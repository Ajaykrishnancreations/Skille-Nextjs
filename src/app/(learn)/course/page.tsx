'use client'
import { useEffect, useState } from "react";
import UserCourse from "components/usercourse/page";
import CreatorCourse from "components/creatorcourse/page";
import Link from "next/link";
export default function LearnPage() {
    const [UserData, setUserData] = useState<any>("");
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setUserData(parsedUserData);
    }, []);

    return (
        <div>
            {UserData?.login === "true" ?
                <>
                    {UserData?.role === "user" ? <UserCourse /> : <CreatorCourse />}
                </>
                :
                <section className="section-sm text-center">
                    <div className="container">
                        <div className="row justify-center">
                            <div className="sm:col-10 md:col-8 lg:col-6">
                                <span className="text-[8rem] block font-bold text-dark dark:text-darkmode-dark">
                                    404
                                </span>
                                <h1 className="h2 mb-4">Page not found</h1>
                                <div className="content">
                                    <p>
                                        The page you are looking for might have been removed, had its
                                        name changed, or is temporarily unavailable.
                                    </p>
                                </div>
                                <Link href="/" className="btn btn-primary mt-8">
                                    Back to home
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            }

        </div >
    );
}
