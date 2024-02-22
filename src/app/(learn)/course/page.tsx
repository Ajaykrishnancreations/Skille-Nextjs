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

        </div >
    );
}
