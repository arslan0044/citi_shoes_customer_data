"use client";
import React, { useState, useEffect, useCallback } from "react";
import Search from "../../components/Search";
import Link from "next/link";
import exportFromJSON from "export-from-json";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

type DataType = {
  name: string;
  city: string;
  number: string;
  _id: string;
};
export default function Page() {
  const [data, setData] = useState<DataType[]>([]); // Explicitly type the state
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [verify, setVerify] = useState(<></>);
  const [pass, setPass] = useState("");
  // const [data, setData] = useState<DataType[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [hasMore, setHasMore] = useState(true);
  // const [page, setPage] = useState(1);
  const [searchActive, setSearchActive] = useState(false);
  // const [password, setPassword] = useState("");

  const fetchData = useCallback(async () => {
    if (loading || !hasMore || searchActive) return;
    setLoading(true);
    try {
      const response = await axios.get("/api/data", {
        params: { page, limit: 10 },
      });
      const fetchedData = response.data.data;
      if (Array.isArray(fetchedData) && fetchedData.length === 0) {
        setHasMore(false);
      } else if (Array.isArray(fetchedData)) {
        setData((prev) => [...prev, ...fetchedData]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, searchActive]);

  useEffect(() => {
    if (!searchActive) fetchData();
  }, [fetchData, searchActive]);

  const handleDownloadData = () => {
    setVerify(
      <input
        type="text"
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => setPass(e.target.value)}
        placeholder="Enter Right Password Its Download automatically "
      />
    );
    if (pass === "@AdminPass") {
      const fileName = "NewNumberData";
      const exportType = exportFromJSON.types.csv;
      exportFromJSON({
        data,
        fileName,
        fields: ["number", "name"],
        exportType,
      });
    } else {
      toast.error("Invalid password. File download failed.");
    }
  };

  const handleSearchResults = (results: DataType[]) => {
    setSearchActive(true);
    setData(Array.isArray(results) ? results : []);
    setHasMore(false); // Stop infinite scroll when search is active
  };

  const resetSearch = () => {
    setSearchActive(false);
    setData([]);
    setPage(1);
    setHasMore(true);
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchData();
    }
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return (
    <section className="mx-auto max-w-screen-lg px-4 mt-6">
      <Toaster />
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-center">
        <button
          className="w-full sm:basis-1/4 py-4 text-white bg-gradient-to-r from-black to-gray-700 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none text-lg font-semibold text-center rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
          onClick={handleDownloadData}
        >
          Download Data
        </button>

        <Search
          getSearchResults={(results: DataType[]) => handleSearchResults(results)}
        />

        <Link
          href="/"
          className="w-full sm:basis-1/4 py-4 text-white bg-gradient-to-l from-black to-gray-700 hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-300 focus:outline-none text-lg text-center font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Add New Number
        </Link>
      </div>

      {verify}
      <div className="flex items-center w-full">
        {data.length === 0 && !loading ? (
          <p className="text-center text-lg">No data available</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white shadow-md rounded-xl">
              <thead>
                <tr className="bg-blue-gray-100 text-gray-700">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">City</th>
                  <th className="py-3 px-4 text-left">Number</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr className="border-b border-blue-gray-200" key={index}>
                    <td className="py-3 px-4 text-sm md:text-base">
                      {item["name"]}
                    </td>
                    <td className="py-3 px-4 text-sm md:text-base">
                      {item["city"]}
                    </td>
                    <td className="py-3 px-4 text-sm md:text-base">
                      {item["number"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {loading && (
        <div className="flex justify-center w-full py-10">
        <span className="loader"></span>
        </div>
      )}
    </section>
  );
}
