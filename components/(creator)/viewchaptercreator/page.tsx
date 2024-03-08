'use client'
import { useEffect, useState, useRef } from "react";
import { getCourseChapterData, updateCourseChapterData, getCourseWithCourseid } from "@/api/Api";
import React from "react";
import Stackedit from 'stackedit-js';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

export default function Viewchaptercreators() {
    const searchParams = useSearchParams();
    const chapter_id: any = searchParams?.get('chapter_id')
    const courseId = localStorage.getItem("view_course_id");
    const stackedit = new Stackedit();
    const selectedCourseTitle = localStorage.getItem("selectedCourseTitle");
    const [userdata, setuserdata] = useState<any>();
    const [CourseChapterData, setCourseChapterData] = useState<any>();
    const [value, setvalue] = useState<boolean>(true);
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        // const chapter_id: any = localStorage.getItem("view_chapter_id");
        getCourseChapterData(chapter_id)
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
                text: CourseChapterData?.content,
            },
            name: 'MyFile.md',
            isTemporary: true,
        });
    };
    stackedit.on('fileChange', (file: { content: { text: any; }; }) => {
        const newText = file.content.text;
        // const chapter_id = localStorage.getItem("view_chapter_id");
        const updatedData = { content: newText ? newText : CourseChapterData?.content };
        updateCourseChapterData(chapter_id, updatedData);
        setvalue(true)
    })
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
    const [PreviousChapter, setPreviousChapter] = useState<any>();
    const [NextChapter, setNextChapter] = useState<any>();

    useEffect(() => {
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
            });
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
    const refresh = () => {
        setvalue(true)
    }
    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h5><span><Link href="/creatorcourse">{"Back to Course < "}</Link></span>
                            <span>
                                <Link
                                    href={{
                                        pathname: '/viewcoursecreator',
                                        query: { course_id: courseId }
                                    }}

                                >{`${selectedCourseTitle} < `}</Link></span>{CourseChapterData?.title}</h5>
                    </div>
                    <div className="w-1/6">
                        <button onClick={openStackEdit}>Update Chapter</button>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='basis-10/12' style={{ height: '70vh', overflow: 'scroll' }} ref={contentRef}>
                        <div className={`p-10  rounded border-1 border-gray-200`}>
                            <ReactMarkdown components={components} children={CourseChapterData?.content} />
                        </div>
                        {PreviousChapter ? 
                        <Link href={{ pathname: '/viewchaptercreator', query: { chapter_id: PreviousChapter } }} onClick={refresh}>
                            PreviousChapter
                        </Link> : null}
                        {NextChapter ? 
                        <Link href={{ pathname: '/viewchaptercreator', query: { chapter_id: NextChapter } }} onClick={refresh}>
                            NextChapter
                        </Link> : null}
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

