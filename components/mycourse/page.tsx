"use client";
import React, { useState, useEffect } from "react";
import { getUserDetailsByUID, getCoursesWithCourseIds } from "@/api/Api";
import Link from "next/link";

const MyCourse = () => {
    const [CourseData, setCourseData] = useState<any[]>([]);
    const [userCompletionData, setUserCompletionData] = useState<any>(null);
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        getUserDetailsByUID(parsedUserData?.uid)
            .then((userDetails: any) => {
                setUserCompletionData(userDetails);
            })
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
                        <h5>My Course</h5>
                    </div>
                </div>
                <div className="grid grid-cols-5 mt-4">
                    {CourseData.map((item: any) => {
                        const courseCompletionData = userCompletionData?.courses.find((course: any) => course.course_id === item.course_id);
                        return (
                            <div key={item.id}>
                                <div className="p-5">
                                    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                        <div>
                                            <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "8%" }}>
                                                <button
                                                    className="border-4 rounded z-2  bg-white"
                                                    style={{ width: "120px",fontSize:"12px" }}
                                                >
                                                    Status:
                                                    <b
                                                        className={`${courseCompletionData?.completion_status ? "text-green-500 " : courseCompletionData?.progress < 50 ? "text-red-500" : courseCompletionData?.progress < 100 ? "text-orange-500 " : "bg-gray-300 text-black"}`}
                                                    >
                                                        {courseCompletionData?.completion_status ? " Completed" : ` ${Math.floor(courseCompletionData?.progress)}%`}
                                                    </b>
                                                </button>
                                            </div>
                                            <img className="rounded-t-lg" style={{ height: "150px", width: "100%" }} src={item?.imgUrl} alt="" />
                                        </div>
                                        <div className="p-5 h-50">
                                            <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</p>
                                            <p style={{ height: "60px", overflow: "scroll" }} className="mb-3 text-sm text-gray-700 dark:text-gray-400">{item?.summary}</p>
                                            <div className="flex m-3">
                                                <div className="w-3/6">
                                                    <p className="inline-flex items-center">
                                                        <svg style={{ width: "12px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                            <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                        </svg>
                                                        <span className="ml-2" style={{ fontSize: 12 }}>{item?.author?.user_name}</span>
                                                    </p>
                                                </div>
                                                <div className="w-3/6">
                                                    <p className="inline-flex items-center">
                                                        <svg style={{ width: "12px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
                                                        </svg>
                                                        <span className="ml-2" style={{ fontSize: 12 }}>{item?.level}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: 14 }}> <b>Skills : {Array.isArray(item?.skills) && item.skills.map((skill: any, index: any) => (
                                                <span key={index}>
                                                    {skill}{index < item.skills.length - 1 && ', '}
                                                </span>
                                            ))}</b></div>
                                            <div style={{ fontSize: 12, borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px" }}>
                                                <Link 
                                                href={{
                                                    pathname:'/viewcourse',
                                                    query:  {course_id:item?.course_id}
                                                }}
                                                    onClick={() => {
                                                        localStorage.setItem("view_course_id", item?.course_id)
                                                        localStorage.setItem("selectedCourseTitle", item?.title)
                                                    }}>
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div >
    );
};

export default MyCourse;