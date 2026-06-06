import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/user/login", data);

      localStorage.setItem("token", res.data.token);

      const profile = await API.get("/user/profile");

      if (profile.data.response.role !== "admin") {
        localStorage.removeItem("token");
        return alert("Not an admin account");
      }

      alert("Admin Login Success ✅");
      navigate("/admin");

    } catch (err) {
      alert("Admin Login Failed");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setData({ ...data, username: e.target.value })
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setData({ ...data, password: e.target.value })
        }
      />

      <button onClick={handleLogin}>
        Login as Admin
      </button>
    </div>
  );
}

export default AdminLogin;