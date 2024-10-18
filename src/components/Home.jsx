import "./Style.css";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import ActivityStatus from "./Table";
import TrafficSource from "./Traffic";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="main-container">
      <div className="grid sm:grid-cols-4 gap-3">
        <Link
          to={"/expense"}
          className="bg-blue-600 text-white h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md hover:bg-blue-500 duration-900"
          style={{ textDecoration: "none" }}
        >
          <div className="card-inner">
            <h3 className="text-2xl">Expense</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1 className="mt-3 text-lg">$24k</h1>
        </Link>
        <Link
          to={"/society"}
          className="bg-orange-600 text-white h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md hover:bg-orange-500 duration-900"
          style={{ textDecoration: "none" }}
        >
          <div className="card-inner">
            <h3 className="text-2xl">Society</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1 className="mt-3 text-lg">75.5%</h1>
        </Link>
        <Link
          to={"/master"}
          className="bg-green-600 text-white h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md hover:bg-green-500 duration-900"
          style={{ textDecoration: "none" }}
        >
          <div className="card-inner">
            <h3 className="text-2xl">Master</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1 className="mt-3 text-lg">1.6k</h1>
        </Link>
        <Link
          to={"/others"}
          className="bg-red-600 text-white h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md hover:bg-red-500 duration-900"
          style={{ textDecoration: "none" }}
        >
          <div className="card-inner">
            <h3 className="text-2xl">Other</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1 className="mt-3 text-lg">$15k</h1>
        </Link>
      </div>
      <div className="status-section">
        <ActivityStatus />
        <TrafficSource />
      </div>
    </main>
  );
}

export default Home;
