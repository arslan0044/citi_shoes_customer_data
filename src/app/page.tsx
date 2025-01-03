"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

interface User {
  name: string;
  city: string;
  number: string;
}

interface Errors {
  name: string;
  city: string;
  number: string;
}

export default function Home() {
  const [user, setUser] = useState<User>({ name: "", number: "", city: "" });
  const [errors, setErrors] = useState<Errors>({ name: "", number: "", city: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Errors = {
      name: user.name.trim() ? "" : "Name is required",
      number: /^\d+$/.test(user.number) ? "" : "Valid number is required",
      city: user.city.trim() ? "" : "City is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err !== "");
  }, [user]);

  useEffect(() => {
    setButtonDisabled(!validateForm());
  }, [validateForm]);

  const AddNumber = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post("/api/data", user, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Your Number Added Successfully");
      setUser({ name: "", number: "", city: "" });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <Toaster />
    <div className="flex flex-col items-center justify-center min-h-screen py-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center">
        {loading ? "Processing..." : "Add Contact Number Form"}
      </h1>
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg">
        {["name", "number", "city"].map((field) => (
          <div key={field} className="mb-4">
            <input
              id={field}
              type="text"
              value={(user as any)[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-invalid={!!errors[field as keyof Errors]}
              aria-describedby={`${field}-error`}
            />
            {errors[field as keyof Errors] && (
              <p
                id={`${field}-error`}
                className="text-red-500 text-xs sm:text-sm mt-1"
              >
                {errors[field as keyof Errors]}
              </p>
            )}
          </div>
        ))}
        <button
          onClick={AddNumber}
          disabled={buttonDisabled || loading}
          className={`w-full p-3 sm:p-4 rounded-lg font-semibold text-sm sm:text-base ${
            buttonDisabled || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Add Number"}
        </button>
        <Link
          href="/detail"
          className="block text-center bg-black py-3 px-4 mt-6 text-sm sm:text-base hover:bg-green-600 transition-colors duration-300 text-white rounded-lg"
        >
          Check All Numbers
        </Link>
      </div>
    </div>
  </section>
  
  );
}
