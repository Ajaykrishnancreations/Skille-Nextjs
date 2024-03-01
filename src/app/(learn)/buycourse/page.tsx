'use client'
import { useEffect,FormEvent, useState, useRef } from "react";
import { getCourseWithCourseid, getUserDetailsByUID, addCourseToUser } from "@/api/Api";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRouter } from 'next/navigation';
import sha256 from "crypto-js/sha256";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

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

export default function ViewCourse() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const course_id = searchParams?.get('course_id')
    const [CourseData, setCourseData] = useState<any>();
    const [userdata, setuserdata] = useState<any>();
    const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);

    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        getUserDetailsByUID(parsedUserData?.uid).then((res: any) => {
            setPurchasedCourses(res?.courses.map((course: any) => course.course_id));
        })
        getCourseWithCourseid(course_id)
            .then((CourseData: any) => {
                if (CourseData) {
                    setCourseData(CourseData);
                } else {
                    console.log("CourseData not found");
                }
            })
    }, []);

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
        if (CourseData?.register_content) {
            const newTitles = extractTitles(CourseData.register_content);
            if (!isEqual(newTitles, titles)) {
                setTitles(newTitles);
            }
            if (!selectedTitle && newTitles.length > 0) {
                handleTitleClick(newTitles[0]);
            }
        }
    }, [CourseData?.register_content, titles, selectedTitle]);

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
    const isCoursePurchased = (courseId: string) => {
        return purchasedCourses.includes(courseId);
    };
    const buyCourse = async (item: any) => {
        const uid = userdata?.uid;
        const updatedData = {
            course_id: item?.course_id,
            progress: 0,
            completion_status: false,
            completed_chapters: [],
            enrolled_date: null,
            completion_date: null
        };
        const updated = await addCourseToUser(uid, updatedData);
        if (updated) {
            alert("course buy successfully");
            window.open("http://localhost:3000/mycourse", "_self");
        }
        else {
            alert("User has already purchased this course");
        }

    }
    const makePayment = async (e: FormEvent<HTMLButtonElement>, item: any) => {
        e.preventDefault();
        const transactionid = "Tr-" + uuidv4().toString().slice(-6);
        const payload = {
            merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
            merchantTransactionId: transactionid,
            merchantUserId: "MUID-" + uuidv4().toString().slice(-6),
            amount: `${item?.price?.newprice}00`,
            redirectUrl: `http://localhost:3000/payment/${transactionid}`,
            redirectMode: "POST",
            callbackUrl: `http://localhost:3000/payment/${transactionid}`,
            mobileNumber: "9999999999",
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };
        localStorage.setItem("buyCourseId", item?.course_id);
        const dataPayload = JSON.stringify(payload);
        const dataBase64 = Buffer.from(dataPayload).toString("base64");
        const fullURL = dataBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY;
        const dataSha256 = sha256(fullURL);
        const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;
        const UAT_PAY_API_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
        try {
            const response = await axios.post(
                UAT_PAY_API_URL,
                {
                    request: dataBase64,
                },
                {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                        "X-VERIFY": checksum,
                    },
                }
            );
            const redirect = response.data.data.instrumentResponse.redirectInfo.url;
            router.push(redirect);
        } catch (error) {
            console.error("Error making payment:", error);
        }
    };
    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h5><span><Link href="/course">{"Back to Course < "}</Link></span>{CourseData?.title}</h5>
                    </div>
                    <div className="w-1/6">
                        <div style={{ fontSize: 12, borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "20px" }}>
                            {isCoursePurchased(CourseData?.course_id) ?
                                <Link href="/mycourse">
                                    Open Course
                                </Link>
                                :
                                <>
                                    {CourseData?.price?.newprice === 0 ?
                                        <Link href="" onClick={() => { buyCourse(CourseData) }}>
                                            Enroll Course for free
                                        </Link>
                                        :
                                        <Link href="" onClick={(e: any) => makePayment(e, CourseData)}>
                                            Enroll Course at ₹ {CourseData?.price?.newprice}
                                        </Link>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className='basis-10/12' style={{ height: '50vh', overflow: 'scroll' }} ref={contentRef}>
                        <div className={`p-1  rounded border-1 border-gray-200`}>
                            <ReactMarkdown components={components} children={CourseData?.register_content} />
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
        </div >
    );
}

