import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
  import React, { useEffect, useState } from "react";
  import { app } from "../firebase";
  import { useSelector } from "react-redux";
  import{useNavigate,useParams} from "react-router-dom"
  
  export default function UpdateListing() {
    const params=useParams();
   
    const [files, setFiles] = useState([]);
    const navigate=useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [formdata, setFormdata] = useState({
      imageUrls: [],
      name: "",
      description: "",
      address: "",
      type: "rent",
      regularprice: 50,
      discountprice: 0,
      parking: true,
      furnished: false,
      offer: false,
      bedrooms: 1,
      bathrooms: 1,
    });
    const [imageuploaderror, setImageuploaderror] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(()=>
    {
        const fetchListing=async ()=>
        {
            const res=await fetch(`/api/listing/getlisting/${params.id}`)
            const data=await res.json();
            if(data.success===false)
            {
                console.log(data.message)
                return ; 
            }
            setFormdata(data)
        }
        fetchListing()
    },[])
    const handleImageSubmit = (e) => {
      e.preventDefault();
      if (files.length > 0 && files.length + formdata.imageUrls.length < 7) {
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
        Promise.all(promises)
          .then((urls) => {
            setImageuploaderror(false);
            setFormdata({
              ...formdata,
              imageUrls: formdata.imageUrls.concat(urls),
            });
            setImageuploaderror("image uploaded successfully");
          })
          .catch((error) => {
            setImageuploaderror("image upload failed");
          });
      } else {
        setImageuploaderror("only you can upload 6 images for listing");
      }
    };
  
    //   const storeImage = async (file) => {
    //     return new Promise((resolve, reject) => {
    //       const storage = getStorage(app);
    //       const filename = new Date().getTime() + file.name;
    //       const storageRef = ref(storage, filename);
    //       const uploadtask = uploadBytesResumable(storageRef, filename);
    //       uploadtask.on(
    //         "state_changed",
    //         (snapshot) => {
    //           const progress =
    //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //           console.log(`uploading ${progress} % compleded`);
    //         },
    //         (error) => {
    //           reject(error);
    //         },
    //         () => {
    //           getDownloadURL(uploadtask.snapshot.ref).then((downloadUrl) => {
    //             resolve(downloadUrl);
    //           });
    //         }
    //       );
    //     });
    //   };
    const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const filename = new Date().getTime() + file.name;
        const storageRef = ref(storage, filename);
        const uploadtask = uploadBytesResumable(storageRef, file);
  
        uploadtask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Uploading ${progress.toFixed(2)}% completed`);
          },
          (error) => {
            console.error("Error during upload:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadtask.snapshot.ref)
              .then((downloadUrl) => {
                console.log("Upload completed. Download URL:", downloadUrl);
                resolve(downloadUrl);
              })
              .catch((downloadError) => {
                console.error("Error getting download URL:", downloadError);
                reject(downloadError);
              });
          }
        );
      });
    };
    const handleremoveimage = (index) => {
      setFormdata({
        ...formdata,
        imageUrls: formdata.imageUrls.filter((url, i) => i !== index),
      });
    };
    const handlechange = (e) => {
      if (e.target.id === "rent" || e.target.id === "sell") {
        setFormdata({ ...formdata, type: e.target.id });
      }
      if (
        e.target.id === "parking" ||
        e.target.id === "offer" ||
        e.target.id === "furnished"
      ) {
        setFormdata({
          ...formdata,
          [e.target.id]: e.target.checked,
        });
      }
      if (
        e.target.type === "number" ||
        e.target.type == "textarea" ||
        e.target.type == "text"
      ) {
        setFormdata({
          ...formdata,
          [e.target.id]: e.target.value,
        });
      }
    };
    const handlesubmit = async (e) => {
      e.preventDefault();
      try {
        if (formdata.imageUrls.length < 1) {
          return setError("you must provide at Least One Image");
        }
        if (+formdata.discountprice > formdata.regularprice) {
          return setError("discount price must be lower than regular price");
        }
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/update/${params.id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...formdata,
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
        }
        setLoading(false);
        navigate(`/listing/${data._id}`)
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    return (
      <main className="max-w-4xl  mx-auto my-4 p-3 ">
        <h1 className="text-black font-bold text-3xl text-center">
          Update Listing
        </h1>
  
        <form
          onSubmit={handlesubmit}
          className="flex flex-col sm:flex-row mx-3  gap-5"
        >
          <div className=" flex gap-4 my-5 flex-col flex-1">
            <input
              type="text"
              placeholder="name"
              id="name"
              required
              maxLength="62"
              minLength="10"
              className="rounded-lg  border-gray-400 p-3"
              onChange={handlechange}
              value={formdata.name}
            />
            <textarea
              type="text"
              placeholder="discritpion"
              id="description"
              required
              className="rounded-lg  border-gray-400 p-3"
              onChange={handlechange}
              value={formdata.description}
            />
            <input
              type="text"
              placeholder="address"
              id="address"
              required
              className="rounded-lg  border-gray-400 p-3"
              onChange={handlechange}
              value={formdata.address}
            />
  
            <div className="flex  flex-wrap gap-5  ">
              <div className=" flex gap-4 ">
                <input
                  type="checkbox"
                  id="sell"
                  className="w-7"
                  onChange={handlechange}
                  checked={formdata.type === "sell"}
                />
                <span>Sell</span>
              </div>
              <div className=" flex gap-3 ">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-7"
                  onChange={handlechange}
                  checked={formdata.parking}
                />
                <span>parking</span>
              </div>
              <div className=" flex gap-3 ">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-7"
                  onChange={handlechange}
                  checked={formdata.offer}
                />
                <span>offer</span>
              </div>
              <div className=" flex gap-3 ">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-7"
                  onChange={handlechange}
                  checked={formdata.furnished}
                />
                <span>furnished</span>
              </div>
              <div className=" flex gap-3 ">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-7"
                  onChange={handlechange}
                  checked={formdata.type === "rent"}
                />
                <span>rent</span>
              </div>
            </div>
            <div className="flex  gap-6 flex-wrap  my-5 ">
              <div className="flex gap-4 items-center ">
                <input
                  required
                  type="number"
                  id="bedrooms"
                  minLength="1"
                  maxLength="10"
                  className="w-20 border-gray-400 p-3"
                  onChange={handlechange}
                  value={formdata.bedrooms}
                />
                <span>Beds</span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  required
                  type="number"
                  id="bathrooms"
                  minLength="1"
                  maxLength="10"
                  className="w-20 border-gray-400 p-3"
                  onChange={handlechange}
                  value={formdata.bathrooms}
                />
                <span>Baths</span>
              </div>
            </div>
            <div className="flex gap-5 items-center sm:flex-row flex-wrap">
              <div className="flex gap-5">
                <input
                  type="number"
                  className="p-3 w-30 border-gray-400 "
                  min="50"
                  max="10000000"
                  onChange={handlechange}
                  value={formdata.regularprice}
                  id="regularprice"
                />
                <div className="flex flex-col">
                  <span>Regular Price</span>
                  {formdata.type === "sell" ? (
                    <span>($)</span>
                  ) : (
                    <span>($/Month)</span>
                  )}
                </div>
              </div>
              {formdata.offer === true && (
                <div className="flex gap-5">
                  <input
                    type="number"
                    className="p-3 w-30 border-gray-400 "
                    min="0"
                    max="100000"
                    id="discountprice"
                    onChange={handlechange}
                    value={formdata.discountprice}
                  />
                  <div className="flex flex-col">
                    <span>Discount Price</span>
                    <span>($/Month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="my-5 flex flex-col gap-4 flex-1 ">
            <span className="text-black font-semibold ml-2 ">Images:</span>
            <span>
              The first image will be the cover{" "}
              <span className="text-red-500">(max6)</span>
            </span>
  
            <div className="flex gap-3">
              <input
                type="file"
                onChange={(e) => {
                  setFiles(e.target.files);
                }}
                className="w-full p-3 border border-gray-400 rounded-lg "
                accept="images/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                className="border p-3 text-green-500 hover:shadow-lg disabled:opacity-80 uppercase "
              >
                UPLOAD
              </button>
            </div>
            <p className="text-red-700 font-semibold">
              {imageuploaderror && imageuploaderror}
            </p>
            {formdata.imageUrls.length > 0 &&
              formdata.imageUrls.map((urls, index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={urls}
                    alt=""
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleremoveimage(index)}
                    className="p-3 rounded-lg uppercase text-red-700 hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>
              ))}
  
            <button disabled={loading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              {loading ? "Updating" : "Update Listing.."}
            </button>
            {error && (
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            )}
          </div>
        </form>
      </main>
    );
  }
  