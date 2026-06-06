import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Vote from "./pages/vote.jsx";
import Results from "./pages/result.jsx";
import PrivateRoute from "./components/privateRoute.jsx";
import Admin from "./pages/admin.jsx";
import Signup from "./pages/signup.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/vote" element={<Vote />} /> */}
        <Route
          path="/vote"
          element={
            <PrivateRoute>
              <Vote />
            </PrivateRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <Results />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;