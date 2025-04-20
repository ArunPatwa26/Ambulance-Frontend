import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../context/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${config.BASE_URL}api/auth/login`, {
        email,
        password,
      });

      if (res.data && res.data.user) {
        const { token, role, name, email, phoneNo, id } = res.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem(
          "userdata",
          JSON.stringify({ name, email, role, phoneNo, id })
        );
        window.dispatchEvent(new Event("authChange"));

        // Navigate based on role
        if (role === "Admin") {
          navigate("/admindashboard");
        } else if (role === "Driver") {
          navigate("/driverdashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
