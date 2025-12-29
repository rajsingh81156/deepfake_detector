import { FileCheck, Fingerprint, Info } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Tabs() {
  const tabs = [
    { id: "verify", label: "Verify Media", icon: FileCheck, path: "/verify" },
    { id: "watermark", label: "Add Watermark", icon: Fingerprint, path: "/watermark" },
    { id: "about", label: "Swiss Cheese Model", icon: Info, path: "/about" }
  ];

  return (
    <div className="flex space-x-2 backdrop-blur-xl bg-white/10 p-1.5 rounded-2xl mb-8 border border-white/20 shadow-2xl">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`
          }
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </div>
  );
}