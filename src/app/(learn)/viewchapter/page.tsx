'use client'
import { useEffect, useState, useRef } from "react";
import { getCourseChapterData, getCourseWithCourseid, updateProgressAndCompletionStatus, updateUserCompletedChapters, checkUserCompletedChapters } from "@/api/Api";
import React from "react";
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from "next/link";
interface TitleProps {
    title: string;
    selected: boolean;
    onClick: () => void;
    isBold: boolean;
}
interface CodeProps {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
}
const Title: React.FC<TitleProps> = ({ title, selected, onClick, isBold }) => (
    <div
        className={`basis-2/12 mt-5 cursor-pointer ${selected ? 'font-bold' : ''}`}
        onClick={onClick}
    >
        {isBold ? <strong>{title}</strong> : title}
    </div>
);
const isEqual = (array1: any[], array2: any[]): boolean => {
    return (
        array1.length === array2.length &&
        array1.every((value, index) => value === array2[index])
    );
};

export default function LearnPage() {
    const [courseId, setcourseId] = useState();
    const [selectedCourseTitle, setselectedCourseTitles] = useState();
    const [userdata, setuserdata] = useState<any>();
    const [CourseChapterData, setCourseChapterData] = useState<any>();
    const [CompletedChapter, setCompletedChapter] = useState<boolean>();
    const [value, setvalue] = useState<boolean>()
    const [PreviousChapter, setPreviousChapter] = useState<any>();
    const [NextChapter, setNextChapter] = useState<any>();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const courseIds: any = localStorage.getItem("view_course_id");
            setcourseId(courseIds)
            const selectedCourseTitles: any = localStorage.getItem("selectedCourseTitle");
            setselectedCourseTitles(selectedCourseTitles)
            const storedUserData = localStorage.getItem("userdata");
            const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
            setuserdata(parsedUserData);
            const searchParams = new URLSearchParams(window.location.search);
            const chapter_id = searchParams.get('chapter_id');
            getCourseChapterData(chapter_id)
                .then((CourseChapterData: any) => {
                    if (CourseChapterData) {
                        setCourseChapterData(CourseChapterData)
                    } else {
                        console.log("getCourseChapterData not found");
                    }
                })

            const userUid = parsedUserData?.uid;
            // const courseId = localStorage.getItem("view_course_id");
            const chapterIds = [chapter_id];

            checkUserCompletedChapters(userUid, courseId, chapterIds).then((res: boolean) => {
                setCompletedChapter(res)
            })
            getCourseWithCourseid(courseId)
                .then((CourseData: any) => {
                    if (CourseData) {
                        const selectedChapterId = chapter_id;
                        const selectedChapterIndex = CourseData.chapters.findIndex(
                            (chapter: { chapter_id: any; }) => chapter.chapter_id === selectedChapterId
                        );

                        const previousChapter =
                            selectedChapterIndex > 0
                                ? CourseData.chapters[selectedChapterIndex - 1]
                                : null;

                        const nextChapter =
                            selectedChapterIndex < CourseData.chapters.length - 1
                                ? CourseData.chapters[selectedChapterIndex + 1]
                                : null;
                        setPreviousChapter(previousChapter?.chapter_id);
                        setNextChapter(nextChapter?.chapter_id);

                        // console.log(previousChapter?.chapter_id, nextChapter?.chapter_id, "nextChapternextChapternextChapter");
                    } else {
                        console.log("CourseData not found");
                    }
                })

            setvalue(false)
        }
    }, [value]);
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
            const headingText = String(children);
            return (
                <h1 id={`heading-${titles.indexOf(headingText)}`} className={`mt-2 mb-2`}>
                    {children}
                    <hr></hr>
                </h1>
            );
        },
        h2: ({ children }: { children: React.ReactNode }) => {
            const headingText = String(children);
            return (
                <h2 id={`heading-${titles.indexOf(headingText)}`} className={`mt-5 `}>
                    {children}
                </h2>
            );
        },
        h3: ({ children }: { children: React.ReactNode }) => {
            const headingText = String(children);
            return (
                <h3 id={`heading-${titles.indexOf(headingText)}`} className={`mt-5`}>
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
    const [titles, setTitles] = useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = useState<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const extractTitles = (source: string) => {
        const regex = /^#{1,3}\s+(.*)|^(\*{2})\s+(.*)/gm;
        const matches = Array.from(source.matchAll(regex), (match) => match[1]);
        return matches;
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserData = localStorage.getItem("userdata");
            const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
            setuserdata(parsedUserData);

            if (CourseChapterData?.content) {
                const newTitles = extractTitles(CourseChapterData.content);
                if (!isEqual(newTitles, titles)) {
                    setTitles(newTitles);
                }
                if (!selectedTitle && newTitles.length > 0) {
                    handleTitleClick(newTitles[0]);
                }
            }
        }
    }, [CourseChapterData?.content, titles, selectedTitle, value]);

    const handleTitleClick = (title: string) => {
        setSelectedTitle(title);
        const index = titles.indexOf(title);
        if (index !== -1) {
            const element = document.getElementById(`heading-${index}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    const updateCompletedChapter = () => {
        const userUid = userdata?.uid;
        // const courseId = localStorage.getItem("view_course_id");
        const searchParams = new URLSearchParams(window.location.search);
        const chapter_id = searchParams.get('chapter_id');
        const completedChapterIds = [chapter_id];
        updateUserCompletedChapters(userUid, courseId, completedChapterIds).then((res: boolean) => {
            if (res == true) {
                setvalue(true)
                getCourseWithCourseid(courseId).then((res: any) => {
                    const targetLength = res?.chapters?.length;
                    updateProgressAndCompletionStatus(userUid, courseId, targetLength).then((res) => {
                    })
                })
            }
        })
    }
    const handleNavigation = (chapterId: any) => {
        window.open(`http://localhost:3000/viewchapter?chapter_id=${chapterId}`, "_self");
    };

    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h5><span><Link href="/mycourse">{"Back to Course < "}</Link></span>
                            <span><Link
                                href={{
                                    pathname: '/viewcourse',
                                    query: { course_id: courseId }
                                }}
                            >{`${selectedCourseTitle} < `}</Link></span>{CourseChapterData?.title}</h5>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='basis-10/12' style={{ height: '70vh', overflow: 'scroll' }} ref={contentRef}>
                        <div className={`p-10  rounded border-1 border-gray-200`}>
                            <ReactMarkdown components={components} children={CourseChapterData?.content} />
                        </div>
                        <div className="m-5">
                            <hr className="m-5"></hr>
                            <>
                                {CompletedChapter == false ?

                                    <div className="m-5">
                                        <div className="flex items-center me-4">
                                            <input id="teal-checkbox" type="checkbox" value="" className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the terms and conditions.</label>
                                            <button onClick={updateCompletedChapter}>update</button>
                                        </div>
                                        <p className="mt-2 ms-2 text-sm font-medium text-gray-900">
                                            I have successfully completed the course chapter. I have thoroughly reviewed the material, completed all the exercises, and gained a comprehensive understanding of the concepts covered. I am confident in my ability to apply this knowledge effectively in practical scenarios. I look forward to advancing to the next chapter and further expanding my skills and expertise in this subject area.
                                        </p>
                                    </div>
                                    :
                                    <div className="m-5">
                                        You have already completed this course's chapter.
                                    </div>
                                }
                            </>
                            <h5 className="p-3">Continue Learning</h5>
                            <div className='flex flex-row'>
                                <div className='basis-2/12'>
                                    {PreviousChapter && (
                                        <button onClick={() => handleNavigation(PreviousChapter)}>PreviousChapter</button>
                                    )}
                                </div>
                                <div className='basis-10/12'>
                                    {NextChapter && (
                                        <button onClick={() => handleNavigation(NextChapter)}>NextChapter</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='basis-2/12 p-10'>
                        {titles.map((title, index) => (
                            <Title
                                key={index}
                                title={title}
                                selected={selectedTitle === title}
                                onClick={() => handleTitleClick(title)}
                                isBold={false}
                            />
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
}
