import { useEffect, useState } from "react";
import API from "../services/api";

function Results() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/candidate/vote/count")
      .then((res) => {
        console.log("RESULT API:", res.data);
        setData(res.data?.voteRecord || [])
      })
      .catch((error)=>{
        console.log("ERROR !! : -", error )
        alert("Failed To Load Result")
      })
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Election Results</h2>

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