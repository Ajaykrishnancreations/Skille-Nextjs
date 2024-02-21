"use client"
import React, { useEffect, useState } from 'react';
import { getUsersDetails } from '@/api/Api';
const AdminConsole = () => {
    const [value, setValue] = useState('1');
    const [UserData, setUserData] = useState<any>()
    const handleChange = (newValue: string) => {
        setValue(newValue);
    };
    useEffect(() => {
        getUsersDetails().then((res: any) => {
            setUserData(res)
        })
    }, [])
    return (
        <div className='p-10'>
            <div>
                <div className="flex">
                    <button
                        onClick={() => handleChange('1')}
                        className={`p-2 ${value === '1' ? 'border-b-4 border-gray-600' : ''
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => handleChange('2')}
                        className={`p-2 ${value === '2' ? 'border-b-4 border-gray-600' : ''
                            }`}
                    >
                        Creator
                    </button>
                </div>
            </div>
            <div className="p-4">
                {value === '1' &&
                    <div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {UserData?.filter((item: any) => item?.role === 'user').map((item: any) => (
                                <div key={item.id}>
                                    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100">
                                        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                                            <p>
                                                <img src={item?.imgUrl} style={{ height: 60, width: 60, borderRadius: "50%" }} alt="User Profile"></img>
                                            </p>
                                            <div className="relative">
                                                <button
                                                    className="text-black bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                                    type="button"
                                                >
                                                    Edit User
                                                </button>
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
                {value === '2' &&
                    <div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {UserData?.filter((item: any) => item?.role === 'creator').map((item: any) => (
                                <div key={item.id}>
                                    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100">
                                        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                                            <p>
                                            <img src={item?.imgUrl} style={{ height: 60, width: 60, borderRadius: "50%" }} alt="User Profile"></img>
                                            </p>
                                            <div className="relative">
                                                <button
                                                    className="text-black bg-gray-100 hover:bg-gray-200 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center"
                                                    type="button"
                                                >
                                                    Edit User
                                                </button>
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
            </div>
        </div>
    );
};

export default AdminConsole;