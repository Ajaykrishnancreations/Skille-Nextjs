'use client'
import { useEffect, useState } from "react";
import { getCourseChapterData, updateCourseChapterData } from "@/api/Api";
import React from "react";
import Stackedit from 'stackedit-js';
import ReactMarkdown from 'react-markdown';

export default function LearnPage() {
    const stackedit = new Stackedit();
    const [userdata, setuserdata] = useState<any>();
    const [CourseChapterData, setCourseChapterData] = useState<any>();
    const [value, setvalue] = useState<boolean>(true)
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
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
    const openStackEdit = () => {
        stackedit.openFile({
            content: {
                text: CourseChapterData?.content, // Initialize text to empty string
            },
            name: 'MyFile.md',
            isTemporary: true,
        });
    };
    stackedit.on('fileChange', (file: { content: { text: any; }; }) => {
        const newText = file.content.text;
        const chapter_id = localStorage.getItem("view_chapter_id");
        const updatedData = { content: newText ? newText : CourseChapterData?.content };
        updateCourseChapterData(chapter_id, updatedData);
        setvalue(true)
    })
    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h3>{CourseChapterData?.title}</h3>
                    </div>
                    {userdata?.role === "creator" && (
                        <div className="w-1/6">
                            <button onClick={openStackEdit}>Update Chapter</button>
                        </div>
                    )}
                </div>
                <div>
                <ReactMarkdown children={CourseChapterData?.content} />
                </div>
            </div>
        </div>
    );
}