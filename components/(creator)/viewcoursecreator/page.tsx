'use client'
import { useEffect, useState } from "react";
import { addCourseChapterData, getCourseWithCourseid, updateCourseChapters, updateChapterData, updateCourseChapterData } from "@/api/Api";
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Viewcoursecreators() {
    const searchParams = useSearchParams();
    const Course_id: any = searchParams?.get('course_id')
    const chapter_id = uuidv4();
    const [CourseData, setCourseData] = useState<any>({});
    // const [Course_id, setCourse_id] = useState<any>();
    const [CourseTitle, setCourseTitle] = useState<any>();
    const [Value, setValue] = useState<boolean>(false);
    const [isModalOpen1, setIsModalOpen] = useState(false);
    const [selectedCourseChapter, setSelectedCourseChapter] = useState<any>(null);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [Published, setPublished] = useState<string>(selectedCourseChapter?.published);
    const [TitleUpdate, setTitleUpdate] = useState<string>(selectedCourseChapter?.chapter_title);
    const [imgUrlUpdate, setimgUrlUpdate] = useState<any>(selectedCourseChapter?.image_url);
    const [chapter_descriptionUpdate, setchapter_descriptionUpdate] = useState<string>(selectedCourseChapter?.chapter_description);
    const [tagsUpdate, settagsUpdate] = useState<string>(selectedCourseChapter?.tags);
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const openUpdateModal = (course: any) => {
        setSelectedCourseChapter(course);
        setIsModalUpdateOpen(true);
    };
    const closeUpdateModal = () => {
        setIsModalUpdateOpen(false);
    };

    useEffect(() => {
        // setCourse_id(localStorage.getItem("view_course_id"))
        getCourseWithCourseid(Course_id)
            .then((CourseData: any) => {
                if (CourseData) {
                    setCourseData(CourseData?.chapters);
                    setCourseTitle(CourseData?.title);
                    const selectedChapterId = "71ed6ce2-f812-4467-adef-095e82cc23e1";
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

                    console.log(previousChapter?.chapter_id, nextChapter?.chapter_id, "nextChapternextChapternextChapter");

                    setValue(false);
                } else {
                    console.log("CourseData not found");
                }
            });
    }, [Value]);
    const [formData, setFormData] = useState({
        title: '',
        image_url: '',
        description: '',
        content: 'Update your course chapter content',
        tags: '',
        next_chapter: '',
        previous_chapter: '',
        chapter_id: chapter_id,
    });
    const { title, image_url, description, content, tags, next_chapter, previous_chapter } = formData;
    const handleChange = (e: { target: { name: any; value: any; type: any; checked: any; }; }) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const addCourseChapters = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        addCourseChapterData(chapter_id, description, image_url, title, content, tags, next_chapter, previous_chapter).then((added) => {
            if (added) {
                alert("CourseChapters added");
                const newChapterData = {
                    chapter_id: chapter_id,
                    chapter_title: title,
                    chapter_description: description,
                    image_url: image_url,
                    tags: tags,
                    published: "Un-Published",
                }
                updateCourseChapters(Course_id, newChapterData).then((updated) => {
                    if (updated) {
                        alert("Course updated");
                        setValue(true);
                        setIsModalOpen(false);
                    } else {
                        alert("Failed to update course");
                    }
                });
            }
        });
    };
    const updatedChapterDatas = () => {
        const course_id = Course_id;
        const chapterId = selectedCourseChapter?.chapter_id;
        const updatedChapterData: any = {
            chapter_description: chapter_descriptionUpdate ? chapter_descriptionUpdate : selectedCourseChapter?.chapter_description,
            chapter_id: selectedCourseChapter?.chapter_id,
            chapter_title: TitleUpdate ? TitleUpdate : selectedCourseChapter?.chapter_title,
            image_url: imgUrlUpdate ? imgUrlUpdate : selectedCourseChapter?.image_url,
            tags: tagsUpdate ? tagsUpdate : selectedCourseChapter?.tags,
            published: Published ? Published : selectedCourseChapter?.published,
        };
        updateChapterData(course_id, chapterId, updatedChapterData).then((res) => {
            if (res == true) {
                const updatedData = {
                    description: chapter_descriptionUpdate ? chapter_descriptionUpdate : selectedCourseChapter?.chapter_description,
                    image_url: imgUrlUpdate ? imgUrlUpdate : selectedCourseChapter?.image_url,
                    tags: tagsUpdate ? tagsUpdate : selectedCourseChapter?.tags,
                    title: TitleUpdate ? TitleUpdate : selectedCourseChapter?.chapter_title,
                }
                updateCourseChapterData(chapterId, updatedData)
                    .then((res) => {
                        if (res == true) {
                            setValue(true)
                            setIsModalUpdateOpen(false);
                        }
                        else {
                            alert("Error updating course chapter")
                            setIsModalUpdateOpen(false);
                        }
                    })


            }
            else {
                alert("Error updating course chapter");
                setIsModalUpdateOpen(false);
            }
        })

    }
    return (
        <div>
            <div className="p-10">
                <div className="flex">
                    <div className="w-5/6">
                        <h5><span><Link href="/creatorcourse">{"Back to Course < "}</Link></span>{CourseTitle}</h5>
                        <div className="grid grid-cols-5 mt-4">
                            {Array.isArray(CourseData) && CourseData.map((item: any) =>
                                <div key={item.id}>
                                    <div className="p-2 transform transition-transform duration-300 hover:scale-105">
                                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div>
                                                <div className="text-sm" style={{ position: "absolute", marginTop: "10px", paddingLeft: "1%" }}>
                                                    <p style={{ color: `${item?.published === "Published" ? "green" : "red"}` }}>{item?.published}</p>
                                                </div>
                                                <div className="text-sm" style={{ position: "absolute", marginTop: "10px", paddingLeft: "60%" }}>
                                                    <button style={{ width: "60px" }} className="border-4 border-white rounded bg-gray-300 z-2 w-20" onClick={() => openUpdateModal(item)}>Edit</button>
                                                </div>
                                                <img className="rounded-t-lg" style={{ height: "150px", width: "100%" }} src={item?.image_url} alt="" />
                                            </div>
                                            <div className="p-4 h-50">
                                                <p className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">{item?.chapter_title}</p>
                                                <p style={{ height: "70px",fontSize:"12px" }} className="mb-3 text-gray-700 dark:text-gray-400">
                                                    {item?.chapter_description ?
                                                        (item.chapter_description.length > 70 ?
                                                            item.chapter_description.substring(0, 70).trim() + "..." :
                                                            item.chapter_description.split(" ").slice(0, 12).join(" ")
                                                        )
                                                        : null
                                                    }
                                                </p>
                                                <div className="flex m-3 mb-1">
                                                    <div className="w-5/6">
                                                        <p className="inline-flex items-center">
                                                            <svg style={{ width: "12px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                            </svg>
                                                            <span className="ml-2" style={{ fontSize: "12px" }}>{item?.tags}</span>
                                                        </p><br />
                                                    </div>
                                                </div>
                                                <div style={{ borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", fontSize: 12, marginTop: "10px" }}>
                                                    {/* <Link href="/viewchaptercreator"
                                                onClick={() => {
                                                    localStorage.setItem("view_chapter_id", item?.chapter_id);
                                                }}> */}
                                                    <Link href={{ pathname: '/viewchaptercreator', query: { chapter_id: item?.chapter_id } }}>
                                                        View Chapter
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/6 bg-gray-100 p-4 rounded">
                        <button onClick={openModal} className="bg-white w-full rounded p-1 mt-5"> + Add New Chapter</button>
                        <div className="mt-5 p-1 text-center">
                            <h6>The total revenue you earned from {CourseTitle} is.</h6>
                            <Link className="bg-white w-full rounded p-1 mt-5" href={{ pathname: '/studyhublist', query: { Course_id: Course_id } }}> View </Link>
                        </div>
                    </div>
                </div>

                {
                    isModalOpen1 && (
                        <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Add a new Chapter
                                    </h3>
                                    <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <form className="max-w-sm mx-auto" onSubmit={addCourseChapters}>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 mt-5 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                            Enter Chapter Title:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="title"
                                            value={title}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Title"
                                            required
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                            Enter Chapter ImgUrl:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="image_url"
                                            value={image_url}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter ImgUrl"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                                            Enter Chapter Description:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="description"
                                            value={description}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Description"
                                        />
                                    </div>
                                    <div className="mb-5">
                                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                                            Enter Chapter tags:
                                        </label>
                                        <input
                                            type="text"
                                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            name="tags"
                                            value={tags}
                                            onChange={handleChange}
                                            placeholder="Enter Chapter Tags"
                                        />
                                    </div>
                                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                        <button onClick={closeModal} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                <>
                    {
                        isModalUpdateOpen && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <>
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Edit Course Chapter
                                                </h3>
                                                <button type="button" onClick={closeUpdateModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
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
                                                        defaultValue={selectedCourseChapter?.published}
                                                        onChange={(event) => setPublished(event.target.value)}
                                                    >
                                                        <option value="" selected>
                                                            Choose to Published/un-Published
                                                        </option>
                                                        <option value="Published">Published</option>
                                                        <option value="Un-Published">Un-Published</option>
                                                    </select>
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Chapter Title :
                                                    <input
                                                        className="rounded  w-full"
                                                        type="text"
                                                        defaultValue={selectedCourseChapter?.chapter_title}
                                                        onChange={(e) => setTitleUpdate(e.target.value)}
                                                        placeholder="Title"
                                                    />
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Chapter ImgUrl :
                                                    <input
                                                        className="rounded w-full"
                                                        type="text"
                                                        defaultValue={selectedCourseChapter?.image_url}
                                                        onChange={(e) => setimgUrlUpdate(e.target.value)}
                                                        placeholder="ImgUrl"
                                                    />
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Chapter Summary :
                                                    <textarea
                                                        className="rounded w-full"
                                                        defaultValue={selectedCourseChapter?.chapter_description}
                                                        onChange={(e) => setchapter_descriptionUpdate(e.target.value)}
                                                        placeholder="Summary"
                                                        rows={4}
                                                        cols={50}
                                                    />
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Chapter tags :
                                                    <input
                                                        className="rounded w-full"
                                                        defaultValue={selectedCourseChapter?.tags}
                                                        onChange={(e) => settagsUpdate(e.target.value)}
                                                        placeholder="level"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                <button onClick={updatedChapterDatas} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                                <button onClick={closeUpdateModal} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                                            </div>
                                        </>
                                    </div>
                                </div>
                            </div>
                        )}
                </>
            </div>
        </div >
    );
} 