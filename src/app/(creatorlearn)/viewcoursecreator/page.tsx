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
                        <h5><span><Link href="/mycourse">{"Back to Course < "}</Link></span>{CourseTitle}</h5>
                    </div>
                </div>
                <div className="grid grid-cols-5 mt-4">
                    {Array.isArray(CourseData) && CourseData.map((item: any) => {
                        if (item.published === "Published") {
                            const isChapterCompleted = userCompletionData?.courses.some((course: any) => {
                                return course.completed_chapters.includes(item.chapter_id);
                            });
                            return (
                                <div key={item.id}>
                                    <div className="p-5">
                                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div>
                                                {isChapterCompleted ?
                                                    <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "11%" }}>
                                                        <button
                                                            className={`border-4 rounded z-2 ${isChapterCompleted ? "bg-green-500 text-white" : "bg-white text-black"
                                                                }`}
                                                            style={{ width: "80px", fontSize: "12px",backgroundColor:"black" }}
                                                        >
                                                            Completed
                                                        </button>
                                                    </div> : null}
                                                <img className="rounded-t-lg" style={{ height: "150px", width: "100%" }} src={item?.image_url} alt="" />
                                            </div>
                                            <div className="p-4 h-50">
                                                <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.chapter_title}</p>
                                                <p className="mb-3 text-sm text-gray-700 dark:text-gray-400" style={{ height: "60px", overflow: "scroll" }}>{item?.chapter_description}</p>
                                                <div className="flex m-3">
                                                    <div className="w-5/6">
                                                        <p className="inline-flex items-center">
                                                            <svg style={{ width: "12px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                            </svg>
                                                            <span className="ml-2" style={{ fontSize: "12px" }} >{item?.tags}</span>
                                                        </p><br />
                                                    </div>
                                                </div>
                                                <div style={{ fontSize:12,borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px" }}>
                                                    <Link href="/viewchaptercreator"
                                                        onClick={() => localStorage.setItem("view_chapter_id", item?.chapter_id)}>
                                                        View this Chapter
                                                    </Link>
                                                </div>
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

