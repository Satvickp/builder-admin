import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Home from "./components/Home";
import Settings from "./pages/Settings";
import Expense from "./components/Expense";
import Society from "./components/Society";
import Master from "./components/Master";
import Others from "./components/Others";
import Register from "./pages/Register";
import Error from "./pages/Error";
import States from "./pages/States";
import Flats from "./pages/Flats";
import Sites from "./pages/Sites";
import Services from "./pages/Services";
import Bills from "./pages/Bills";

function App() {
  return (
    <BrowserRouter>
      {window.sessionStorage.getItem("token") ? (
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="/" element={<Home />} />
            <Route path="/states" element={<States />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/flats" element={<Flats />} />
            <Route path="/services" element={<Services />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/society" element={<Society />} />
            <Route path="/master" element={<Master />} />
            <Route path="/others" element={<Others />} />
            <Route path="*" element={<Error />} />
            {/* Add any more router here */}
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Error />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
