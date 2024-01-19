import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const handlesubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchtermfromurl = urlParams.get("searchTerm");
    if (searchtermfromurl) {
      setSearchTerm(searchtermfromurl);
    }
  }, [location.search]);
  return (
    <header className="bg-gray-300 shadow-md p-4">
      <div className="flex justify-between max-w-6xl items-center  mx-auto">
        <Link to="/">
          <h1 className="font-bold flex items-center text-sm sm:text-lg  flex-wrap">
            <span className="text-blue-700">VIJAY</span>
            <span className="text-red-700">ESTATE</span>
          </h1>
        </Link>
        <form
          onSubmit={handlesubmit}
          className="flex items-center bg-slate-200 p-3"
        >
          <input
            type="text"
            placeholder="search..."
            className="text-sm sm:text-lg focus:outline-none bg-transparent rounded-lg w-24 sm:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button>
            {" "}
            <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex gap-8">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profilr"
                className="object-cover h-7 w-7 rounded-full"
              />
            ) : (
              <li className=" text-slate-700 hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
