"use client"
import React, { useEffect, useState } from 'react';
import AddNewUser from 'components/(admin)/addnewuser/page';
import Link from 'next/link';

const User = () => {
    const [UserData, setUserData] = useState<any>();
    const [value, setvalue] = useState<boolean>(true);
    useEffect(() => {
        setvalue(true)
        const fetchUserData = async () => {
            try {
                const storedUserData = localStorage.getItem("userdata");
                const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
                setUserData(parsedUserData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
        setvalue(false)
    }, []);

    return (
        <>
            {value === true ?
                <>
                    <center style={{ marginTop: "15%", marginBottom: "15%" }}>
                        <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"></div>
                    </center>
                </>
                :
                <>
                    {UserData?.login === "true" ?
                        <>
                            {UserData?.role === "user" && "creator" ? <section className="section-sm text-center">
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
                            </section> : <AddNewUser />
                            }
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
                </>
            }
        </>
    );
};

export default User;
