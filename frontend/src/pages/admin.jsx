import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [timeLeft, setTimeLeft] = useState("00h 00m 00s");
  const use_navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    party: "",
    age: ""
  });

  const [editId, setEditId] = useState(null);
  const [electionStatus, setElectionStatus] = useState(null); //<------------------------------------

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await API.get("/user/profile");

      if (res.data.response.role !== "admin") {
        alert("Access denied");
        window.location.href = "/vote";
      } else {
        fetchCandidates();
        fetchElectionStatus(); //<------------------------------------------------------------
      }

    } catch (err) {
      console.log("ERROR IN ADMIN:-", err);
      window.location.href = "/";
    }
  };

  const handleSetElection = async () => {
    try {
      if (!startTime || !endTime) {
        return alert("Please select start and end time");
      }

      await API.post("/candidate/election/create", {
        startTime,
        endTime,
      });

      alert("Election set successfully");
      fetchElectionStatus(); //<------------------------------------------------------------
      setStartTime("");
      setEndTime("");

    } catch (err) {
      console.log("ELECTION ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Failed to set election");
    }
  };

  const fetchCandidates = async () => {
    const res = await API.get("/candidate");
    setCandidates(res.data);
  };
  // -------------------------------------------------------------------------------------------
  const fetchElectionStatus = async () => {
    try {
      const res = await API.get(
        "/candidate/election/status"
      );

      setElectionStatus(res.data);

    } catch (error) {
      console.log(
        "Election Status Error:",
        error
      );
    }
  };
  //--------------------------------------------------------------
  useEffect(() => {

    if (
      !electionStatus?.endTime ||
      electionStatus.status === "Completed"
    ) {
      return;
    }

    const timer = setInterval(() => {

      const now = new Date();
      const targetTime =
        electionStatus.status === "Upcoming"
          ? new Date(electionStatus.startTime)
          : new Date(electionStatus.endTime);

      const difference =
        targetTime - now;

      if (difference <= 0) {
        setTimeLeft("00h 00m 00s");
        clearInterval(timer);
        fetchElectionStatus();
        return;
      }

      const hours = Math.floor(
        difference / (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
      );

      const seconds = Math.floor(
        (difference % (1000 * 60)) /
        1000
      );

      setTimeLeft(
        `${hours}h ${minutes}m ${seconds}s`
      );

    }, 1000);

    return () => clearInterval(timer);

  }, [electionStatus]);
  //--------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
  // ADD
  const handleAdd = async () => {
    try {
      await API.post("/candidate/candidatepost", form);
      alert("Candidate added");

      setForm({ name: "", party: "", age: "" }); // clear form
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    try {
      await API.put(`/candidate/candidateupdate/${editId}`, form);

      alert("Candidate updated");

      setEditId(null);
      setForm({ name: "", party: "", age: "" });

      fetchCandidates();
    } catch (err) {
      alert("Update failed");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/candidate/candidatedelete/${id}`);
      alert("Deleted");
      fetchCandidates();
    } catch (err) {
      alert("Delete failed");
    }
  };

  //LogOut
  const handleLogout = () => {
    localStorage.removeItem("token");
    use_navigate("/")// go back to login
  };

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <button onClick={handleLogout}>LogOut</button>

      </div>
      <h2>Admin Dashboard</h2>
      {/* ------------------------------------------------------------------------------------------------- */}

      {electionStatus && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "10px",
            backgroundColor: "#f8f8f8"
          }}
        >
          {/* ------------------------------------------------- */}
          <h3>
            {electionStatus.status === "Active" &&
              "🟢 Election Active"}

            {electionStatus.status === "Upcoming" &&
              "🟡 Election Upcoming"}

            {electionStatus.status === "Completed" &&
              "🔴 Election Completed"}
          </h3>

          {electionStatus.status === "Upcoming" && (
            <h4>
              Starts In: {timeLeft}
            </h4>
          )}

          {electionStatus.status === "Active" && (
            <h4>
              Ends In: {timeLeft}
            </h4>
          )}
          {/* ----------------------------------------------------- */}

          {electionStatus.startTime && (
            <p>
              Start Time:{" "}
              {new Date(
                electionStatus.startTime
              ).toLocaleString()}
            </p>
          )}

          {electionStatus.endTime && (
            <p>
              End Time:{" "}
              {new Date(
                electionStatus.endTime
              ).toLocaleString()}
            </p>
          )}
        </div>
      )}
      {/* ---------------------------------------------------------------------------------------------- */}
      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <div>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button onClick={handleSetElection}>
            Set Election
          </button>
        </div>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Party"
          value={form.party}
          onChange={(e) => setForm({ ...form, party: e.target.value })}
        />

        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <button onClick={editId ? handleUpdate : handleAdd}>
          {editId ? "Update Candidate" : "Add Candidate"}
        </button>
      </div>

      {/* LIST */}
      {candidates.map((c) => (
        <div key={c._id}>
          <h3>{c.name}</h3>
          <p>{c.party}</p>


          <button onClick={() => {
            setEditId(c._id);
            setForm({
              name: c.name,
              party: c.party,
              age: c.age
            });
          }}>
            Edit
          </button>


          <button onClick={() => handleDelete(c._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;