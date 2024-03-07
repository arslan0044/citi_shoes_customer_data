"use client";
import Search from "../../components/Search";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Page() {
  const [cendor, setCendor] = useState([]);

  useEffect(() => {
    const getCendor = async () => {
      const response = await fetch("/api/data",{
        method: "GET",
      });
      const cendor = await response.json();
      setCendor(cendor);
    };

    getCendor();
  }, []);

  return (
    <section className=" mx-auto max-w-screen-lg">
      <div className="flex flex-row">
        <Search getSearchResults={(results:any) => setCendor(results)} />
        <Link
          href="/"
          className="basis-1/5 p-3 text-white  bg-black duration-700 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 text-lg rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
         Add new Number
        </Link>
      </div>
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
            <tbody className="text-blue-gray-900" key={item._id}>
              <tr className="border-b border-blue-gray-200">
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">{item.city}</td>
                <td className="py-3 px-4">{item.number}</td>

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
