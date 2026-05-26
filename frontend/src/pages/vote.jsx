import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";


function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
    checkUser();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await API.get("/candidate");
      setCandidates(res.data);
    } catch (err) {
      alert("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/"); // go back to login
};

  const checkUser = async () => {
    try {
      const res = await API.get("/user/profile");
      setHasVoted(res.data.response.isVoted);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVote = async (id) => {
    if (!id) return alert("Invalid candidate");

    try {
      await API.post(`/candidate/vote/${id}`);
      alert("Vote successful");

      setHasVoted(true); //disable instantly
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Vote Now</h2>
      <button onClick={handleLogout}>Logout</button>
      <a href="/results">View Results</a>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {candidates.map((c) => (
          <div
            key={c._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h3>{c.name}</h3>
            <p>{c.party}</p>

            <button
              onClick={() => handleVote(c._id)}
              disabled={hasVoted}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "none",
                cursor: hasVoted ? "not-allowed" : "pointer",
                backgroundColor: hasVoted ? "gray" : "#4CAF50",
                color: "white",
              }}
            >
              {hasVoted ? "Already Voted" : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vote;