import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux"
import {signInFaliure,signInStart,signInSuccess} from "../redux/user/userSlice.js"
import OAUTH from "../Componenet/OAUTH.jsx";

export default function SignIn() {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState("");
  const{loading,error}=useSelector((state)=>state.user)
  const handlechange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formdata)

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
    
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFaliure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate("/")
     
    } catch (error) {
      dispatch(signInFaliure(error.message));
    }
  };
  return (
    <div className="bg-slate-400 rounded-lg max-w-lg mx-auto p-5 my-5 shadow-lg">
      <h1 className="font-bold  text-blue-800 text-3xl text-center mt-5 p-3">
        SIGN IN
      </h1>
      <form
        className="flex flex-col   gap-5 rounded-lg"
        onSubmit={handlesubmit}
      >
        <input
          type="email"
          placeholder="Email..."
          id="email"
          className="focus:outline-none border p-3 "
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="focus:outline-none border p-3"
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-blue-700 text-white rounded-lg p-3 hover:bg-blue-500"
        >
         {loading?"loading...":"LOGIN"}
        </button>
        <OAUTH/>
      </form>
      <div>
        <p className="flex gap-3 my-3">
          <span>Create Account </span>
          <span className="text-red-900">
            <Link to="/signup">Sign Up</Link>
          </span>
        </p>
      </div>
      {error && <p className="text-red-700 ">{error}</p>}
    </div>
  );
}
