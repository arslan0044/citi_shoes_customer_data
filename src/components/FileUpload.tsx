"use client"
import data from "../data/data.json"
import Link from "next/link";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
function FileUpload() {
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
const handal = (name:string,number:string,city:string)=>{
  setUser({ ...user, number: number })
  setUser({ ...user, name: name })
  setUser({ ...user, city: city })
}
  return (

    <div>
      <>
        <section className=" max-w-screen-xl mx-auto">
          <Toaster />
          <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className=" text-5xl my-5 font-bold">{loading ? "Processing" : "Add Contact Number Form"}</h1>
            <hr />
            {data.map((data) => (
              
              <>
                <input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    setUser({ ...user, city: "Undefined" })
                  }
                  autoFocus 
                  placeholder="name"
                />
                <input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="number"
                  type="text"
                  onChange={(e) =>

                    setUser({ ...user, number: data.number })}
                  value={data.number}
                  placeholder="number"
                />
                <input
                  className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                  id="city"
                  type="text"
                  value={"Undefined"}

                  onChange={(e) => setUser({ ...user, name: data.name })}
                  placeholder="city"
                />

            <button
              onClick={onSignup}
              className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
              {buttonDisabled ? "Complete Form" : "Add Number"}
            </button>
              </>
            ))}
            <Link href="/detail" className="bg-black py-4 px-6 hover:bg-green-600 duration-700 text-white rounded-lg text-lg">Check All number</Link>
          </div>
        </section>

      </>















    </div>
  )
}

export default FileUpload