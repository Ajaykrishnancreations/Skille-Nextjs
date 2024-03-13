"use client"
import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase';
import Link from 'next/link';
import { addNewUserData } from '@/api/Api';
const AddNewUser = () => {

    const [emailid, setEmailid] = useState("");
    const [passwords, setPasswords] = useState("");
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
                        addNewUserData(courses, imgUrl, email, name, role, uid).then((added) => {
                            if (added) {
                                alert("User Added");
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
                        Add New User
                    </h3>
                    <Link href="/adminconsole">
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </Link>
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
                    {/* <div className="mb-5">
                        <label className="ml-2 mr-2 mt-5 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                            Enter User Name :
                        </label>
                        <input
                            type="text"
                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            // value={Name}
                            placeholder="Enter user Name"
                            required
                        />
                    </div> */}
                    {/* <div className="mb-5">
                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium dark:text-white">
                            Enter Organisation_id:
                        </label>
                        <input
                            type="text"
                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            name="description"
                            // value={Organisation_id}
                            placeholder="Enter Organisation_id"
                        />
                    </div> */}
                    {/* <div className="mb-5">
                        <label className="ml-2 mr-2 text-gray-600 block mb-2 text-sm font-medium  dark:text-white">
                            Select users Role:
                        </label>
                        <input
                            type="text"
                            className="rounded ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            // value={Role}
                            placeholder="Enter users Role"
                        />
                    </div> */}
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                        <Link href="/adminconsole">
                            <button type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                        </Link>
                    </div>
                </form>
            </div>
        </center>

    );
};

export default AddNewUser;

function getUsersDetails(): any {
    throw new Error('Function not implemented.');
}


function signIn(arg0: string, arg1: { email: any; password: any; redirect: boolean; callbackUrl: string; }) {
    throw new Error('Function not implemented.');
}


function getUserDetailsByUID(uid: any) {
    throw new Error('Function not implemented.');
}
