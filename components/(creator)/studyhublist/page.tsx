"use client"
import React, { useState, useEffect } from "react";
import { getBuyersListByAuthor, getCourseWithCourseid, getUserDetailsByUID } from "@/api/Api";
import CircularProgressChartjs from "@/app/CircularProgressChartjs";
import CircularProgressChart from "@/app/CircularProgressChart";
import { useSearchParams } from "next/navigation";

export default function StudyHubList() {
  const searchParams = useSearchParams();
  const Course_id: any = searchParams?.get('Course_id')
  const UserUid: any = searchParams?.get('UserUid')
  const [data, setData] = useState<any>([]);
  const [countData, setCountData] = useState<any>({ organization: 0, admin: 0, purchased: 0 });
  const [UserName, setUserName] = useState<string>()

  useEffect(() => {
    const fetchData = async () => {
      const storedUserData: any = localStorage.getItem("userdata");
      const parsedUserData = JSON.parse(storedUserData);

      let buyersList = await getBuyersListByAuthor(UserUid ? UserUid : parsedUserData?.uid);
      if (Course_id) {
        buyersList = buyersList.filter((item: any) => item.course_id === Course_id);
      }
      const count = buyersList.reduce((acc: any, buyer: any) => {
        if (buyer.payment === "Free within organization") {
          acc.organization++;
        } else if (buyer.payment === "Enrolled by the admin") {
          acc.admin++;
        } else {
          acc.purchased++;
          const paymentValue = parseInt(buyer.payment);
          if (!isNaN(paymentValue)) {
            acc.totalPayment += paymentValue;
          } else {
            console.log("Invalid payment value:", buyer.payment);
          }
        }
        return acc;
      }, { organization: 0, admin: 0, purchased: 0, totalPayment: 0 });
      setCountData(count);

      const totalPurchased = buyersList.reduce((total: number, buyer: any) => {
        if (buyer.payment === "399") {
          total += parseInt(buyer.payment);
        }
        return total;
      }, 0);
      const processedData = await Promise.all(
        buyersList.map(async (buyer: any) => {
          const courseDetails: any = await getCourseWithCourseid(buyer?.course_id);
          const studentDetails: any = await getUserDetailsByUID(buyer?.student_id);
          const progressData: any = studentDetails?.courses;
          // const authorDetails: any = await getUserDetailsByUID(buyer?.author_id);
          return {
            ...buyer,
            courseTitle: courseDetails?.title,
            studentName: studentDetails?.name,
            // authorName: authorDetails?.name,
            progressData: progressData.find((progress: any) => progress.course_id === buyer.course_id),
          };
        })
      );
      setData(processedData);
    };
    if (UserUid) {
      getUserDetailsByUID(UserUid).then((res: any) => {
        setUserName(res?.name)
      })
    }

    fetchData();
  }, []);
  return (
    <div className="p-10">
      {UserUid ? <h5 className="mb-3">{UserName}'s Revenue</h5> : null}
      <div className="flex p-2 border-solid border-2 rounded border-gray-600">
        <div className="w-3/6 bg-gray-100 p-4 rounded">
          <CircularProgressChartjs organization={countData.organization} admin={countData.admin} purchased={countData.purchased} />
        </div>
        <div className="w-3/6">
          <center>
            <div style={{ marginTop: "10%" }}>
              <h5>Total Number of students enrolled {UserUid ? <span>{UserName}'s</span> : "your"} course.</h5>
              <h2>No.{countData.organization + countData.admin + countData.purchased} </h2>
            </div>
            <div className="mt-8">
              <h5>The Total Revenue {UserUid ? <span>{UserName}</span> : "you"}  earned from enrollment.</h5>
              <h2>₹ {countData.totalPayment}</h2>
            </div>
          </center>
        </div>
      </div>
      <div className="flex mt-8">
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
                  <div className="relative" style={{ height: 50, width: 50, marginTop: "-20px" }}>
                    <CircularProgressChart progress={item.progressData?.progress || 0} ></CircularProgressChart>
                  </div>
                </div>
                <p className='mt-3 text-sm'><b>Student name:</b> {item.studentName}</p>
                {/* <p className='text-sm'><b>Author Name:</b> {item.authorName}</p> */}
                <p className='text-sm'><b>Enrolled_date:</b> 03/06/2024</p>
                <p className='text-sm'><b>Progress:</b> {item.progressData?.progress || 0}%</p>
                <p className='text-sm'><b>Payment:</b> {item?.payment}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

