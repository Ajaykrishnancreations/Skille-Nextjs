'use client'
import { useEffect, useState } from "react";
import { getCourseChapterData, addCourseChapterData, getCourseWithCourseid, updateCourseChapters } from "@/api/Api";
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import Link from "next/link";

export default function LearnPage() {
    const chapter_id = uuidv4();
    const [userdata, setuserdata] = useState<any>();
    const [CourseData, setCourseData] = useState<any>({});
    const [Course_id, setCourse_id] = useState<any>();
    const [CourseTitle, setCourseTitle] = useState<string>();
    const [Value, setValue] = useState<boolean>(false);
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        const course_id: any = localStorage.getItem("view_course_id");
        setCourse_id(localStorage.getItem("view_course_id"))
        getCourseWithCourseid(course_id)
            .then((CourseData: any) => {
                if (CourseData) {
                    setCourseData(CourseData?.chapters)
                    setCourseTitle(CourseData?.title)
                } else {
                    console.log("CourseData not found");
                }
            })
            setValue(false);
        }, [Value]);
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        description: '',
        content: '',
        tags: '',
        next_chapter: '',
        previous_chapter: '',
        chapter_id: chapter_id,
    });
    const { title, image_url, description, content, tags, next_chapter, previous_chapter } = formData;
    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const addCourseChapters = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        addCourseChapterData(chapter_id, description, image_url, title, content, tags, next_chapter, previous_chapter).then((added) => {
            if (added) {
                alert("CourseChapters added");
                const newChapterData = {
                    chapter_id: chapter_id,
                    chapter_title: title,
                    chapter_description: description,
                    image_url: image_url,
                    tags: tags,
                    published: true
                }
                updateCourseChapters(Course_id, newChapterData).then((updated) => {
                    if (updated) {
                        alert("Course updated");
                        setValue(true);
                        setIsModalOpen(false);
                    } else {
                        alert("Failed to update course");
                    }
                });
            }
        });
    };
    const [isModalOpen1, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h3>{CourseTitle}</h3>
                    </div>
                    <div className="w-1/6">
                        <button onClick={openModal}>Add Chapter</button>
                    </div>
                </div>
                <div className="grid grid-cols-3 mt-4">
                    {Array.isArray(CourseData) && CourseData.map((item: any) =>
                        <div key={item.id}>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <div className="p-5">
                                        <img className="rounded-t-lg" style={{ height: "200px",width:"100%" }} src={item?.image_url} alt="" />
                                    </div>
                                    <div className="p-5 h-50">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.chapter_title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item?.chapter_description}</p>
                                        <div className="flex m-3">
                                            <div className="w-5/6">
                                                <p className="inline-flex items-center">
                                                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                        <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                    </svg>
                                                    <span className="ml-2">{item?.tags}</span>
                                                </p><br />
                                            </div>
                                        </div>
                                        <Link href="/viewchapter" onClick={() => localStorage.setItem("view_chapter_id", item?.chapter_id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            View this Chapter
                                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {
                    isModalOpen1 && (
                        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                <button onClick={closeModal}>close</button>
                                <form className="max-w-sm mx-auto" onSubmit={addCourseChapters}>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                            Enter Chapter Title:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="title"
                                            value={title}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Title"
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                            Enter Chapter ImgUrl:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="image_url"
                                            value={image_url}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter ImgUrl"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                            Enter Chapter Description:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="description"
                                            value={description}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Description"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                                            Enter Chapter Content:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="content"
                                            value={content}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Content"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                                            Enter Chapter Skills:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="tags"
                                            value={tags}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Skills"
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        className="rounded ml-2 pl-5 pr-5 bg-slate-600 p-2 text-white"
                                        value="Submit"
                                    />
                                </form>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}