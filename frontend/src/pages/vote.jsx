import { useEffect, useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";


function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [electionStatus, setElectionStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
    checkUser();
    checkElection();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkElection();
    }, 5000);

    return () => clearInterval(interval);
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
  // -------------------------------------------
  const checkElection = async () => {
    try {
      const res = await API.get(
        "/candidate/election/status"
      );

      setElectionStatus(res.data);

      return res.data;

    } catch (err) {
      console.log("Election check failed");
      return null;
    }
  };
  // ------------------------------------------

  const checkUser = async () => {
    try {
      const res = await API.get("/user/profile");

      setHasVoted(res.data.response.isVoted);
      setStudentName(res.data.response.name);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVote = async (id) => {
    if (!id) return alert("Invalid candidate");

    const currentElection = await checkElection();

    if (
      currentElection?.status !== "Active"
    ) {
      return alert(
        `Election is ${currentElection?.status}`
      );
    }

    try {
      await API.post(`/candidate/vote/${id}`);
      alert("Vote successful");

      setHasVoted(true);
    } catch (err) {
      const message = err.response?.data?.message;
      alert(message || "Vote failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>🗳️ Vote Now</h2>
      <p style={{ textAlign: "center" }}>
        Welcome, <strong>{studentName}</strong>
      </p>

      {electionStatus && (
        <div
          style={{
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            margin: "10px 0",
            backgroundColor:
              electionStatus.status === "Active"
                ? "#d4edda"
                : electionStatus.status === "Upcoming"
                  ? "#fff3cd"
                  : "#f8d7da"
          }}
        >
          {electionStatus.status === "Active" &&
            "🟢 Election Active"}

          {electionStatus.status === "Upcoming" &&
            "🟡 Election Upcoming"}

          {electionStatus.status === "Completed" &&
            "🔴 Election Completed"}
        </div>
      )}

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
              disabled={
                hasVoted ||
                electionStatus?.status !== "Active"
              }
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "none",
                color: "white",
                cursor:
                  hasVoted ||
                    electionStatus?.status !== "Active"
                    ? "not-allowed"
                    : "pointer",
                backgroundColor:
                  hasVoted ||
                    electionStatus?.status !== "Active"
                    ? "gray"
                    : "#4CAF50",
              }}
            >
              {hasVoted
                ? "Already Voted"
                : electionStatus?.status === "Upcoming"
                  ? "Election Not Started"
                  : electionStatus?.status === "Completed"
                    ? "Election Closed"
                    : "Vote"}
            </button>
          </div>
        ))}
      </div>
    </div >
  );
}

export default Vote;