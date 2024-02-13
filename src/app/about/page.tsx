"use client";
import React, { useState, useEffect } from "react";
import { updateUserData, getUserDetailsByUID, getCoursesWithCourseIds } from "@/api/Api";

const About = () => {
  const [userdata, setuserdata] = useState<any>();
  const [UserDetail, setUserDetail] = useState<any>();
  const [CourseData, setCourseData] = useState<any[]>([]);
  console.log(CourseData, "CourseDataCourseDataCourseData");

  const [Value, setValue] = useState<boolean>(false);
  const [isPopOpen, setisPopOpen] = useState(false);
  const [newName, setnewName] = useState<string>();
  const [newimgUrl, setimgUrl] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string>();

  const handlePopToggle = () => {
    setisPopOpen(!isPopOpen);
  };
  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    setuserdata(parsedUserData);
  
    getUserDetailsByUID(parsedUserData?.uid)
      .then((userDetails: any) => {
        const completedCourseIds = userDetails?.courses
          .filter((course: any) => course.completion_status)
          .map((course: any) => course.course_id);
  
        if (completedCourseIds.length > 0) {
          fetchData(completedCourseIds);
        }
  
        if (userDetails) {
          setUserDetail(userDetails);
          setValue(false);
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  
    const fetchData = async (courseIds: string[]) => {
      if (courseIds && courseIds.length > 0) {
        try {
          const data: any = await getCoursesWithCourseIds(courseIds);
          console.log(data, "CourseDataCourseDataCourseData");
          setCourseData(data);
        } catch (error) {
          console.error("Error fetching course data:", error);
        }
      }
    };
  }, [Value]);


  const updateUser = async () => {
    const uidToUpdate = userdata?.uid;
    const updatedData = {
      name: newName ? newName : userdata?.name,
      imgUrl: newimgUrl ? newimgUrl : userdata?.profileurl,
      role: selectedRole ? selectedRole : userdata?.role,
    };
    try {
      const updated = await updateUserData(uidToUpdate, updatedData);
      if (updated) {
        alert("Data updated successfully");
        setValue(true)
        handlePopToggle()
        getUserDetailsByUID(UserDetail?.uid)
          .then((userDetails: any) => {
            if (userDetails) {
              const data = {
                name: userDetails?.name,
                email: userDetails?.email,
                uid: userDetails?.uid,
                profileurl: userDetails?.imgUrl,
                login: "true",
                role: userDetails?.role
              };
              localStorage.setItem("userdata", JSON.stringify(data));
              window.open("http://localhost:3000/about", "_self");

            } else {
              console.log("User not found");
            }
          })

      } else {
        alert("Failed to update data");
        handlePopToggle()
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("An error occurred while updating data");
    }
  };

  return (
    <>
      <section className="section-sm">
        <div className="container">
          <div className="row justify-center">
            <div className="text-center md:col-10 lg:col-7">
              <>
                {isPopOpen && (
                  <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Terms of Service
                          </h3>
                          <button type="button" onClick={handlePopToggle} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                          </button>
                        </div>
                        <div className="p-4 md:p-5 space-y-4">
                          Enter your Name : <input type="text" className="rounded" defaultValue={UserDetail?.name} onChange={(event) => setnewName(event.target.value)} /><br />
                          Enter your ImgUrl : <input type="text" className="rounded" defaultValue={UserDetail?.imgUrl} onChange={(event) => setimgUrl(event.target.value)} disabled /><br />
                          {/* Select your Role : <input type="text" defaultValue={UserDetail?.imgUrl} onChange={(event) => setimgUrl(event.target.value)} disabled/> */}
                          <span className="inline-flex">
                            Select your Role :
                            <select
                              style={{ width: "195px", marginLeft: "14px" }}
                              id="countries"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              value={selectedRole}
                              onChange={(event) => setSelectedRole(event.target.value)}
                            >
                              <option value="" disabled selected>
                                Choose your Role
                              </option>
                              <option value="user">user</option>
                              <option value="creator">creator</option>
                            </select>
                          </span>

                        </div>
                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                          <button onClick={updateUser} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                          <button onClick={handlePopToggle} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
              {UserDetail?.imgUrl ?
                <div className="relative mt-3 mb-5">
                  <center>
                    <div className="relative w-24 h-24">
                      <img className="rounded-full border border-gray-100 shadow-sm"
                        src={UserDetail?.imgUrl}
                        alt="user image" />
                      <div onClick={handlePopToggle} className="absolute top-0 right-0 h-6 w-6 my-1 border-4 border-white rounded-full bg-gray-300 z-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style={{ height: "12px", width: "12", padding: "1px", marginTop: "3px" }}>
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </div>
                    </div>
                  </center>
                </div>
                : ""}

              {UserDetail?.name ?
                <h2
                  className="h3 mb-6"
                >Hey, I am {UserDetail?.name}!</h2> : ""}
              <div className="content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis illum nesciunt commodi vel nisi ut alias excepturi ipsum, totam, labore tempora, odit ex iste tempore sed. Fugit voluptatibus perspiciatis assumenda nulla ad nihil, omnis vel, doloremque sit quam autem optio maiores, illum eius facilis et quo consectetur provident dolor similique! Enim voluptatem dicta expedita veritatis repellat dolorum impedit, provident quasi at.
                <p></p>
              </div>
            </div>
          </div>
        </div >
      </section >
    </>
  );
};

export default About;
