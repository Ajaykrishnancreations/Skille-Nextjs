"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from 'uuid';
import { addCourseFirestore } from "@/api/Api";

export default function CreateNewCourse() {
    const [data, setData] = useState<any>()
    const courseId = uuidv4();
    const [formData, setFormData] = useState({
        title: '',
        imgUrl: '',
        summary: '',
        level: '',
        skills: [''],
        newprice: '',
        oldprice: '',
        course_id: courseId,
    });
    useEffect(() => {
        const storedUserData: any = localStorage.getItem("userdata");
        const parsedUserData = JSON.parse(storedUserData);
        setData(parsedUserData)
    }, [])
    const { title, imgUrl, summary, level, skills, newprice, oldprice, course_id } = formData;

    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const handleSkillChange = (e: { target: { value: string; }; }, index: any) => {
        const newSkills = [...skills];
        newSkills[index] = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            skills: newSkills,
        }));
    };

    const addSkill = () => {
        setFormData(prevFormData => ({
            ...prevFormData,
            skills: [...prevFormData.skills, ''],
        }));
    };

    const removeSkill = (index: number) => {
        const newSkills = [...skills];
        newSkills.splice(index, 1);
        setFormData(prevFormData => ({
            ...prevFormData,
            skills: newSkills,
        }));
    };
    const addData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        addCourseFirestore(title, imgUrl, summary, course_id, level, skills, newprice, oldprice).then((added) => {
            if (added) {
                alert("Data added");
                const data = {
                    course_id: course_id,
                    course_title: title,
                };
                localStorage.setItem("newCourseData", JSON.stringify(data));
            }
        });
    };
    return (
        <div>
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add a New Course
                </h3>
                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <form className="max-w-lg mx-auto" style={{ padding: "10px" }} onSubmit={addData}>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                        Enter Course Title:
                    </label>
                    <input
                        type="text"
                        className="rounded ml-2 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="title"
                        value={title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                    />
                </div>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                        Enter Course ImgUrl:
                    </label>
                    <input
                        type="text"
                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="imgUrl"
                        value={imgUrl}
                        onChange={handleChange}
                        placeholder="ImgUrl"
                    />
                </div>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                        Enter Course Summary:
                    </label>
                    <input
                        type="text"
                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="summary"
                        value={summary}
                        onChange={handleChange}
                        placeholder="Summary"
                    />
                    {/* <textarea
                        name="summary"
                        value={summary}
                        onChange={handleChange}
                        rows="4"
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Summary..."
                    /> */}
                </div>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                        Enter Course Level:
                    </label>
                    <input
                        type="text"
                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="level"
                        value={level}
                        onChange={handleChange}
                        placeholder="Level"
                    />
                </div>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                        Enter Course Skills:
                    </label>
                    {skills.map((skill, index) => (
                        <div key={index} className="mb-5">
                            <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                Enter Skill {index + 1}:
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={skill}
                                    onChange={(e) => handleSkillChange(e, index)}
                                    placeholder="Skill"
                                />
                                <button type="button" onClick={() => removeSkill(index)}>Remove</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addSkill}>Add Skill</button>
                </div>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                        Enter Course New Price:
                    </label>
                    <input
                        type="text"
                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="newprice"
                        value={newprice}
                        onChange={handleChange}
                        placeholder="New Price"
                    />
                </div>
                <div className="mb-5">
                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                        Enter Course Old Price:
                    </label>
                    <input
                        type="text"
                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="oldprice"
                        value={oldprice}
                        onChange={handleChange}
                        placeholder="Old Price"
                    />
                </div>
                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                    <button type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                </div>
            </form>
        </div>
    );
}

