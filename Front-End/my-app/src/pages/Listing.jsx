import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import {
  FaAddressCard,
  FaBath,
  FaBed,
  FaChair,
  FaLocationArrow,
  FaParking,
  FaShare,
} from "react-icons/fa";
import "swiper/css/bundle";
import Contact from "../Componenet/Contact";
export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const params = useParams();
 
  const [totaldiscount, settoaldiscount] = useState(0);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const[contact,setContact] = useState(false)

  useEffect(() => {
    console.log(params.id)
    const fetchlisting = async () => {
      if(params.id===undefined) return console.log("please provide ",params.id)
      const res = await fetch(`/api/listing/getlisting/${params.id}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListing(data);
    };
    fetchlisting();
  }, [params.id]);
 

  return (
    <main>
      {listing && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
      {listing && (
        <div className="flex flex-col  gap-3 justify-start max-w-2xl mx-auto  ">
          <h1 className="text-3xl font-bold p-3 mt-5 text-center text-gold-500">
            {listing.name}{" "}
            <span className="font-extrabold text-amber-800">
              ${listing.regularprice}
            </span>
          </h1>
          <div className=" flex gap-3 items-center">
            <FaLocationArrow className="text-40 text-red-700" />
            <p> {listing.address}</p>
          </div>
          <div className=" flex gap-10 ">
            <p className="border bg-red-600 font-bold p-2 w-40 text-center rounded-lg">
              {listing.type}
            </p>
            {listing.offer && (
              <p className="border p-2 bg-green-700 w-40 text-center font-bold rounded-lg ">
                <span>Discount</span> $
                {+listing.regularprice - +listing.discountprice}
              </p>
            )}
          </div>
          <p className="text-slate-700">
            <span className="font-semibold text-black flex-1">
              Description -{" "}
            </span>
            {listing.description}
          </p>

          <div className="flex gap-10 items-center text-green-900 font-bold">
            <div className="flex gap-5 items-center">
              <FaBed className="text-10" size={40} />
              {+listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </div>
            <div className="flex gap-5 items-center">
              <FaBath className="text-29 " size={40} />
              {+listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </div>
            <div className="flex gap-5 items-center">
              <FaParking className="text-40" size={40} />
              {listing.parking ? "Parking" : "No Parking"}
            </div>
            <div className="flex gap-5 items-center">
              <FaChair className="text-39" size={40} />
              {listing.furnished ? "Furnished" : "No Furnished"}
            </div>
          </div>
          {currentUser && currentUser._id !== listing.userRef && (
            <button onClick={()=>setContact(true)} className="p-3 bg-slate-700 hover:opacity-95 uppercase rounded-lg text-white ">
              Contact landlord
            </button>
          )}
          {contact && <Contact listing={listing}/>}
        </div>
      )}
    </main>
  );
}
