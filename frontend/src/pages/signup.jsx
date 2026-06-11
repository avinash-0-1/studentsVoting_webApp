import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    id: "",
    username: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      if (
        !form.name ||
        !form.id ||
        !form.username ||
        !form.password
      ) {
        return alert("Please fill all fields");
      }

      const res = await API.post("/user/signup", form);

      localStorage.setItem("token", res.data.token);

      alert("Signup successful ✅");

      navigate("/vote");

    } catch (err) {
      console.log("SIGNUP ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Signup</h2>

      <input
        placeholder="Full Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <br /><br />

      <input
        placeholder="Student ID"
        value={form.id}
        onChange={(e) =>
          setForm({ ...form, id: e.target.value })
        }
      />

      <br /><br />

      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <br /><br />

      <button onClick={handleSignup}>
        Sign Up
      </button>

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;