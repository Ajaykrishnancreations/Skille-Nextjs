"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { addCourseToUser } from "@/api/Api";

const page = () => {
  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    const buyCourseId = localStorage.getItem("buyCourseId");
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
      alert("course buy successfully");
      // localStorage.removeItem("buyCourseId");
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
