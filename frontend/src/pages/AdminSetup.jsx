import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminSetup() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const handleSave = async () => {

        try {

            await API.put(
                "/user/admin/setup",
                form
            );

            alert("Credentials Updated");

            navigate("/admin");

        } catch (err) {

            alert("Update Failed");
        }
    };

    return (
        <div>

            <h2>
                First Login Setup
            </h2>

            <input
                placeholder="New Username"
                onChange={(e) =>
                    setForm({
                        ...form,
                        username: e.target.value
                    })
                }
            />

            <input
                type="password"
                placeholder="New Password"
                onChange={(e) =>
                    setForm({
                        ...form,
                        password: e.target.value
                    })
                }
            />

            <button onClick={handleSave}>
                Save
            </button>

        </div>
    );
}

export default AdminSetup;