'use client'
import { useEffect, useState } from "react";
import React from "react";
import ViewCourseCreator from "components/viewcoursecreator/page";
import ViewCourseUser from "components/viewcourseuser/page";

export default function LearnPage() {
    const [userdata, setuserdata] = useState<any>();
    console.log(userdata,"userdata");
    

    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
    }, []);

    return (
        <div>
            {userdata?.role === "user" ? <ViewCourseUser/> : <ViewCourseCreator/>}
        </div>
    );
}