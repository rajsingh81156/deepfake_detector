import { FileCheck, Fingerprint, Info } from "lucide-react";

export default function Tabs({ active, setActive }) {
  const tabs = [
    { id: "verify", label: "Verify Media", icon: FileCheck },
    { id: "watermark", label: "Add Watermark", icon: Fingerprint },
    { id: "about", label: "Swiss Cheese Model", icon: Info }
  ];

  return (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActive(id)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded ${
            active === id ? "bg-white shadow text-blue-600" : "text-gray-600"
          }`}
        >
          <Icon className="w-5 h-5" /> {label}
        </button>
      ))}
    </div>
  );
}
