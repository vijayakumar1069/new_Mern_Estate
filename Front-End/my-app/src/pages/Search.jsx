import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../Componenet/ListingItem";
export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const location = useLocation();
  const[shwomore,setShowmore]=useState(false)
  console.log(listings);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    parking: false,
    offer: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
    type: "all",
  });
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchTermfromUrl = urlparams.get("searchTerm");
    const offerfromUrl = urlparams.get("offer");
    const typefromUrl = urlparams.get("type");
    const frunishedfromUrl = urlparams.get("furnished");
    const parkingfromUrl = urlparams.get("parking");
    const orderfromUrl = urlparams.get("order");
    const sortfromUrl = urlparams.get("sort");
    if (
      searchTermfromUrl ||
      offerfromUrl ||
      typefromUrl ||
      parkingfromUrl ||
      frunishedfromUrl ||
      orderfromUrl ||
      sortfromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermfromUrl || "",
        type: typefromUrl || "all",
        parking: parkingfromUrl === "true" ? true : false,
        furnished: frunishedfromUrl === "true" ? true : false,
        sort: sortfromUrl || "createdAt",
        order: orderfromUrl || "desc",
        offer: offerfromUrl === "true" ? true : false,
      });
    }
    const fetchlisting = async () => {
      try {
        setLoading(true);
        const searchQuery = urlparams.toString();

        const res = await fetch(`/api/listing/searching?${searchQuery}`);
        const data = await res.json();
        if(data.length>8)
        {
          setShowmore(true)
        }

        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchlisting();
  }, [location.search]);

  const handlechange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sell"
    ) {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      });
    }
    if (e.target.id === "search") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = sidebardata.searchTerm.trim();
    const encodedSearchTerm = encodeURIComponent(trimmedSearchTerm);
    const urlparams = new URLSearchParams();
    urlparams.set("searchTerm", encodedSearchTerm);
    urlparams.set("order", sidebardata.order);
    urlparams.set("offer", sidebardata.offer);
    urlparams.set("type", sidebardata.type);
    urlparams.set("furnished", sidebardata.furnished);
    urlparams.set("parking", sidebardata.parking);
    urlparams.set("sort", sidebardata.sort);
    const searchQuery = urlparams.toString();

    navigate(`/search?${searchQuery}`);
  };
  const onshowmore=async()=>
  {
    const numberoflistings=listings.length;
    const startindex=numberoflistings;
    const urlparams=new URLSearchParams(location.search)
    urlparams.set("startindex", startindex)
    const searchQuery=urlparams.toString();
    const res=await fetch( `/api/listing/searching?${searchQuery}` );
    const data=await res.json();
    if(data.length <9) {
      setShowmore(false)
    }
    setListings([...listings,...data]);

  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className=" p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handlesubmit} className="flex flex-col gap-8">
          <div className="flex items-center p-2 g-6">
            <label className="whitespace-nowrap font-semibold ">
              {" "}
              Search Term :{" "}
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search..."
              className="p-3 border w-full rounded-lg  ml-5  "
              value={sidebardata.searchTerm}
              onChange={handlechange}
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Type : </label>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "all"}
              />

              <span>Rent & Sale</span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent </span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.type === "sell"}
              />
              <span> Sell</span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className="font-semibold">Amitites : </label>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handlechange}
                checked={sidebardata.furnished}
              />
              <span>Furnished </span>
            </div>
          </div>
          <div className="flex items-center gap-3 ">
            <label className="font-semibold"> Sort : </label>
            <select
              id="sort_order"
              defaultValue={"created_At_desc"}
              onChange={handlechange}
              className="border p-3 rounded-lg bg-slate-400"
            >
              <option value="regularprice_desc"> price high to low </option>
              <option value="regularprice_asc">price low to high</option>
              <option value="created_At_desc">latest</option>
              <option value="created_At_asc"> oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 ">
            search
          </button>
        </form>
      </div>
      <div className="flex flex-col ">
        <h1 className="mt-3 p-3 text-2xl text-slate-700 font-semibold border-b  ">
          Listing Results :{" "}
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {listings.length === 0 && loading === false ? (
            <p className="text-slate-700 text-xl text-center">
              No Listing Found!!!
            </p>
          ) : (
            ""
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full ">
              Loading....
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
            {shwomore&& (
            <button className="text-green-700 hover:underline p-7 w-full text-center" onClick={{onshowmore}}>Show More... </button>)}
        </div>
      </div>
    </div>
  );
}
