import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import OAUTH from "../Componenet/OAUTH";

export default function SignUp() {
  const navigate=useNavigate()
  const [formdata, setFormdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handlechange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
    
  };
  const handlesubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formdata)
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }setLoading(false);
      setError(null)
      navigate("/signin")
      console.log(data);
      
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="max-w-lg  p-3 mx-auto bg-slate-200 my-5 rounded-xl">
      <h1 className="font-bold text-3xl text-center mt-5 p-3">Sign Up</h1>
      <form className="flex gap-4 flex-col " onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Username.."
          id="username"
          className="border bg-slate-100 rounded-lg p-3"
          onChange={handlechange}
        />
        <input
          type="email"
          placeholder="email.."
          id="email"
          className="border bg-slate-100 rounded-lg p-3"
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="password.."
          id="password"
          className="border bg-slate-100 rounded-lg p-3"
          onChange={handlechange}
        />
        <button disabled={loading} className="rounded-lg p-3 bg-slate-700 text-white hover:opacity-90 disabled:opacity-60 ">
          {loading?'Loading....':"SIGNUP"}
        </button>
        <OAUTH/>
      </form>
      <div className="mt-2">
        <p>
          Have An Acoount{" "}
          <span className="text-red-700 mx-1">
            <Link to={"/signin"}> SIGN IN</Link>
          </span>
        </p>
      </div>
      {error&& <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
