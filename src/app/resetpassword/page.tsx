"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const resetPassword = async () => {
    try {
      if (password !== confirmpassword) {
        throw new Error("Passwords do not match");
      }
      const res = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });
      router.push("/login");
      console.log(res.data);
    } catch (error: any) {
      console.log(error.message);
      setError(true);
    }
  };

  useEffect(() => {
    const url = window.location.search;
    const token = url.split("=")[1];
    setToken(token || "");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {token && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl">Reset Password</h1>
          <h2 className="p-2 bg-orange-500 text-black">
            {token ? `${token}` : "no token"}
          </h2>
          <label htmlFor="password">Password</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            type="password"
            id="confirmpassword"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="confirm password"
          />
          <button onClick={resetPassword}>Submit</button>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black"> Error</h2>
        </div>
      )}
    </div>
  );
}
