"use client";
import React, { useState, useEffect } from "react";
import ImageFallback from "@/helpers/ImageFallback";
import { updateUserData, getUserDetailsByUID } from "@/api/Api";

const About = () => {
  const [userdata, setuserdata] = useState<any>();
  const [newName, setnewName] = useState<string>();
  const [UserDetail,setUserDetail] = useState<any>();
  const [Value,setValue] = useState<boolean>(false);
  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    setuserdata(parsedUserData);
    getUserDetailsByUID(parsedUserData?.uid)
      .then((userDetails) => {
        if (userDetails) {
          console.log("User details:", userDetails);
          setUserDetail(userDetails)
          setValue(false)
        } else {
          console.log("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });

  }, [Value]);

  const updateUser = async () => {
    const uidToUpdate = userdata?.uid;
    const updatedData = {
      name: newName,
    };
    try {
      const updated = await updateUserData(uidToUpdate, updatedData);
      if (updated) {
        alert("Data updated successfully");
        setValue(true)

      } else {
        alert("Failed to update data");
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
              
              <input type="text" onChange={(event) => setnewName(event.target.value)} />
              <button onClick={updateUser}>submit</button>
              {UserDetail?.imgUrl ?
                <ImageFallback
                  className="mx-auto mb-6 rounded-lg"
                  src={UserDetail?.imgUrl}
                  width={200}
                  height={200}
                  alt=""
                /> : ""}
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
        </div>
      </section>
    </>
  );
};

export default About;
