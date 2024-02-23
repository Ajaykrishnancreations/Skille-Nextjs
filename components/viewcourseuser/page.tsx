'use client'
import { useEffect, useState } from "react";
import { getCourseWithCourseid, getUserDetailsByUID } from "@/api/Api";
import React from "react";
import Link from "next/link";

export default function ViewCourseUser() {
    const [CourseData, setCourseData] = useState<any>({});
    const [CourseTitle, setCourseTitle] = useState<string>();
    const [userCompletionData, setUserCompletionData] = useState<any>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        const course_id: any = localStorage.getItem("view_course_id");
        getUserDetailsByUID(parsedUserData?.uid)
            .then((userDetails: any) => {
                setUserCompletionData(userDetails);
                console.log(userDetails, "userDetailsuserDetailsuserDetails");
            });
        getCourseWithCourseid(course_id)
            .then((CourseData: any) => {
                if (CourseData) {
                    setCourseData(CourseData?.chapters);
                    setCourseTitle(CourseData?.title);
                } else {
                    console.log("CourseData not found");
                }
            })
    }, []);

    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h3><span><Link href="/mycourse">{"Back to Course < "}</Link></span>{CourseTitle}</h3>
                    </div>
                </div>
                <div className="grid grid-cols-3 mt-4">
                    {Array.isArray(CourseData) && CourseData.map((item: any) => {
                        if (item.published === "Published") {
                            const isChapterCompleted = userCompletionData?.courses.some((course: any) => {
                                return course.completed_chapters.includes(item.chapter_id);
                            });
                            return (
                                <div key={item.id}>
                                    <div className="p-5">
                                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                            <div className="p-5">
                                                {isChapterCompleted ?
                                                    <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "13%" }}>
                                                        <button
                                                            className={`border-4 rounded z-2 ${isChapterCompleted ? "bg-green-500 text-white" : "bg-white text-black"
                                                                }`}
                                                            style={{ width: "100px" }}
                                                        >
                                                            Completed
                                                        </button>
                                                    </div> : null}
                                                <img className="rounded-t-lg" style={{ height: "200px", width: "100%" }} src={item?.image_url} alt="" />
                                            </div>
                                            <div className="p-5 h-50">
                                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.chapter_title}</h5>
                                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item?.chapter_description}</p>
                                                <div className="flex m-3">
                                                    <div className="w-5/6">
                                                        <p className="inline-flex items-center">
                                                            <svg style={{ width: "15px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                            </svg>
                                                            <span className="ml-2">{item?.tags}</span>
                                                        </p><br />
                                                    </div>
                                                </div>
                                                <Link href="/viewchapter"
                                                onClick={() => localStorage.setItem("view_chapter_id", item?.chapter_id)}
                                                
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                    View this Chapter
                                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            );
                        } else {
                            return null;
                        }
                    }
                    )}
                </div>
            </div>
        </div >
    );
}

