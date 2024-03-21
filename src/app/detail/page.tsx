"use client";
import React from "react";
import Search from "../../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";
import exportFromJSON from "export-from-json";
import toast, { Toaster } from "react-hot-toast";

export default function Page() {
  const [cendor, setCendor] = useState([]);
  const [verify,setVerify]=useState(<></>)
  const [pass ,setPass] = useState('')

  useEffect(() => {
    const getCendor = async () => {
      const response = await fetch("/api/data", {
        method: "GET",
      });
      const cendor = await response.json();
      setCendor(cendor);
    };

    getCendor();
  }, []);

  const handalDownloadData = () => {
    setVerify(<input type="text"
    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    
    onChange={(e)=>setPass(e.target.value)} placeholder="Enter Right Password Its Download automatically "/>)
    const name:string = pass
    if(name === "@AdminPass"){
      const data = cendor;
      const fileName = "AllData";
      const exportType = exportFromJSON.types.csv;
      exportFromJSON({ data, fileName, fields: ["name", "number"], exportType });
    }else{
      toast.success("Thanks to Dowanload File")
    }
  };

  return (
    <section className=" mx-auto max-w-screen-lg">
       <Toaster />
      <div className="flex flex-row">
        <button
          className="basis-1/5 p-3 text-white  bg-black duration-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 text-lg rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={handalDownloadData}
        >
          Download
        </button>
        <Search getSearchResults={(results: any) => setCendor(results)} />
        <Link
          href="/"
          className="basis-1/5 p-3 text-white  bg-black duration-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 text-lg rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add new Number
        </Link>
      </div>
      <br />
      <br />
      {verify}
      <div className=" max-w-screen-sm"></div>
      <div className="flex items-center w-full ">
        <div className="overflow-x-auto">
          <table className="mini-w-full bg-white shadow-md rounded-xl">
            <thead>
              <tr className="bg-blue-gray-100 text-gray-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">City</th>
                <th className="py-3 px-4 text-left">Number</th>
              </tr>
            </thead>

            {cendor.map((item) => (
              <tbody className="text-blue-gray-900" key={item["_id"]}>
                <tr className="border-b border-blue-gray-200">
                  <td className="py-3 px-4">{item["name"]}</td>
                  <td className="py-3 px-4">{item["city"]}</td>
                  <td className="py-3 px-4">{item["number"]}</td>
                </tr>
              </tbody>
            ))}
            <tbody></tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
