'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { getcourseFirestore, addCourseToUser } from "@/api/Api";

export default function UserCourse() {
    const [CourseData, setCourseData] = useState([]);
    const [userdata, setuserdata] = useState<any>();
    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        const fetchData = async () => {
            const organisation_id =parsedUserData?.organisation_id;
            await getcourseFirestore(organisation_id).then((res: any) => {
                setCourseData(res);
                console.log(res, "resresresres");
            })
        };
        fetchData();
    }, []);

    const buyCourse = async (item: any) => {
        const uid = userdata?.uid;
        const updatedData = {
            course_id: item?.course_id,
            progress: 10,
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

    const filteredCourses = CourseData.filter((item: any) => {
        const searchString = searchText.toLowerCase();
        const title = item.title.toLowerCase();
        const level = item.level.toLowerCase();
        const authorName = item.author ? item.author.user_name.toLowerCase() : "";
        const skills = item.skills ? item.skills.map((skill: string) => skill.toLowerCase()).join(",") : "";
        return title.includes(searchString) || level.includes(searchString) || authorName.includes(searchString) || skills.includes(searchString);
    });

    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h2>Search by topics</h2>
                    </div>
                    <div className="w-1/6">
                        <form>
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 ml-2 pointer-events-none">
                                <svg className="w-5 mt-2 h-5 ml-1 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="search" id="default-search"
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ paddingTop: "10px", paddingLeft: "40px" }}
                                className="block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search Title, Skills..." required />
                        </form>
                    </div>
                </div>
                <div className="grid grid-cols-3 mt-4">
                    {filteredCourses.map((item: any) => (
                        <div key={item.id}>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <div className="p-5">
                                        <img className="rounded-t-lg" style={{ height: "200px" }} src={item?.imgUrl} alt="" />
                                    </div>
                                    <div className="p-5 h-50">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item?.summary}</p>
                                        <div className="flex m-3">
                                            <div className="w-5/6">
                                                <p className="inline-flex items-center">
                                                    <svg style={{ width: "15px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                        <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                    </svg>
                                                    <span className="ml-2">{item?.author?.user_name}</span>
                                                </p><br />
                                                <p className="inline-flex items-center">
                                                    <svg style={{ width: "15px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
                                                    </svg>
                                                    <span className="ml-2">{item?.level}</span>

                                                </p>
                                            </div>
                                            <div className="w-1/6">
                                                <p style={{ fontWeight: "bold", fontSize: "18px" }}>₹ {item?.price?.newprice}</p>
                                                <p className="text-sm"><s> ₹ {item?.price?.oldprice}</s></p>
                                            </div>
                                        </div>
                                        <div> <b>Skills : {Array.isArray(item?.skills) && item.skills.map((skill: any, index: any) => (
                                            <span key={index}>
                                                {skill}{index < item.skills.length - 1 && ', '}
                                            </span>
                                        ))}</b></div>
                                        <Link href="" onClick={() => { buyCourse(item) }} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Buy at ₹ {item?.price?.newprice}
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
            </div>
        </div >
    );
}