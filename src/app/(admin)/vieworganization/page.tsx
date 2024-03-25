'use client'
import { useEffect, useState } from "react";
import React from "react";
import { useSearchParams } from "next/navigation";
import { getOrganizationbyid } from "@/api/Api";

export default function ViewCourse() {
    const searchParams = useSearchParams();
    const organization_id = searchParams?.get('organization_id')
    const [organization, setorganization] = useState<any>();
    console.log(organization, "organization");
    useEffect(() => {
        getOrganizationbyid(organization_id).then((res) => {
            setorganization(res)
        })
    }, []);
    const shareOptions = () => {
        const mailTo = "mailto:your@email.com";
        const subject = encodeURIComponent("User Registration Request");
        const body = encodeURIComponent(`Dear User,

I hope this email finds you well. I am writing to request user registration for our platform. As a new user, I am eager to access the services and benefits your organization offers. Kindly guide me through the registration process or provide the necessary forms.

Thank you for your prompt attention to this matter.

Sincerely, [Ajay krishnan]

${`http://localhost:3000/registration?organization_id=`+organization?.org_id}`);

        const emailLink = `${mailTo}?subject=${subject}&body=${body}`;
        window.location.href = emailLink;
    };

    return (
        <div>
            <div className="p-10">
                <div className="p-4 md:p-5 space-y-4">
                    <div className="flex">
                        <div className="w-5/6">
                            <h5>Organisation</h5>
                        </div>
                        <div className="w-1/6">
                            <button onClick={shareOptions}>Share Organisation</button>
                        </div>
                    </div>
                    Organisation Name : <b>{organization?.name}</b><br />
                    Organisation id : <b>{organization?.org_id}</b><br />
                    Organisation Mail-id: <b>{organization?.email_id}</b><br />
                    Organisation info: <b>{organization?.info}</b><br />
                </div>
            </div>
        </div >
    );
}

