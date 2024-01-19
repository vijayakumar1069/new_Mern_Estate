import React from "react";
import { Link } from "react-router-dom";
import { FaBath, FaBed, FaLocationArrow } from "react-icons/fa";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] ">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 "
        />
        <div className="p-3 flex flex-col w-full">
          <p className="text-slate-700 truncate text-lg font-semibold">
            {listing.name}
          </p>

          <div className=" flex gap-3 items-center">
            <FaLocationArrow size={15} />
            <p className="truncate text-sm text-slate-700 p-2">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-slate-600 line-clamp-3">
            {listing.description}
          </p>
          <p className="mt-2 text-slate-600 font-semibold">
            {" "}
            ${" "}
            {listing.offer
              ? listing.discountprice.toLocaleString("en-US")
              : listing.regularprice.toLocaleString("en-US")}{" "}
              {listing.type==="rent"&&"/Month"}
          </p>
          <div className="flex gap-5 ">
            <div className="flex gap-3 items-center">
                <FaBed size={15}/>
                {listing.bedrooms>1?(<span className="font-semibold">Beds</span>):(<span className="font-semibold">Bed</span>)}
            </div>
            <div className="flex gap-2 items-center">
                <FaBath size={15}/>
                {listing.bathrooms>1?(<span className="font-semibold">Baths</span>):(<span className="font-semibold">Bath</span>)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
