'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { addDataToFirestore, getUserDatafromFirestore } from "@/api/Api";

export default function LearnPage() {
    const [title, setTitle] = useState("");
    const [imgUrl, setimgUrl] = useState("");
    const [summary, setsummary] = useState("");
    const [CourseData, setCourseData] = useState([]);
    console.log(CourseData, "UserDataUserDataUserData");

    const addData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        addDataToFirestore(title, imgUrl, summary).then((added) => {
            if (added) {
                alert("Data added");
            }
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const data: any = await getUserDatafromFirestore();
            setCourseData(data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <div className="p-10">
                <h2>Search by topics</h2>
                <div className="grid grid-cols-3 mt-4">
                    {CourseData.map((item: any) => (
                        <div>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <a href="#">
                                        <img className="rounded-t-lg" style={{height:"200px"}} src={item?.imgUrl} alt="" />
                                    </a>
                                    <div className="p-5 h-50">
                                        <a href="#">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</h5>
                                        </a>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item?.summary}</p>
                                        <Link href="/courseReadMe" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Read more
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
                <div className="p-10">
                    Add New Course
                    <form onSubmit={addData}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                        />
                        <input
                            type="text"
                            value={imgUrl}
                            onChange={(e) => setimgUrl(e.target.value)}
                            placeholder="ImgUrl"
                        />
                        <input
                            type="text"
                            value={summary}
                            onChange={(e) => setsummary(e.target.value)}
                            placeholder="Summary"
                        />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    );
}