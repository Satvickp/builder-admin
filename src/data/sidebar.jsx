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
        name: "States",
        icon: <BsPeopleFill className="w-5 h-5" />,
        route: "/states",
    },
    {
        id: 4,
        name: "Sites",
        icon: <BsFillArchiveFill className="w-5 h-5" />,
        route: "/sites",
    },
    {
        id: 3,
        name: "Flats",
        icon: <BsFillGrid3X3GapFill className="w-5 h-5" />,
        route: "/flats",
    },
    {
        id: 5,
        name: "Services",
        icon: <BsListCheck className="w-5 h-5" />,
        route: "/services",
    },
    {
        id: 6,
        name: "Bill",
        icon: <BsMenuButtonWideFill className="w-5 h-5" />,
        route: "/bills",
    },
    {
        id: 7,
        name: "Settings",
        icon: <BsFillGearFill className="w-5 h-5" />,
        route: "/settings",
    },
]