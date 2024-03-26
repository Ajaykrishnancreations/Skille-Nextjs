"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { addCourseToUser, addBuyerslist, getCourseWithCourseid } from "@/api/Api";

const page = () => {
  const [CourseData, setCourseData] = useState("");
  const [transactionId, settransactionId] = useState("");
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const transactionId = searchParams.get('transactionId');
    if (transactionId) {
      console.log("Organization ID:", transactionId);
      settransactionId(transactionId)
    }
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
      getCourseWithCourseid(buyCourseId).then((CourseData) => {
        setCourseData(CourseData);
        if (CourseData) {
          const author_id = CourseData?.author?.user_id;
          const course_id = CourseData?.course_id;
          const student_id = uid;
          const payment = CourseData?.price?.newprice;
          addBuyerslist(author_id, course_id, student_id, payment);
        } else {
          console.log("CourseData not found");
        }
      });
    } else {
      alert("User has already purchased this course");
    }
  }, []);

  const printDiv = (divId) => {
    const printableArea = document.getElementById(divId);
    if (printableArea) {
      const printContents = printableArea.innerHTML;
      const popupWin = window.open("", "_blank", "width=600,height=600");

      if (popupWin) {
        // popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Payment Receipt</title>
              <style>
                @media print {
                  @page {
                    margin-top: 0;
                    margin-bottom: 0;
                  }
                  header, footer {
                    display: none;
                  }
                }
              </style>
            </head>
            <body onload="window.print();">
            <div style="padding:20px;">
            ${printContents}
            </div>
            </body>
          </html>
        `);
        popupWin.document.close();
      }
    } else {
      console.error(`Element with ID '${divId}' not found.`);
    }
  };

  return (
    <div className="justify-center items-center text-center">
      <div>You payment has been done successfully</div>
      <p>
        <Link href="/mycourse">
          <u>click here</u>
        </Link>{" "}
        to open course
      </p>
      <center>
        <div style={{ width: "70%" }}>
          <div id="printableArea">
            <div style={{ padding: 15 }}>
              <div>
                <div style={{ float: "left" }}>
                  <h2>Invoice</h2>
                </div>
                <div style={{ float: "right", marginTop: 20 }}>
                  <img src="https://avatars.githubusercontent.com/u/132893971?s=200&v=4" style={{ width: 50, height: 50, borderRadius: "50%", marginBottom: 20 }}></img>
                </div>
              </div>
              <img src={CourseData?.imgUrl} style={{ width: "100%", height: "300px", borderRadius: "10px" }}></img>
              <div className="text-left pt-8 pl-5 mb-3">
                <h2>Summary</h2>
                <p>
                  <b>Course Name:</b>
                  {CourseData?.title}
                </p>
                <p>
                  <b>Course id :</b> {CourseData?.course_id}
                </p>
                <p>
                  <b>Author Name :</b> {CourseData?.author?.user_name}
                </p>
                <p>
                  <b>Transactionid:</b> {transactionId}
                </p>
              </div>
              <hr></hr>
              <div className="text-left pt-4 pl-5">
                <h2>Payment Detail</h2>
                <p>{CourseData?.title} </p>
                <p>Price = {CourseData?.price?.oldprice} </p>
                <p>Discount = - {CourseData?.price?.oldprice - CourseData?.price?.newprice} </p>
                <p>Total paid = {CourseData?.price?.newprice} </p>
              </div>
            </div>
          </div>
        </div>
      </center>
      <button style={{ borderRadius: "5px", width: "100px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", marginTop: "10px", fontSize: 12, margin: 5 }} onClick={() => printDiv("printableArea")}>
        Print
      </button>
    </div>
  );
};

export default page;
