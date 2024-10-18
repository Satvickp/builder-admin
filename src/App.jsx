import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Home from "./components/Home";
import Customer from "./pages/Customer";
import Settings from "./pages/Settings";
import Category from "./pages/Categories";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Expense from "./components/Expense";
import Society from "./components/Society";
import Master from "./components/Master";
import Others from "./components/Others";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/" element={<Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Category />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/society" element={<Society />} />
          <Route path="/master" element={<Master />} />
          <Route path="/others" element={<Others />} />

          {/* Add any more router here */}



          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
