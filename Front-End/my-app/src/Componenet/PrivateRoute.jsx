import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
}

//----Outlet is used to access the children of private route
//-------Naviagate is Componenet
//-------useNavigate is Hook
