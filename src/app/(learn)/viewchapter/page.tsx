'use client'
import { useEffect, useState } from "react";
import { getCourseChapterData, updateCourseChapterData } from "@/api/Api";
import React from "react";

export default function LearnPage() {
    const [CourseChapterData, setCourseChapterData] = useState<any>();
    const [value, setvalue] = useState<boolean>(true)
    useEffect(() => {
        const course_id: any = localStorage.getItem("view_chapter_id");
        getCourseChapterData(course_id)
            .then((CourseChapterData: any) => {
                if (CourseChapterData) {
                    setCourseChapterData(CourseChapterData)
                    setvalue(false)
                } else {
                    console.log("getCourseChapterData not found");
                }
            })

    }, [value]);
    const [isModalOpen1, setIsModalOpen] = useState(false);
    const [chapterData, setchapterData] = useState<any>();
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const updateChapter = () => {
        const chapter_id = localStorage.getItem("view_chapter_id");
        const updatedData = { content: chapterData ? chapterData : CourseChapterData?.content };
        updateCourseChapterData(chapter_id, updatedData);
        setvalue(true)
        closeModal()
    }
    return (
        <div>
            <div className="p-10">

                <div className="flex">
                    <div className="w-5/6">
                        <h3>{CourseChapterData?.title}</h3>
                    </div>
                    <div className="w-1/6">
                        <button onClick={openModal}>Update Chapter</button>
                    </div>
                </div>

                <p>{CourseChapterData?.content}</p>

                {
                    isModalOpen1 && (
                        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Terms of Service
                                        </h3>
                                        <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                    <div className="mb-5">

                                        <div className="ml-2 mr-2 text-gray-600">
                                            Enter Chapter Summary :
                                            <textarea
                                                className="rounded w-full"
                                                defaultValue={CourseChapterData?.content}
                                                onChange={(e) => setchapterData(e.target.value)}
                                                placeholder="Summary"
                                                rows={4}
                                                cols={50}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button onClick={updateChapter} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                        <button onClick={closeModal} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}