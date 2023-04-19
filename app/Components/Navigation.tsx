import { Link, NavLink } from "@remix-run/react";

export default function Navigation() {
  return (
    <nav>
      <div className="flex justify-center bg-gray-200">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/asmenys"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Asmenys
        </NavLink>
        <NavLink
          to="/nekilnojami-turtai"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Nekilnojami Turtai
        </NavLink>
        <NavLink
          to="/paskolos"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Paskolos
        </NavLink>
        <NavLink
          to="/mokejimai"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Mokejimai
        </NavLink>
        <NavLink
          to="/pirkimo-pardavimo-sutartys"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Pirkimo-Pardavimo sutartys
        </NavLink>
        <NavLink
          to="/remontai"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          Remontai
        </NavLink>
        <NavLink
          to="/F1"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          F1
        </NavLink>
        <NavLink
          to="/F2"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          F2
        </NavLink>
        <NavLink
          to="/F3"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          F3
        </NavLink>
        <NavLink
          to="/F4"
          className={({ isActive }) =>
            `px-3 py-2 rounded-full text-gray-800 font-bold ${
              isActive
                ? "bg-gray-300 hover:bg-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
            }`
          }
        >
          F4
        </NavLink>
      </div>
    </nav>
  );
}
