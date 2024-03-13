"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { addCourseToUser ,addBuyerslist,getCourseWithCourseid} from "@/api/Api";
const page = () => {

  useEffect(() => {
    const buyCourseId = localStorage.getItem("buyCourseId");
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    const uid = parsedUserData?.uid;
    const updatedData = {
      course_id: buyCourseId,
      progress: 0,
      completion_status: false,
      completed_chapters: [],
      enrolled_date: null,
      completion_date: null,
    };
    const updated = addCourseToUser(uid, updatedData);
    if (updated) {
      alert("Course bought successfully");
      getCourseWithCourseid(buyCourseId)
        .then((CourseData) => {
          if (CourseData) {
            const author_id = CourseData?.author?.user_id;
            const course_id = CourseData?.course_id;
            const student_id = uid;
            const payment = `Purchased at: ${CourseData?.price?.newprice}`;
            addBuyerslist(author_id, course_id, student_id, payment);
          } else {
            console.log("CourseData not found");
          }
        });
    } else {
      alert("User has already purchased this course");
    }
  }, []);
  
  return (
    <div className="justify-center items-center text-center">
      <div>You payment has been done successfully</div>
      <p>
        <Link href="/mycourse">
          <u>click here</u>
        </Link>{" "}
        to open course
      </p>
    </div>
  );
};

export default page;
