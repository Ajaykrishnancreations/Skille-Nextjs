"use client";
import React, { useState, useEffect } from "react";
import { getUserDetailsByUID } from "@/api/Api";

const About = () => {
    const [userdata, setuserdata] = useState<any>();
    const [UserDetail, setUserDetail] = useState<any>();
    const [Value, setValue] = useState<boolean>(false);
    const [isPopOpen, setisPopOpen] = useState(false);

    const handlePopToggle = () => {
        setisPopOpen(!isPopOpen);
    };
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        getUserDetailsByUID(parsedUserData?.uid)
            .then((userDetails) => {
                if (userDetails) {
                    setUserDetail(userDetails)
                    setValue(false)
                } else {
                    console.log("User not found");
                }
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }, [Value]);


    return (
        <>
            <section className="section-sm">
                <div className="container">
                    <div className="row justify-center">
                        <div className="text-center md:col-10 lg:col-7">
                            {UserDetail?.imgUrl ?
                                <div className="relative mt-3 mb-5">
                                    <center>
                                        <div className="relative w-24 h-24">
                                            <img className="rounded-full border border-gray-100 shadow-sm"
                                                src={UserDetail?.imgUrl}
                                                alt="user image" />
                                            <div onClick={handlePopToggle} className="absolute top-0 right-0 h-6 w-6 my-1 border-4 border-white rounded-full bg-gray-300 z-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{ height: "12px", width: "12", padding: "1px", marginTop: "3px" }}>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                </svg>
                                            </div>
                                        </div>
                                    </center>
                                </div>
                                : ""}

                            {UserDetail?.name ?
                                <h2
                                    className="h3 mb-6"
                                >Hey, I am {UserDetail?.name}!</h2> : ""}
                        </div>
                    </div>
                </div >
            </section >
        </>
    );
};

export default About;
