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

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllPaidOrUnpaidBillAmountByDateWithoutSiteId } from "../Api/BillApi/BillApi";

function Home() {
  const cred = useSelector((state) => state.Cred);
  // const { token } = useSelector((state) => state.login);
  const [totalUnPaidAmount, setTotalUnPaidAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  let date = new Date();
  let fromDate = new Date(date.getFullYear(), date.getMonth());
  let endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  // console.log(cred.id);

  const payLoadDataOfPaidBill = {
    builderId: cred.id,
    startDate: fromDate.toISOString(),
    endDate: endDate.toISOString(),
    paid: true,
  };
  const getTotalPaidBill = async () => {
    const resp = await getAllPaidOrUnpaidBillAmountByDateWithoutSiteId(
      payLoadDataOfPaidBill
    );
    const data = resp.content;
    const totalAmount = data.length > 0 ? data[0].totalAmount : 0;
    setTotalPaidAmount(totalAmount);
    // console.log(resp);
  };
  useEffect(() => {
    getTotalPaidBill();
  });

  const payLoadDataOfUnPaidBill = {
    builderId: cred.id,
    startDate: fromDate.toISOString(),
    endDate: endDate.toISOString(),
    paid: false,
  };
  const getTotalUnpaidBill = async () => {
    const resp = await getAllPaidOrUnpaidBillAmountByDateWithoutSiteId(
      payLoadDataOfUnPaidBill
    );
    const data = resp.content;
    const totalAmount = data.length > 0 ? data[0].totalAmount : 0;
    setTotalUnPaidAmount(totalAmount);
    // console.log(resp);
  };
  useEffect(() => {
    getTotalUnpaidBill();
  }, []);

  // console.log(totalUnPaidAmount);
  // console.log(totalPaidAmount);
  return (
    <main className="main-container">
      <div className="grid sm:grid-cols-4 gap-3">
        <Link
          to={"/expense"}
          className="bg-blue-600 text-white h-[200px] rounded-md sm:col-span-1 p-4 mb-2 shadow-md hover:bg-blue-500 duration-900"
          style={{ textDecoration: "none" }}
        >
          <div className="card-inner">
            <h3 className="text-2xl">Paid Bill</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1 className="mt-3 text-lg">₹ {totalPaidAmount}</h1>
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
            <h3 className="text-2xl">Unpaid Bill</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1 className="mt-3 text-lg">₹ {totalUnPaidAmount}</h1>
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
