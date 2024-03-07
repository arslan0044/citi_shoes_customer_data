"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [user, setUser] = React.useState({
    name: "",
    number: "",
    city: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await fetch("api/data", {
  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      toast.success("Your Number Add Sucessfully")
    } catch (error: any) {
      console.log("Signup failed", error.message);

      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.name.length > 0 &&
      user.number.length > 0 &&
      user.city.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <section className=" max-w-screen-xl mx-auto">
      <Toaster />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className=" text-5xl my-5 font-bold">{loading ? "Processing" : "Add Contact Number Form"}</h1>
        <hr />
       
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="name"
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="name"
        />
        <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="number"
          type="text"
          value={user.number}
          onChange={(e) => setUser({ ...user, number: e.target.value })}
          placeholder="number"
        />
         <input
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="city"
          type="text"
          value={user.city}
          onChange={(e) => setUser({ ...user, city: e.target.value })}
          placeholder="city"
        />
        <button
          onClick={onSignup}
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        >
          {buttonDisabled ? "Complete Form" : "Add Number"}
        </button>
        <Link href="/detail" className="bg-black py-4 px-6 hover:bg-green-600 duration-700 text-white rounded-lg text-lg">Check All number</Link>
      </div>
    </section>
  );
}
