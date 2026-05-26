import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await API.get("/user/profile");
        const role = res.data.response.role;

        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/vote");
        }

      } catch (err) {
        localStorage.removeItem("token");
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {

    if (!data.username || !data.password) {
      return alert("Please enter username and password");
    }

    try {
      const res = await API.post("/user/login", data);

      if (!res.data.token) {
        return alert("Login failed: No token received");
      }

      // Save token first
      localStorage.setItem("token", res.data.token);

      // Get user profile V.IM
      const profile = await API.get("/user/profile");

      const role = profile.data.response.role;

      alert("Login success");

      //Redirect based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/vote");
      }

    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // const handleLogin = async () => {

  //   if (!data.username || !data.password) {
  //     return alert("Please enter username and password");
  //   }

  //   try {
  //     const res = await API.post("/user/login", data);

  //     console.log("LOGIN RESPONSE:", res.data);

  //     if (!res.data.token) {
  //       return alert("Login failed: No token received");
  //     }

  //     localStorage.setItem("token", res.data.token);

  //     alert("Login success");
  //     navigate("/vote");

  //   } catch (err) {
  //     console.log("ERROR:", err.response?.data);
  //     alert(err.response?.data?.message || "Login failed");
  //   }
  // };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setData({ ...data, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;