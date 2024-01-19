// import React from "react";

// import { GoogleAuthProvider, getAuth, signInWithPopup } from "@firebase/auth";
// import { app } from "../firebase";
// import { useDispatch } from "react-redux";
// import { signInSuccess } from "../redux/user/userSlice.js";
// export default function OAUTH() {
//   const handleGoogleClick = async () => {
//     const dispatch = useDispatch();
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);
//       const result = await signInWithPopup(auth, provider);
//       console.log(result);
//       const res = await fetch("/api/auth/google", {
//         method: "POST",
//         "content-type": "application/json",
//         body: JSON.stringify({
//           username: result.user.displayName,
//           email: result.user.email,
//           photo: result.user.photoURL,
//         }),
//       });
//       const data = await res.json();
//       console.log(data)
//       dispatch(signInSuccess(data));

//     } catch (error) {
//       console.log("could not connect to Google", error);
//     }
//   };
//   return (
//     <button
//       type="button"
//       className="text-white bg-red-600 uppercase p-3 hover:opacity-90 rounded-lg"
//       onClick={handleGoogleClick}
//     >
//       continue with google
//     </button>
//   );
// }
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log('could not sign in with google', error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}