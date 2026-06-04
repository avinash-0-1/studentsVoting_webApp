import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Vote from "./pages/vote.jsx";
import Results from "./pages/result.jsx";
import PrivateRoute from "./components/privateRoute.jsx";
import Admin from "./pages/admin.jsx";


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