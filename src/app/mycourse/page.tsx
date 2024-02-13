"use client";
import React, { useState, useEffect } from "react";
import { getUserDetailsByUID, getCoursesWithCourseIds } from "@/api/Api";
import Link from "next/link";

const About = () => {
    const [CourseData, setCourseData] = useState<any[]>([]);
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        getUserDetailsByUID(parsedUserData?.uid)
            .then((userDetails: any) => {
                if (userDetails) {
                    const courseIds: string[] = userDetails?.courses.map((course: any) => course.course_id);
                    fetchData(courseIds);
                } else {
                    console.log("User not found");
                }
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }, []);
    const fetchData = async (courseIds: string[]) => {
        if (courseIds && courseIds.length > 0) {
            const data: any = await getCoursesWithCourseIds(courseIds);
            setCourseData(data);
        }
    };
    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h2>My Course</h2>
                    </div>
                </div>
                <div className="grid grid-cols-3 mt-4">
                    {CourseData.map((item: any) => (
                        <div key={item.id}>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <div className="p-5">
                                        <img className="rounded-t-lg" style={{ height: "200px" }} src={item?.imgUrl} alt="" />
                                    </div>
                                    <div className="p-5 h-50">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item?.summary}</p>
                                        <div className="flex m-3">
                                            <div className="w-3/6">
                                                <p className="inline-flex items-center">
                                                    <svg style={{ width: "15px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                        <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                    </svg>
                                                    <span className="ml-2">{item?.author?.user_name}</span>
                                                </p>
                                            </div>
                                            <div className="w-3/6">
                                                <p className="inline-flex items-center">
                                                    <svg style={{ width: "15px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
                                                    </svg>
                                                    <span className="ml-2">{item?.level}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div>Skill : {item?.skills}</div>
                                        <Link href="/viewcourse" onClick={() => localStorage.setItem("view_course_id", item?.course_id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center mt-3 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            View
                                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default About;