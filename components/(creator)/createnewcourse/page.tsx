"use client"
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { addCourseFirestore } from "@/api/Api";
import Stackedit from 'stackedit-js';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}
const isEqual = (array1: any[], array2: any[]): boolean => {
    return (
        array1.length === array2.length &&
        array1.every((value, index) => value === array2[index])
    );
};
export default function CreateNewCourse() {
    const stackedit = new Stackedit();
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
    const { title, imgUrl, summary, level, skills, newprice, oldprice, course_id } = formData;
    const handleChange = (e: { target: { name: any; value: any; type?: any; checked?: any; }; }) => {
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
    const [step, setStep] = useState(1);
    const [newText, setnewText] = useState<any>("")
    const handleNextStep = () => {
        setStep(step + 1);
    };
    const preNextStep = () => {
        setStep(step - 1);
    };
    const [titles, setTitles] = useState<string[]>([]);

    const openStackEdit = () => {
        stackedit.openFile({
            content: {
                text: "add a text here"
            },
            name: 'MyFile',
            isTemporary: true,
        });
    };
    stackedit.on('fileChange', (file: { content: { text: any; }; }) => {
        const newText = file.content.text;
        setnewText(newText)
    });
    const addData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("Add Data Function Called");
        addCourseFirestore(title, imgUrl, summary, course_id, level, skills, newprice, oldprice, newText)
            .then((added) => {
                if (added) {
                    alert("Data added");
                }
            });
    };
    const components: any = {
        code: ({ node, inline, className, children, ...props }: CodeProps) => {
            const customStyle = {
                backgroundColor: '#e7e7e7',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
            };
            const syntaxHighlighterStyle = solarizedlight;
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
                return (
                    <SyntaxHighlighter
                        style={syntaxHighlighterStyle}
                        language={match[1]}
                        PreTag="div"
                        children={String(children).replace(/\n$/, '')}
                        {...props}
                        customStyle={customStyle}
                    />
                );
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        h1: ({ children }: { children: React.ReactNode }) => {
            return (
                <h1 className={`mt-2 mb-2`}>
                    {children}
                    <hr></hr>
                </h1>
            );
        },
        h2: ({ children }: { children: React.ReactNode }) => {
            return (
                <h2 className={`mt-5 `}>
                    {children}
                </h2>
            );
        },
        h3: ({ children }: { children: React.ReactNode }) => {
            return (
                <h3 className={`mt-5`}>
                    {children}
                </h3>
            );
        },
        strong: ({ children }: { children: React.ReactNode }) => (
            <div className={`mt-5`}>
                <strong>{children}</strong>
            </div>
        ),
        p: ({ children }: { children: React.ReactNode }) => (
            <div className={`mt-5`}>
                <p>{children}</p>
            </div>
        ),

    };
    const renderModalContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <div style={{ height: "50vh" }}>
                            <h5 className="p-2 mt-4">Enter Summary</h5>
                            <div className="mb-5 mt-2">
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
                                <textarea
                                    // type="text"
                                    className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="summary"
                                    rows={6}
                                    value={summary}
                                    onChange={handleChange}
                                    placeholder="Summary"
                                />
                            </div>
                        </div>

                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={handleNextStep}
                        >
                            Next
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div style={{ height: "50vh" }}>
                            <h5 className="p-2 mt-4">Enter Skills and Course Leve</h5>
                            <div className="mb-5">
                                <label className="ml-2 mt-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
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
                                            Skill {index + 1}:
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
                                <button
                                    style={{ fontSize: 14, width: "100px", borderRadius: "5px", backgroundColor: "#cacaca", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                                    onClick={addSkill}>Add Skill</button>
                            </div>
                        </div>
                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={preNextStep}
                        >
                            Previous
                        </button>
                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={handleNextStep}
                        >
                            Next
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <div style={{ height: "50vh" }}>
                            <h5 className="p-2 mt-4">Enter your Course brief here:</h5>
                            <div className="mb-5 mt-2">
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
                        </div>
                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={preNextStep}
                        >
                            Previous
                        </button>
                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={handleNextStep}
                        >
                            Next
                        </button>
                    </div>
                );
            default:
                return (
                    <div>
                        <div style={{ height: "50vh" }}>
                            <h5 className="p-2 mt-4">Add Course Markdown</h5>
                            <div className="p-2 w-1/6">
                                <button onClick={openStackEdit}>Add Markdown</button>
                            </div>
                            <div className='flex flex-row'>
                                <div className='basis-10/12'>
                                    <div className={`p-2 rounded border-1 border-gray-200`}>
                                        <ReactMarkdown components={components} children={newText} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={preNextStep}
                        >
                            Previous
                        </button>
                        <button
                            style={{ fontSize: 14, width: "200px", borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}
                            onClick={addData}
                        >
                            Submit
                        </button>
                    </div>
                );
        }
    };
    return (
        <div className="p-10" style={{ marginLeft: "15%", marginRight: "15%" }}>
            <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                <li className="flex items-center mr-4" style={{ cursor: "pointer" }} onClick={() => setStep(1)}>
                    <span className="flex mr-1 items-center justify-center w-5 h-7 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400" style={{ padding: 4, borderRadius: "50%", width: "26px", background: `${step === 1 ? "gray" : step > 1 ? "green" : ""}`, color: `${step === 1 ? "white" : step > 1 ? "white" : "gray"}` }}>
                        1
                    </span>
                    Summary
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                    </svg>
                </li>
                <li className="flex items-center mr-4" style={{ cursor: "pointer" }} onClick={() => setStep(2)}>
                    <span className="flex mr-1 items-center justify-center w-5 h-7 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400" style={{ padding: 4, borderRadius: "50%", width: "26px", background: `${step === 2 ? "gray" : step > 2 ? "green" : ""}`, color: `${step === 2 ? "white" : step > 2 ? "white" : "gray"}` }}>
                        2
                    </span>
                    Skills
                    <svg className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                    </svg>
                </li>
                <li className="flex items-center mr-4" style={{ cursor: "pointer" }} onClick={() => setStep(3)}>
                    <span className="flex mr-1 items-center justify-center w-5 h-7 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400" style={{ padding: 4, borderRadius: "50%", width: "26px", background: `${step === 3 ? "gray" : step > 3 ? "green" : ""}`, color: `${step === 3 ? "white" : step > 3 ? "white" : "gray"}` }}>
                        3
                    </span>
                    Price
                </li>
                <li className="flex items-center mr-4" style={{ cursor: "pointer" }} onClick={() => setStep(4)}>
                    <span className="flex mr-1 items-center justify-center w-5 h-7 me-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400" style={{ padding: 4, borderRadius: "50%", width: "26px", background: `${step === 4 ? "gray" : step > 4 ? "green" : ""}`, color: `${step === 4 ? "white" : step > 4 ? "white" : "gray"}` }}>
                        4
                    </span>
                    Markdown
                </li>
            </ol>
            {renderModalContent()}
        </div>
    );
}

