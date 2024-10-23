import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-3">
      <p className="text-2xl sm:text-3xl text-center font-bold">404 Error</p>
      <p className="text-lg sm:text-xl text-center font-medium">please navigate back to login</p>
      <Link to={"/"} 
      className="font-semibold text-lg px-3 py-1 rounded shadow-md bg-indigo-500 text-white"
      >
        {window.sessionStorage.getItem("token") ? "Home" : "Login"}
      </Link>
    </div>
  );
}

export default Error;
