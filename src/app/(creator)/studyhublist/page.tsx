"use client"
import StudyHubList from "components/(creator)/studyhublist/page";
import React, { useState, useEffect } from "react";
import Link from "next/link";

function PageNotFound() {
  return (
    <>
      <section className="section-sm text-center">
        <div className="container">
          <div className="row justify-center">
            <div className="sm:col-10 md:col-8 lg:col-6">
              <span className="text-[8rem] block font-bold text-dark dark:text-darkmode-dark">
                404
              </span>
              <h1 className="h2 mb-4">Page not found</h1>
              <div className="content">
                <p>
                  The page you are looking for might have been removed, had its
                  name changed, or is temporarily unavailable.
                </p>
              </div>
              <Link href="/" className="btn btn-primary mt-8">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default function CreatorCourse() {
  const [data, setData] = useState<any>();
  const [value, setvalue] = useState<boolean>(true);
  useEffect(() => {
    setvalue(true)
    const storedUserData: any = localStorage.getItem("userdata");
    const parsedUserData = JSON.parse(storedUserData);
    setData(parsedUserData)
    setvalue(false)
  }, [])
  return (
    <>
      {
        value === true ?
          <center style={{ marginTop: "15%", marginBottom: "15%" }}>
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"></div>
          </center>
          :
          <div>
            {data?.login === "true" ? (
              <>
                {data?.role === "user" ? <PageNotFound /> : <StudyHubList />}
              </>
            ) : (
              <PageNotFound />
            )}
          </div>
      }
    </>
  );
}

