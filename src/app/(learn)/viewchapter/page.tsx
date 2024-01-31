'use client'
import { useEffect, useState } from "react";
import { getCourseChapterData } from "@/api/Api";
import React from "react";

export default function LearnPage() {
    const [CourseChapterData, setCourseChapterData] = useState<any>();
    useEffect(() => {
        const course_id: any = localStorage.getItem("view_chapter_id");
        getCourseChapterData(course_id)
            .then((CourseChapterData: any) => {
                if (CourseChapterData) {
                    setCourseChapterData(CourseChapterData)
                } else {
                    console.log("getCourseChapterData not found");
                }
            })
    }, []);


    return (
        <div>
            <div className="p-10">
                <h3>{CourseChapterData?.title}</h3>
                <p>{CourseChapterData?.content}</p>
            </div>
        </div>
    );
}