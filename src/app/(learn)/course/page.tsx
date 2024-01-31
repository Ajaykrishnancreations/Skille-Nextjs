'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { addCourseFirestore, getcourseFirestore, updateCourseData, addCourseChapterData } from "@/api/Api";
import { v4 as uuidv4 } from 'uuid';

export default function LearnPage() {
    const courseId = uuidv4();
    const [CourseData, setCourseData] = useState([]);
    const [addCourse, setaddCourse] = useState(true);
    const [UserData, setUserData] = useState<any>("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [Value, setValue] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [TitleUpdate, setTitleUpdate] = useState<string>(selectedCourse?.title);
    const [imgUrlUpdate, setimgUrlUpdate] = useState<string>(selectedCourse?.imgUrl);
    const [summaryUpdate, setsummaryUpdate] = useState<string>(selectedCourse?.summary);
    const [formData, setFormData] = useState({
        title: '',
        imgUrl: '',
        summary: '',
        level: '',
        skills: '',
        newprice: '',
        oldprice: '',
        course_id: courseId,
    });
    const { title, imgUrl, summary, level, skills, newprice, oldprice, course_id } = formData;
    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    const addData = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        addCourseFirestore(title, imgUrl, summary, course_id, level, skills, newprice, oldprice).then((added) => {
            if (added) {
                alert("Data added");
                setaddCourse(false);
                const data = {
                    course_id: course_id,
                    course_title: title,
                };
                localStorage.setItem("newCourseData", JSON.stringify(data));
                setValue(true)
                setIsModalOpen1(false);
            }
        });
    };
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setUserData(parsedUserData);
        const fetchData = async () => {
            const data: any = await getcourseFirestore();
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

    const openModal1 = () => {
        setIsModalOpen1(true);
    };
    const closeModal1 = () => {
        setIsModalOpen1(false);
    };

    const saveCourseChanges = () => {
        if (selectedCourse) {
            updateCourseData(selectedCourse.id, { title: TitleUpdate, imgUrl: imgUrlUpdate, summary: summaryUpdate }, UserData?.uid).then((updated) => {
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
            <div className="flex">
                    <div className="w-5/6">
                    <h2>Search by topics</h2>
                    </div>
                    <div className="w-1/6">
                    <button onClick={openModal1}>Add New Course</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 mt-4">
                    {CourseData.map((item: any) => (
                        <div key={item.id}>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <div className="p-5">
                                        {UserData?.role === "creator" && (
                                            <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "14%" }}>
                                                <button className="border-4 border-white rounded bg-gray-300 z-2 w-20" onClick={() => openModal(item)}>Edit</button>
                                            </div>
                                        )}
                                        <img className="rounded-t-lg" style={{ height: "200px" }} src={item?.imgUrl} alt="" />
                                    </div>
                                    <div className="p-5 h-50">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item?.summary}</p>
                                        <div className="flex m-3">
                                            <div className="w-5/6">
                                                <p className="inline-flex items-center">
                                                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                        <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                    </svg>
                                                    <span className="ml-2">{item?.author?.user_name}</span>
                                                </p><br />
                                                <p className="inline-flex items-center">
                                                    <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
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
                                        {UserData?.role === "creator" ?
                                            <Link href="/viewcourse" onClick={() => localStorage.setItem("view_course_id", item?.course_id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                View course
                                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                </svg>
                                            </Link>
                                            :
                                            <Link href="/viewcourse" onClick={() => localStorage.setItem("view_course_id", item?.course_id)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                Buy at ₹ {item?.price?.newprice}
                                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                </svg>
                                            </Link>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {UserData?.role === "creator" && (
                <div className="p-10">
                    
                    {
                        isModalOpen1 && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <>
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Add a New Course
                                                </h3>
                                                <button type="button" onClick={closeModal1} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>
                                            <form className="max-w-sm mx-auto" onSubmit={addData}>
                                                <div className="mb-5">
                                                    <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                                        Enter Course Title:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                                    <input
                                                        type="text"
                                                        className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        name="skills"
                                                        value={skills}
                                                        onChange={handleChange}
                                                        placeholder="Skills"
                                                    />
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
                                                <input
                                                    type="submit"
                                                    className="rounded ml-2 pl-5 pr-5 bg-slate-600 p-2 text-white"
                                                    value="Submit"
                                                />
                                            </form>
                                        </>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            )}

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
