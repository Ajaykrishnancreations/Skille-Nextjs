"use client"
import React, { useEffect, useState } from 'react';
import { getUsersDetails, addOrganization ,getOrganization} from '@/api/Api';
import Link from 'next/link';
const AdminConsole = () => {
    const [value, setValue] = useState('1');
    const [UserData, setUserData] = useState<any>()
    const handleChange = (newValue: string) => {
        setValue(newValue);
    };
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const openUpdateModal = () => {
        setIsModalUpdateOpen(true);
    };
    const closeUpdateModal = () => {
        setIsModalUpdateOpen(false);
    };
    const [Organization,setOrganization]=useState<any>("")
    useEffect(() => {
        getUsersDetails().then((res: any) => {
            setUserData(res)
        })

        getOrganization().then((res:any)=>{
            setOrganization(res)
            console.log(res,"ressssssss1234567890")
        })
    }, [])
    const [name, setName] = useState<any>("");
    const [email_id, setEmail_id] = useState<any>("");
    const [logoUrl, setlogo_url] = useState<any>("");
    const [org_id, setOrg_id] = useState<any>("jufty7");
    const [info, setinfo] = useState<any>();
    const AddNewOrganization = () => {
        addOrganization(org_id, logoUrl, name, email_id, info).then((res: any) => {
            console.log(res, "resssssss");
        })
    }
    return (
        <div className='p-10'>
            <div className="flex">
                <div className="w-5/6">
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
                    <button
                        onClick={() => handleChange('3')}
                        className={`p-2 ${value === '3' ? 'font-bold' : ''
                            }`}
                    >
                        Organization
                    </button>
                </div>
                <div className="w-1/6">
                    {value === "3" ?
                        <button onClick={openUpdateModal}>Add New Organization</button>
                        :
                        <Link href="/adduser">Add New User</Link>
                    }
                </div>
            </div>
            <div>
                {value === '1' &&
                    <div className="grid grid-cols-5">
                        {UserData?.filter((item: any) => item?.role === 'user').map((item: any) => (
                            <div key={item.id} className='p-2 transform transition-transform duration-300 hover:scale-105'>
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
                                                Edit User
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
                                <div key={item.id} className='p-2 transform transition-transform duration-300 hover:scale-105'>
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
                                                    Edit User
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
                {value === '3' &&
                    <div>
                        <div className="grid grid-cols-5">
                            {Organization.map((item: any) => (
                                <div key={item.id} className='p-2 transform transition-transform duration-300 hover:scale-105'>
                                    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100">
                                        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
                                            <p>
                                                <img src={item?.logoUrl} style={{ height: 60, width: 60, borderRadius: "50%" }} alt="User Profile"></img>
                                            </p>
                                            <div className="relative">
                                                <Link
                                                    href={{
                                                        pathname: '/',
                                                        // pathname: '/edituser',
                                                        // query: { user_uid: item?.uid }
                                                    }}
                                                    style={{ borderRadius: "5px",width:"200px", backgroundColor: "#012938", color: "white", padding: "5px", textAlign: "center", fontSize: 12, marginTop: "10px" }}
                                                    >

                                                    view
                                                </Link>
                                            </div>
                                        </div>
                                        <p className='mt-3'><b>Name :</b> {item?.name}</p>
                                        <p><b>Email :</b>  {item?.email_id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                <>
                    {
                        isModalUpdateOpen && (
                            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white w-full max-w-xl p-4 rounded-lg shadow-lg">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <>
                                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                    Edit Course Chapter
                                                </h3>
                                                <button type="button" onClick={closeUpdateModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                                    </svg>
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                            </div>

                                            <div className="p-4 md:p-5 space-y-4">

                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Organization Name :
                                                    <input
                                                        className="rounded  w-full"
                                                        type="text"
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="Title"
                                                    />
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Organization Email_id :
                                                    <input
                                                        className="rounded w-full"
                                                        type="text"
                                                        onChange={(e) => setEmail_id(e.target.value)}
                                                        placeholder="ImgUrl"
                                                    />
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Organization logo_url :
                                                    <input
                                                        className="rounded w-full"
                                                        type="text"
                                                        onChange={(e) => setlogo_url(e.target.value)}
                                                        placeholder="Summary"
                                                    />
                                                </div>
                                                <div className="ml-2 mr-2 text-gray-600">
                                                    Enter Organization Name :
                                                    <input
                                                        className="rounded w-full"
                                                        onChange={(e) => setinfo(e.target.value)}
                                                        placeholder="level"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                                <button onClick={AddNewOrganization} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save</button>
                                                <button onClick={closeUpdateModal} type="button" className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Close</button>
                                            </div>
                                        </>
                                    </div>
                                </div>
                            </div>
                        )}
                </>
            </div>
        </div>
    );
};

export default AdminConsole;