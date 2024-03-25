'use client'
import { useEffect, useState } from "react";
import { getUserDetailsByUID, updateUserData, addCourseToUser, getcourseFirestore ,addBuyerslist} from "@/api/Api";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';

export default function ViewCourse() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user_uid = searchParams?.get('user_uid')
    const [UserData, getUserData] = useState<any>();
    console.log(UserData, "UserDataUserData");
    const [newName, setnewName] = useState<string>();
    const [selectedRole, setSelectedRole] = useState<string>();
    const [Organisation_id, setOrganisation_id] = useState<any>();
    const [userdata, setuserdata] = useState<any>();
    const [Values, setValues] = useState<boolean>(false);
    const [searchText, setSearchText] = useState("");
    const [CourseData, setCourseData] = useState([]);
    const [purchasedCourses, setPurchasedCourses] = useState<any[]>([]);
    const updateUser = async () => {
        const uidToUpdate = UserData?.uid;
        const updatedData = {
            name: newName ? newName : UserData?.name,
            role: selectedRole ? selectedRole : UserData?.role,
            organisation_id: Organisation_id ? Organisation_id : UserData?.organisation_id,
        };
        const updated = await updateUserData(uidToUpdate, updatedData);
        if (updated) {
            alert("Data updated successfully");
            setValues(true)
        }

    }
    const isCoursePurchased = (courseId: string) => {
        return purchasedCourses.includes(courseId);
    };
    useEffect(() => {
        const storedUserData = localStorage.getItem("userdata");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setuserdata(parsedUserData);
        getUserDetailsByUID(user_uid)
            .then((CourseData: any) => {
                if (CourseData) {
                    getUserData(CourseData);
                } else {
                    console.log("CourseData not found");
                }
            })
        getUserDetailsByUID(user_uid).then((res: any) => {
            setPurchasedCourses(res?.courses.map((course: any) => course.course_id));
        })
        const fetchData = async () => {
            const organisation_id = parsedUserData?.organisation_id;
            await getcourseFirestore(organisation_id).then((res: any) => {
                setCourseData(res);
            })
        };
        fetchData();
        setValues(false)
    }, [Values]);

    const AddCourse = async (item: any) => {
        const uid = UserData?.uid;
        const updatedData = {
            course_id: item?.course_id,
            progress: 0,
            completion_status: false,
            completed_chapters: [],
            enrolled_date: null,
            completion_date: null
        };

        const author_id = item?.author?.user_id;
        const course_id = item?.course_id;
        const student_id = uid;
        const payment = "Enrolled by the admin";
       
        const updated = await addCourseToUser(uid, updatedData);
        if (updated) {
            addBuyerslist(author_id,course_id,student_id,payment)
            alert("Course Added Successfully");
            setValues(true)
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
                <div className="p-4 md:p-5 space-y-4">
                    
                    <div className="flex">
                            <div className="w-5/6">
                            <h5>Update user</h5>
                            </div>
                            <div className="w-1/6">
                            <Link className="bg-white w-full rounded p-1 mt-5" href={{ pathname: '/studyhublist', query: { UserUid: UserData?.uid } }}> View {UserData?.name}'s Revenue</Link>
                            </div>
                        </div>
                    Enter your Name : <input type="text" className="rounded ml-2" defaultValue={UserData?.name} onChange={(event) => setnewName(event.target.value)} /><br />
                    <span className="inline-flex">
                        Select your Role :
                        <select
                            style={{ width: "195px", marginLeft: "14px" }}
                            id="countries"
                            className="text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            defaultValue={UserData?.role}
                            onChange={(event) => setSelectedRole(event.target.value)}
                        >
                            <option value="user">user</option>
                            <option value="creator">creator</option>
                        </select>
                    </span><br />
                    Organisation_id : <input type="text" className="rounded ml-3" defaultValue={UserData?.organisation_id} onChange={(event) => setOrganisation_id(event.target.value)} /><br />
                </div>
                <button onClick={updateUser} type="button" className="text-white bg-blue-700 ml-4 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                <hr className="mt-3" />
                <div>
                    <div className="p-10">
                        <div className="flex">
                            <div className="w-5/6">
                                <h5>Search by topics</h5>
                            </div>
                            <div className="w-1/6">
                                <form>
                                    <input type="search" id="default-search"
                                        onChange={(e) => setSearchText(e.target.value)}
                                        style={{ paddingTop: "10px", paddingLeft: "20px" }}
                                        className="block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Search by Title, Skills..." required />
                                </form>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 mt-4">
                            {filteredCourses.map((item: any) => (
                                <div key={item.id}>
                                    <div className="p-5">
                                        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                            <div className="h-50 p-4" >
                                                <p className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{item?.title}</p>
                                                <p style={{ height: "60px", overflow: "scroll" }} className="mb-3 text-sm text-gray-700 dark:text-gray-400">{item?.summary}</p>
                                                <div className="flex m-3 mb-1">
                                                    <div className="w-5/6">
                                                        <p className="inline-flex items-center">
                                                            <svg style={{ width: "12px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />
                                                            </svg>
                                                            <span className="ml-2" style={{ fontSize: "12px" }}>{item?.author?.user_name}</span>
                                                        </p><br />
                                                        <p className="inline-flex items-center">
                                                            <svg style={{ width: "12px" }} className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M1 5h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 1 0 0-2H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2Zm18 4h-1.424a3.228 3.228 0 0 0-6.152 0H1a1 1 0 1 0 0 2h10.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Zm0 6H8.576a3.228 3.228 0 0 0-6.152 0H1a1 1 0 0 0 0 2h1.424a3.228 3.228 0 0 0 6.152 0H19a1 1 0 0 0 0-2Z" />
                                                            </svg>
                                                            <span className="ml-2" style={{ fontSize: "12px" }}>{item?.level}</span>

                                                        </p>
                                                    </div>
                                                    <div className="w-1/6">
                                                        <p style={{ fontWeight: "bold", fontSize: "12px" }}>₹ {item?.price?.newprice}</p>
                                                        <p style={{ fontWeight: "bold", fontSize: "12px" }}>₹ {item?.price?.oldprice}</p>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: "12px" }}> <b>Skills : {Array.isArray(item?.skills) && item.skills.map((skill: any, index: any) => (
                                                    <span key={index}>
                                                        {skill}{index < item.skills.length - 1 && ', '}
                                                    </span>
                                                ))}</b></div>
                                                <div className="flex">
                                                    <div className="w-3/6">
                                                        <div style={{ fontSize: 12, borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}>
                                                            {isCoursePurchased(item.course_id) ?
                                                                <Link href="">
                                                                    Buyed
                                                                </Link>
                                                                :
                                                                <>
                                                                    <Link href="" onClick={() => { AddCourse(item) }}>
                                                                        Add Course
                                                                    </Link>
                                                                </>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="w-3/6">
                                                        <div style={{ fontSize: 12, borderRadius: "5px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", margin: "5px" }}>
                                                            <Link
                                                                href={{
                                                                    pathname: '/buycourse',
                                                                    query: { course_id: item?.course_id }
                                                                }}>
                                                                view
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}

