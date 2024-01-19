import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Navigation } from "swiper/modules";

import SwiperCore from "swiper";
import ListingItem from "../Componenet/ListingItem";

export default function Home() {
  const [offerlisting, setOfferlisting] = useState([]);
  const [rentlisting, setRentlisting] = useState([]);
  const [selllisting, setSelllisting] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerlisting);
  useEffect(() => {
    const offerfetching = async () => {
      try {
        const res = await fetch(`/api/listing/searching?offer=true&limit=4`);
        const data = await res.json();
        setOfferlisting(data);
        fetchrentlisting();
      } catch (error) {}
    };
    const fetchrentlisting = async () => {
      try {
        const res = await fetch(`/api/listing/searching?type=rent&limit=4`);
        const data = await res.json();
        setRentlisting(data);
        fetchselllisting();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchselllisting = async () => {
      try {
        const res = await fetch(`/api/listing/searching?type=sell&limit=4`);
        const data = await res.json();
        setSelllisting(data);
      } catch (error) {
        console.log(error);
      }
    };
    offerfetching();
  }, []);
  return (
    <div>
      {/* top */}
      <div className=" flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 text-3xl lg:text-6xl font-bold  ">
          Find your next <span className="text-slate-500">Perfect </span> <br />
          place with ease{" "}
        </h1>

        <div className="text-gray-400 text-xs sm:text-sm  ">
          vijay's estate is the best place to find your next perfect place to
          live
          <br />
          we have wide range of properites for you to choose from
        </div>
        <Link
          to={"/search"}
          className="text-xs text-blue-600 sm:text-sm font-bold hover:underline "
        >
          lets start now...{" "}
        </Link>
      </div>
      <Swiper navigation>
        {offerlisting &&
          offerlisting.length > 0 &&
          offerlisting.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat `,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl flex flex-col mx-auto my-7 p-3 gap-10 ">
        {offerlisting && offerlisting.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
              <Link to={"/search?offer=true"} className="text-sm text-blue-800 hover:underline ">Show more Offers..</Link>
            </div>
            <div className="flex flex-wrap gap-10 ">
              {offerlisting.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentlisting && rentlisting.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Rent Offers</h2>
              <Link to={"/search?type=rent"} className="text-sm text-blue-800 hover:underline ">Show more Offers..</Link>
            </div>
            <div className="flex flex-wrap gap-10 ">
              {rentlisting.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {selllisting && selllisting.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Sell Offers</h2>
              <Link to={"/search?type=sell"} className="text-sm text-blue-800 hover:underline ">Show more Offers..</Link>
            </div>
            <div className="flex flex-wrap gap-10 ">
              {selllisting.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
