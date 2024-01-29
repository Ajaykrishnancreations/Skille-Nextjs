'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCourseChapterData } from "@/api/Api";

export default function LearnPage() {
    const [userdata, setuserdata] = useState<any>();
    const [CourseChapterData, setCourseChapterData] = useState<any>();
    console.log(CourseChapterData, "CourseChapterDatasssss");

    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        const course_id = localStorage.getItem("view_course_id");
        getCourseChapterData(course_id)
            .then((CourseChapterData: any) => {
                if (CourseChapterData) {
                    console.log("getCourseChapterData:", CourseChapterData);
                    setCourseChapterData(CourseChapterData)
                } else {
                    console.log("getCourseChapterData not found");
                }
            })
    }, []);
    return (
        <div>
            <div className="p-10">
                <h2>{CourseChapterData?.course_title}</h2>
                <div>
                    {CourseChapterData?.chapters.map((item: any) => (
                        <div key={item.id} className="mt-3 mb-3">
                            <h5>{item?.chapterTitle}</h5>
                            <p  className="mt-3">{item?.chapterSummary}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}