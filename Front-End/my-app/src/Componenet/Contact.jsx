import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetching = async () => {
      try {
        const res = await fetch(`/api/user/contact/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
        }
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, [listing.userRef]);
  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Message...."
            className="border w-full p-3 "
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}&body=${message}`}
            className="p-3 bg-slate-700 text-center text-white uppercase hover:opacity-95 rounded-lg"
          >
            send Message
          </Link>
        </div>
      )}
    </div>
  );
}
