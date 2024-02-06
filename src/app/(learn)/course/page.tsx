'use client'
import { useEffect, useState } from "react";
import UserCourse from "components/usercourse/page";
import CreatorCourse from "components/creatorcourse/page";
export default function LearnPage() {
    const [UserData, setUserData] = useState<any>("");
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setUserData(parsedUserData);
    }, []);

    return (
        <div>
            {UserData?.role === "user" ? <UserCourse /> : <CreatorCourse/>}
        </div >
    );
}
