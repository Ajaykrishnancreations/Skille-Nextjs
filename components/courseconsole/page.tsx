'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { updateCourseData, getcourseFirestore } from "@/api/Api";

export default function CourseConsole() {
    const [CourseData, setCourseData] = useState([]);
    const [UserData, setUserData] = useState<any>("");
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [skillsUpdate, setSkillsUpdate] = useState<string[]>(selectedCourse?.skills || []);
    const [TitleUpdate, setTitleUpdate] = useState<string>(selectedCourse?.title);
    const [Published, setPublished] = useState<string>(selectedCourse?.published);
    const [imgUrlUpdate, setimgUrlUpdate] = useState<string>(selectedCourse?.imgUrl);
    const [summaryUpdate, setsummaryUpdate] = useState<string>(selectedCourse?.summary);
    const [levelUpdate, setLevelUpdate] = useState<string>(selectedCourse?.level);
    const [newpriceUpdate, setNewpriceUpdate] = useState<string>(selectedCourse?.newprice);
    const [oldpriceUpdate, setOldpriceUpdate] = useState<string>(selectedCourse?.oldprice);
    const [Value, setValue] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (course: any) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
    };


    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setUserData(parsedUserData);
        const fetchData = async () => {
            const data: any = await getcourseFirestore("");
            setCourseData(data);
        };
        fetchData();
        setValue(false);
    }, [Value]);

    const handleSkillChange1 = (index: number, value: string) => {
        const newSkills = [...skillsUpdate];
        newSkills[index] = value;
        setSkillsUpdate(newSkills);
    };

    const addSkill1 = () => {
        setSkillsUpdate(prevSkills => [...prevSkills, '']);
    };

    const removeSkill1 = (index: number) => {
        setSkillsUpdate(prevSkills => prevSkills.filter((_, i) => i !== index));
    };

    const saveCourseChanges = () => {
        if (selectedCourse) {
            updateCourseData(selectedCourse.id,
                {
                    title: TitleUpdate ? TitleUpdate : selectedCourse?.title,
                    imgUrl: imgUrlUpdate ? imgUrlUpdate : selectedCourse?.imgUrl,
                    summary: summaryUpdate ? summaryUpdate : selectedCourse?.summary,
                    level: levelUpdate ? levelUpdate : selectedCourse?.level,
                    price: {
                        newprice: newpriceUpdate ? newpriceUpdate : selectedCourse?.price?.newprice,
                        oldprice: oldpriceUpdate ? oldpriceUpdate : selectedCourse?.price?.oldprice
                    },
                    published: Published ? Published : selectedCourse?.published,
                    skills: skillsUpdate
                }, UserData?.uid).then((updated) => {
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
                        {/* <button onClick={openModal1}>Add New Course</button> */}
                    </div>
                </div>

                <div className="grid grid-cols-3 mt-4">
                    {CourseData.map((item: any) => (
                        <div key={item.id}>
                            <div className="p-5">
                                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3">
                                    <div className="p-5">
                                        <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "1%" }}>
                                            <p style={{ color: `${item?.published === "Published" ? "green" : "red"}` }}>{item?.published}</p>
                                        </div>
                                        <div className="" style={{ position: "absolute", marginTop: "10px", paddingLeft: "14%" }}>
                                            <button className="border-4 border-white rounded bg-gray-300 z-2" style={{ width: "80px" }} onClick={() => openModal(item)}>Edit</button>
                                        </div>
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
                                                    <svg className="w-4 h-4 text-gray-800 dark:text-white" style={{ width: "15px" }} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
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
                                        <div>
                                            <b>{Array.isArray(item?.skills) && item.skills.map((skill: any, index: any) => (
                                                <span key={index}>
                                                    {skill}{index < item.skills.length - 1 && ' '}
                                                </span>
                                            ))}</b>
                                        </div>
                                        <Link href="/viewcourse"
                                         onClick={() => {
                                            localStorage.setItem("view_course_id", item?.course_id)
                                            localStorage.setItem("selectedCourseTitle",item?.title)
                                        }}
                                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            View course
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
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700" style={{ height: "80vh", overflow: "scroll" }}>
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
                                        Choose to Published/un-Published :
                                        <select
                                            style={{ width: "100%" }}
                                            id="countries"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(event) => setPublished(event.target.value)}
                                            defaultValue={selectedCourse?.published}
                                        >
                                            <option selected>
                                                Choose to Published/un-Published
                                            </option>
                                            <option value="Published">Published</option>
                                            <option value="Un-Published">Un-Published</option>
                                        </select>
                                    </div>
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
                                    <div className="ml-2 mr-2 text-gray-600">
                                        Enter Course level :
                                        <input
                                            className="rounded w-full"
                                            defaultValue={selectedCourse?.level}
                                            onChange={(e) => setLevelUpdate(e.target.value)}
                                            placeholder="level"
                                        />
                                    </div>
                                    <div className="ml-2 mr-2 text-gray-600">
                                        Enter Course newprice :
                                        <input
                                            className="rounded w-full"
                                            defaultValue={selectedCourse?.price?.newprice}
                                            onChange={(e) => setNewpriceUpdate(e.target.value)}
                                            placeholder="newprice"
                                        />
                                    </div>
                                    <div className="ml-2 mr-2 text-gray-600">
                                        Enter Course Oldprice :
                                        <input
                                            className="rounded w-full"
                                            defaultValue={selectedCourse?.price?.oldprice}
                                            onChange={(e) => setOldpriceUpdate(e.target.value)}
                                            placeholder="Oldprice"
                                        />
                                    </div>
                                    <div>
                                        {skillsUpdate.map((skill, index: any) => (
                                            <div key={index} className="ml-2 mr-2 text-gray-600">
                                                <input
                                                    className="rounded w-full"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange1(index, e.target.value)}
                                                    placeholder={`Skill ${index + 1}`}
                                                />
                                                <button type="button" onClick={() => removeSkill1(index)}>Remove</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={addSkill1}>Add Skill</button>
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
