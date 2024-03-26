"use client"
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { userRegistration,getUserDetailsByUID } from '@/api/Api';
import { signIn } from 'next-auth/react';
const Registration = () => {
    const [emailid, setEmailid] = useState("");
    const [passwords, setPasswords] = useState("");
    const [organization_id,setorganization_id]= useState();
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const organizationId:any = searchParams.get('organization_id');
        if (organizationId) {
          console.log("Organization ID:", organizationId);
          setorganization_id(organizationId)
        }
      }, []);
    const addNewUser = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, emailid, passwords).then(async (res: any) => {
            if (res?.operationType === "signIn") {
                try {
                    const result = await signInWithEmailAndPassword(auth, emailid, passwords);
                    if (result.user) {
                        const uidToCheck = result.user.uid;
                        const courses: any = [];
                        const imgUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                        const email: any = result?.user?.email;
                        const username = email?.split('@')[0];
                        const name: string = username;
                        const role: string = "user";
                        const uid = uidToCheck;
                        const organisation = organization_id;
                        userRegistration(courses, imgUrl, email, name, role, uid, organisation).then((added) => {
                            if (added) {
                                alert("User Added");
                                signIn('credentials', { email, passwords, redirect: true, callbackUrl: '/' });
                                getUserDetailsByUID(uid)
                                    .then((userDetails: any) => {
                                        if (userDetails) {
                                            const data = {
                                                name: userDetails?.name,
                                                email: userDetails?.email,
                                                profileurl: userDetails?.imgUrl,
                                                uid: userDetails?.uid,
                                                login: "true",
                                                role: userDetails?.role,
                                                organisation_id: userDetails?.organisation_id
                                            };
                                            localStorage.setItem("userdata", JSON.stringify(data));
                                            window.open("http://localhost:3000/", "_self");
                                        } else {
                                            console.log("User not found");
                                        }
                                    })
                            }
                        });
                    }
                } catch (error) {
                    console.error("Login error:", error);
                }
            }
        })
    }

    return (
        <center>
            <div className="p-10" style={{ width: "50%", textAlign: "left" }}>
                <div className="flex justify-between md:p-3 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Account Registration
                    </h3>

                </div>
                <form onSubmit={addNewUser}>
                    <div className="mb-5">
                        <label className="ml-2 mr-2 mt-5 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                            Enter User Email-id :
                        </label>
                        <input
                            type="text"
                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => setEmailid(e.target.value)}
                            placeholder="Enter User Email-id"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                            Password :
                        </label>
                        <input
                            type="text"
                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => setPasswords(e.target.value)}
                            placeholder="Enter Password"
                        />
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                    </div>
                </form>
            </div>
        </center>

    );
};

export default Registration;