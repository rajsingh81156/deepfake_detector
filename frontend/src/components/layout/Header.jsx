import { Shield, History, Lock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
        
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
            <Shield className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold">VeriMedia</h1>
            <p className="text-xs text-gray-500">Trust & Provenance Ecosystem</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-3 py-2 text-sm hover:bg-gray-100 rounded">
            <History className="inline w-4 h-4 mr-1" />
            History
          </button>

          {/* SIGN IN */}
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded"
          >
            <Lock className="inline w-4 h-4 mr-1" />
            Sign In
          </button>

          {/* REGISTER */}
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 text-sm border rounded"
          >
            <UserPlus className="inline w-4 h-4 mr-1" />
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
