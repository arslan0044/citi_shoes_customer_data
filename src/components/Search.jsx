"use client";
import { useState } from "react";

export default function SearchCustomer({ getSearchResults }) {
  const [query, setQuery] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/data/search?query=${query}`, {
      body: JSON.stringify(),
    });
    const name = await response.json();

    getSearchResults(name);
  };
  return (
    <>
      <form className="basis-4/5" onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-black dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-300 focus:border-green-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-300 dark:focus:border-green-300"
            placeholder="Search Customer by Name, City, Number, "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-black hover:bg-green-800 focus:ring-1 focus:outline-none focus:ring-black/35 font-medium rounded-lg text-sm px-4 py-2 duration-700"
          >
            Search
          </button>
        </div>
      </form>
    </>
  );
}
