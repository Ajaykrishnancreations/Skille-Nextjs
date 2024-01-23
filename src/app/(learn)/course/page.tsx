'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { addDataToFirestore, getUserDatafromFirestore, updateCourseData } from "@/api/Api";
export default function LearnPage() {
    const [title, setTitle] = useState("");
    const [imgUrl, setimgUrl] = useState("");
    const [summary, setsummary] = useState("");
    const [CourseData, setCourseData] = useState([]);
    const [UserData, setUserData] = useState<any>("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [Value, setValue] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TitleUpdate,setTitleUpdate] = useState<string>(selectedCourse?.title);
    const [imgUrlUpdate,setimgUrlUpdate] = useState<string>(selectedCourse?.imgUrl);
    const [summaryUpdate,setsummaryUpdate] = useState<string>(selectedCourse?.summary);

    const addData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        addDataToFirestore(title, imgUrl, summary).then((added) => {
            if (added) {
                alert("Data added");
                setValue(true)
            }
        });
    };
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setUserData(parsedUserData);
        const fetchData = async () => {
            const data: any = await getUserDatafromFirestore();
            setCourseData(data);
        };
        fetchData();
        setValue(false);
    }, [Value]);
    const openModal = (course: any) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    };
    const saveCourseChanges = () => {
        if (selectedCourse) {
            updateCourseData(selectedCourse.id, { title:TitleUpdate, imgUrl:imgUrlUpdate, summary:summaryUpdate }, UserData?.uid).then((updated) => {
                if (updated) {
                    alert("Course updated");
                    closeModal();
                    setValue(true)
                } else {
                    alert("Failed to update course");
                }
            });
        }
    };
    return (
        <div>
            <div className="p-10">
                <h2>Search by topics</h2>
                {UserData?.role === "admin" && (
                    <div className="p-10">
                        <h5>Add New Course</h5>
                        <form className="m-2" onSubmit={addData}>
                            <span className="ml-2 mr-2 text-gray-600">
                                Enter Course Title :
                                <input
                                    className="rounded ml-2"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Title"
                                />
                            </span>
                            <span className="ml-2 mr-2 text-gray-600">
                                Enter Course Title :
                                <input
                                    className="rounded ml-2"
                                    type="text"
                                    value={imgUrl}
                                    onChange={(e) => setimgUrl(e.target.value)}
                                    placeholder="ImgUrl"
                                />
                            </span>
                            <span className="ml-2 mr-2 text-gray-600">
                                Enter Course Title :
                                <input
                                    type="text"
                                    className="rounded ml-2"
                                    value={summary}
                                    onChange={(e) => setsummary(e.target.value)}
                                    placeholder="Summary"
                                />
                            </span>
                            <input className="rounded ml-2 pl-5 pr-5 bg-slate-600 p-2 text-white" type="submit" value="Submit" />
                        </form>
                    </div>
                )}
                <div className="grid grid-cols-3 mt-4">
                    {CourseData.map((item: any) => (
                        <div key={item.id}>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <div className="p-5">
                                        {UserData?.role === "admin" && (
                                            <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "14%" }}>
                                                <button className="border-4 border-white rounded bg-gray-300 z-2 w-20" onClick={() => openModal(item)}>Edit</button>
                                            </div>
                                        )}
                                        <img className="rounded-t-lg" style={{ height: "200px" }} src={item?.imgUrl} alt="" />
                                    </div>
                                    <div className="p-5 h-50">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</h5>
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
            </div>

            {
                isModalOpen && (
                    <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Edit Course
                                    </h3>
                                    <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-4 md:p-5 space-y-4">
                                    <div className="ml-2 mr-2 text-gray-600">
                                        Enter Course Title :
                                        <input
                                            className="rounded  w-full"
                                            type="text"
                                            defaultValue={selectedCourse?.title}
                                            onChange={(e) => setTitleUpdate(e.target.value)}
                                            placeholder="Title"
                                        />
                                    </div>
                                    <div className="ml-2 mr-2 text-gray-600">
                                        Enter Course ImgUrl :
                                        <input
                                            className="rounded w-full"
                                            type="text"
                                            defaultValue={selectedCourse?.imgUrl}
                                            onChange={(e) => setimgUrlUpdate(e.target.value)}
                                            placeholder="ImgUrl"
                                        />
                                    </div>
                                    <div className="ml-2 mr-2 text-gray-600">
                                        Enter Course Summary :
                                        <textarea
                                            className="rounded w-full"
                                            defaultValue={selectedCourse?.summary}
                                            onChange={(e) => setsummaryUpdate(e.target.value)}
                                            placeholder="Summary"
                                            rows={4}
                                            cols={50}
                                        />

                                    </div>
                                </div>
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button onClick={saveCourseChanges} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                    <button onClick={closeModal} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
