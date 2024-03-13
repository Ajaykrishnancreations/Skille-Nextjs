"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBuyersListByAuthor,getCourseWithCourseid,getUserDetailsByUID } from "@/api/Api";

export default function StudyHubList() {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserData: any = localStorage.getItem("userdata");
      const parsedUserData = JSON.parse(storedUserData);
      const buyersList = await getBuyersListByAuthor(parsedUserData?.uid);
      const processedData = await Promise.all(
        buyersList.map(async (buyer:any) => {
          const courseDetails:any = await getCourseWithCourseid(buyer?.course_id);
          const studentDetails:any = await getUserDetailsByUID(buyer?.student_id);
          
          const progressData: any = studentDetails?.courses;
          const authorDetails:any = await getUserDetailsByUID(buyer?.author_id);
          return {
            ...buyer,
            courseTitle: courseDetails?.title,
            studentName: studentDetails?.name,
            authorName: authorDetails?.name,
            progressData: progressData.find((progress: any) => progress.course_id === buyer.course_id),
          };
        })
      );
      setData(processedData);
      console.log(processedData,"studentDetailsstudentDetails");
    };

    fetchData();
  }, []);
  return (
    <div className="p-10">
      <div className="flex">
        <div className="w-5/6">
          <h5>
            Buyers list
          </h5>
        </div>
        <div className="w-1/6">
          <form>
            <input type="search" id="default-search"
              // onChange={(e) => setSearchText(e.target.value)}
              style={{ paddingTop: "10px", paddingLeft: "20px" }}
              className="block w-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by Title, Skills..." required />
          </form>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-5">
        {data.map((item: any) => (
        <div key={item.id} className='p-2 transform transition-transform duration-300 hover:scale-105'>
            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100">
              <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                <p>
                  <b>{item.courseTitle}</b>
                </p>
                <div className="relative">
                  <Link href={{ pathname: '/edituser' }}>{/* Add your link details here */}View</Link>
                </div>
              </div>
              <p className='mt-3 text-sm'><b>Student name:</b> {item.studentName}</p>
              <p className='text-sm'><b>Author Name:</b> {item.authorName}</p>
              <p className='text-sm'><b>Enrolled_date:</b> 03/06/2024</p>
              <p className='text-sm'><b>Progress:</b> {item.progressData?.progress || 0}</p>
            </div>
          </div>
        ))}
        </div>

      </div>
    </div>
  );
}

