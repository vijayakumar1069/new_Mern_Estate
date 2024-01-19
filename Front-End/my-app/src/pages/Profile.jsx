import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signoutStart,
  signoutfailure,
  signoutsuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  //firebase storage
  // service firebase.storage {
  //   match /b/{bucket}/o {
  //     match /{allPaths=**} {
  //       allow read;
  //       allow write:if
  //       request.resource.size<2*1024*1024 &&
  //       request.resource.contentType.matches('image/.*')
  //     }
  //   }
  // }
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [formdata, setFormdata] = useState({});
  const [fileuploadError, setFileuploadError] = useState(false);
  const [updatesuccess, setUpdatesuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [errorshowlisting, setErrorshowlisting] = useState(false);
  const [userlisting, setUserlisting] = useState([]);
  console.log(file);
  console.log(filePerc);
  console.log(formdata);
  useEffect(() => {
    if (file) {
      handlefileupload(file);
    }
  }, [file]);
  const handlefileupload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadtask = uploadBytesResumable(storageRef, file);
    uploadtask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileuploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((downloadURL) => {
          setFormdata({ ...formdata, avatar: downloadURL });
        });
      }
    );
  };
  const handlechange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };
  console.log(formdata);
  const handlesubmit = async (e) => {
    e.preventDefault();

    console.log(currentUser._id);
    try {
      dispatch(updateUserStart());
      console.log(currentUser._id);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdatesuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handledelete = async (e) => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = res.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };
  const handlesignOut = async (e) => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/auth/signout");

      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutfailure(data.message));
        return;
      }
      dispatch(signoutsuccess(data));
    } catch (error) {
      dispatch(signoutfailure(error.message));
    }
  };
  const handleshowlisting = async () => {
    try {
      const res = await fetch(`/api/user/listing/${currentUser._id} `);
      const data = await res.json();
      setErrorshowlisting(false);
      if (data.success === false) {
        setErrorshowlisting(true);
        return;
      }
      setUserlisting(data);
    } catch (error) {
      setErrorshowlisting("shwo listing error");
    }
  };
  const handledelteuserlisting = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserlisting((prev) => prev.filter((listing) => listing._id != id));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto my-7 sm:max-w-xl p-3 bg-slate-100 rounded-xl shadow-lg ">
      <h1 className="text-center font-bold text-2xl uppercase ">Profile</h1>
      <form className="flex flex-col p-3 gap-4" onSubmit={handlesubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="images/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <img
          src={formdata.avartar || currentUser.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="self-center my-5 object-cover w-20 h-20 rounded-full cursor-pointer  "
        />
        {fileuploadError ? (
          <span className="text-red-600 text-center font-bold">
            Error Image Upload (Image must be 2MB)
          </span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span
            className="text-green-6
        00 font-bold text-center"
          >
            uploading {filePerc} % is completed
          </span>
        ) : filePerc == 100 ? (
          <span className="text-green-600 font-bold text-center">
            image successfully uploaded{" "}
          </span>
        ) : (
          ""
        )}

        <input
          type="name"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handlechange}
          id="username"
          className="p-3 border rounded-lg bg-slate-300 focus:outline-none"
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handlechange}
          id="email"
          className="p-3 border rounded-lg bg-slate-300 focus:outline-none"
        />
        <input
          type="password"
          placeholder="password"
          onChange={handlechange}
          id="password"
          className="p-3 border rounded-lg bg-slate-300 focus:outline-none"
        />
        <button
          disabled={loading}
          className="bg-blue-500 p-3 rounded-lg text-white font-semibold"
        >
          {loading ? "loading..." : "UPDATE"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 p-3 text-center hover:opacity-100  rounded-lg text-black font-semibold"
        >
          CREATE LISTING
        </Link>
      </form>

      <div className="flex justify-between">
        <p
          className="text-red-600 mx-3 font-semibold cursor-pointer"
          onClick={handledelete}
        >
          Delete Account
        </p>
        <p
          className="text-red-600 mx-3 font-semibold cursor-pointer"
          onClick={handlesignOut}
        >
          Sign Out
        </p>
      </div>

      <p className="text-red-500 text-center my-2">{error ? error : ""}</p>
      <p className="text-green-700 text-center my-2 font-semibold ">
        {updatesuccess ? "user updated successfully....." : ""}
      </p>

      <button onClick={handleshowlisting} className="text-green-700 w-full">
        Show listings
      </button>

      {errorshowlisting ? (
        <p className="text-red-600 mt-5">{errorshowlisting}</p>
      ) : (
        ""
      )}

      {userlisting && userlisting.length > 0 && (
        <div className="">
          <h1 className="text-2xl font-bold text-center">Your Listings</h1>
          {userlisting.map((listing) => (
            <div
              key={listing._id}
              className="flex flex-col gap-5 p-3 my-10   rounded-lg border border-gray-600"
            >
              <div className="flex gap-3 items-center  p-5    justify-between flex-1  ">
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt=""
                    className="w-16 h-16  object-contain"
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <h3 className="hover:underline w-20 font-semibold truncate flex-1 ">
                    {listing.name}
                  </h3>
                </Link>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      handledelteuserlisting(listing._id);
                    }}
                    className="p-2 text-red-700 border rounded-lg hover:opacity-90"
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="p-2 text-green-700 border rounded-lg hover:opacity-90">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
