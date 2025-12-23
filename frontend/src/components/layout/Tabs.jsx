import { FileCheck, Fingerprint, Info } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Tabs() {
  const tabs = [
    { id: "verify", label: "Verify Media", icon: FileCheck, path: "/verify" },
    { id: "watermark", label: "Add Watermark", icon: Fingerprint, path: "/watermark" },
    { id: "about", label: "Swiss Cheese Model", icon: Info, path: "/about" }
  ];

  return (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center gap-2 py-3 rounded ${isActive ? "bg-white shadow text-blue-600" : "text-gray-600"
            }`
          }
        >
          <tab.icon className="w-5 h-5" /> {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
