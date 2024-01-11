"use client";
import React, { useState, useEffect } from "react";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";

const About = () => {
  const [userdata, setuserdata] = useState<any>();
  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    setuserdata(parsedUserData);
  }, []);

  return (
    <>
      <section className="section-sm">
        <div className="container">
          <div className="row justify-center">
            <div className="text-center md:col-10 lg:col-7">
              <ImageFallback
                className="mx-auto mb-6 rounded-lg"
                src={userdata?.profileurl}
                width={200}
                height={200}
                alt="Hey, I am John Doe!"
              />
              <h2
                dangerouslySetInnerHTML={markdownify(`Hey, I am ${userdata?.name}!`)}
                className="h3 mb-6"
              />
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
