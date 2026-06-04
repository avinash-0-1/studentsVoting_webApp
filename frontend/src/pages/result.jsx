import { useEffect, useState } from "react";
import API from "../services/api";

function Results() {
  const [winners, setWinners] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    // 🔹 Vote count
    API.get("/candidate/vote/count")
      .then((res) => {
        console.log("RESULT API:", res.data);
        setData(res.data?.voteRecord || []);
      })
      .catch((error) => {
        console.log("ERROR:", error);
        alert("Failed To Load Result");
      });

    // 🔹 Winner API
    API.get("/candidate/winner")
      .then((res) => {
        setWinners(res.data.winners);
      })
      .catch((err) => {
        console.log("Winner not available yet");
      });

  }, []);

  return (
    <div style={{ padding: "20px" }}>

      {/* 🏆 WINNER SECTION */}
      {winners.length > 0 && (
        <div
          style={{
            border: "2px solid green",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px"
          }}
        >
          <h2>🏆 Winner{winners.length > 1 ? "s" : ""}</h2>

          {winners.map((w) => (
            <div key={w._id}>
              <h3>{w.name}</h3>
              <p>Party: {w.party}</p>
              <p>Votes: {w.voteCount}</p>
            </div>
          ))}

          {winners.length > 1 && (
            <p style={{ color: "orange" }}>🤝 It's a tie!</p>
          )}
        </div>
      )}

      {/* 📊 RESULTS */}
      <h2>Election Results</h2>

      {data.map((item, i) => (
        <div key={i} style={{ margin: "10px 0" }}>
          <h3>{item.party}</h3>
          <p>Votes: {item.voteCount}</p>
        </div>
      ))}
    </div>
  );
}

export default Results;