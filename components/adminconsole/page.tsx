"use client"
import React, { useEffect, useState } from 'react';
import { getUsersDetails, updateUserData } from '@/api/Api';
import Link from 'next/link';
const AdminConsole = () => {
    const [value, setValue] = useState('1');
    const [UserData, setUserData] = useState<any>()
    const handleChange = (newValue: string) => {
        setValue(newValue);
    };
    const [Values, setValues] = useState<boolean>(false);
    const [newName, setnewName] = useState<string>();
    const [selectedRole, setSelectedRole] = useState<string>();
    const [selectedUser, setUserDatas] = useState<any>(null);
    const openModal = (item: any) => {
        setUserDatas(item);
    };
    const closeModal = () => {
        setUserDatas(null);
    };
    useEffect(() => {
        getUsersDetails().then((res: any) => {
            setUserData(res)
        })
    }, [Values])

    const updateUser = async () => {
        const uidToUpdate = selectedUser?.uid;
        const updatedData = {
            name: newName ? newName : selectedUser?.name,
            role: selectedRole ? selectedRole : selectedUser?.role,
        };
        const updated = await updateUserData(uidToUpdate, updatedData);
        if (updated) {
            alert("Data updated successfully");
            closeModal()
            setValues(true)
        }

    }
    return (
        <div className='p-10'>
            <div>
                <div className="flex">
                    <button
                        onClick={() => handleChange('1')}
                        className={`p-2 ${value === '1' ? 'font-bold' : ''
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => handleChange('2')}
                        className={`p-2 ${value === '2' ? 'font-bold' : ''
                            }`}
                    >
                        Creator
                    </button>
                </div>
            </div>
            <div>
                {value === '1' &&
                    <div className="grid grid-cols-5">
                        {UserData?.filter((item: any) => item?.role === 'user').map((item: any) => (
                            <div key={item.id} className='p-2'>
                                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100">
                                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                                        <p>
                                            <img src={item?.imgUrl} style={{ height: 60, width: 60, borderRadius: "50%" }} alt="User Profile"></img>
                                        </p>
                                        <div className="relative">
                                            <Link
                                                href={{
                                                    pathname: '/edituser',
                                                    query: { user_uid: item?.uid }
                                                }}>
                                                {/* <button
                                                    className="text-black bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                                    type="button"
                                                    onClick={() => openModal(item)}
                                                > */}
                                                Edit User
                                                {/* </button> */}
                                            </Link>
                                        </div>
                                    </div>
                                    <p className='mt-3'><b>Name :</b> {item?.name}</p>
                                    <p><b>Email :</b>  {item?.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                }
                {value === '2' &&
                    <div>
                        <div className="grid grid-cols-5">
                            {UserData?.filter((item: any) => item?.role === 'creator').map((item: any) => (
                                <div key={item.id} className='p-2'>
                                    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100">
                                        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                                            <p>
                                                <img src={item?.imgUrl} style={{ height: 60, width: 60, borderRadius: "50%" }} alt="User Profile"></img>
                                            </p>
                                            <div className="relative">
                                                <Link
                                                    href={{
                                                        pathname: '/edituser',
                                                        query: { user_uid: item?.uid }
                                                    }}>
                                                    {/* <button
                                                    className="text-black bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                                    type="button"
                                                    onClick={() => openModal(item)}
                                                > */}
                                                    Edit User
                                                    {/* </button> */}
                                                </Link>
                                            </div>
                                        </div>
                                        <p className='mt-3'><b>Name :</b> {item?.name}</p>
                                        <p><b>Email :</b>  {item?.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                <>
                    <>
                        {selectedUser && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Terms of Service
                                            </h3>
                                            <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                </svg>
                                                <span className="sr-only">Close modal</span>
                                            </button>
                                        </div>
                                        <div className="p-4 md:p-5 space-y-4">
                                            Enter your Name : <input type="text" className="rounded" defaultValue={selectedUser?.name} onChange={(event) => setnewName(event.target.value)} /><br />
                                            <span className="inline-flex">
                                                Select your Role :
                                                <select
                                                    style={{ width: "195px", marginLeft: "14px" }}
                                                    id="countries"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    defaultValue={selectedUser?.role}
                                                    onChange={(event) => setSelectedRole(event.target.value)}
                                                >
                                                    <option value="user">user</option>
                                                    <option value="creator">creator</option>
                                                </select>
                                            </span>

                                        </div>
                                        <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                            <button onClick={updateUser} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                            <button onClick={closeModal} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                </>
            </div>
        </div>
    );
};

export default AdminConsole;