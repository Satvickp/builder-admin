import {
    BsFillArchiveFill,
    BsFillGrid3X3GapFill,
    BsPeopleFill,
    BsListCheck,
    BsMenuButtonWideFill,
    BsFillGearFill,
    BsFillEnvelopeFill,
  } from "react-icons/bs";

export const SideBarData = [
    {
        id: 1,
        name: "Dashboard",
        icon: <BsFillEnvelopeFill className="w-5 h-5" />,
        route: "/",
    },
    {
        id: 2,
        name: "Customers",
        icon: <BsPeopleFill className="w-5 h-5" />,
        route: "/customers",
    },
    {
        id: 3,
        name: "Categories",
        icon: <BsFillGrid3X3GapFill className="w-5 h-5" />,
        route: "/categories",
    },
    {
        id: 4,
        name: "Products",
        icon: <BsFillArchiveFill className="w-5 h-5" />,
        route: "/products",
    },
    {
        id: 5,
        name: "Inventory",
        icon: <BsListCheck className="w-5 h-5" />,
        route: "/inventory",
    },
    {
        id: 6,
        name: "Reports",
        icon: <BsMenuButtonWideFill className="w-5 h-5" />,
        route: "/reports",
    },
    {
        id: 7,
        name: "Settings",
        icon: <BsFillGearFill className="w-5 h-5" />,
        route: "/settings",
    },
]