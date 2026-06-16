import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "15px"
      }}
    >
      <h1>College Election Voting System</h1>

      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
        }}
      >
        Login as Student
      </button>

      <button
        onClick={() => navigate("/signup")}
        style={{
          padding: "10px 20px",
        }}
      >
        Student Sign Up
      </button>

      <button
        onClick={() => navigate("/admin-login")}
        style={{
          padding: "10px 20px",
        }}
      >
        Login as Admin
      </button>
    </div>
  );
}

export default Home;