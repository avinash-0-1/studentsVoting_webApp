import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Vote from "./pages/vote.jsx";
import Results from "./pages/result.jsx";
import PrivateRoute from "./components/privateRoute.jsx";
import Admin from "./pages/admin.jsx";
import Signup from "./pages/signup.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminSetup from "./pages/AdminSetup";
import Home from "./pages/home.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
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
          path="/admin-setup"
          element={<AdminSetup />}
        />
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