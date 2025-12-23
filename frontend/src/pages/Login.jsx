import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [particles] = useState(() => [...Array(20)].map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 5}s`
  })));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Login successful! Email: " + formData.email);
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-30"
          style={particle}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              VeriMedia
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </h1>
            <p className="text-purple-200 text-sm">Secure Media Verification Platform</p>
          </div>

          {/* Glass Morphism Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">

            {/* Shimmer Effect */}
            <div className="absolute inset-0 shimmer pointer-events-none"></div>

            {/* Back to Home Link */}
            <button
              onClick={() => navigate("/")}
              className="text-purple-200 hover:text-white transition-colors text-sm font-medium mb-6 cursor-pointer hover:underline"
            >
              <span
                className="text-lg font-bold"
              >
                ←
              </span>
              Back to Home
            </button>

            {/* Header */}
            <div className="text-center mb-8 relative">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-purple-200 text-sm">
                Sign in to access your secure dashboard
              </p>
            </div>

            {/* Email Field */}
            <div className="mb-5 relative">
              <label className="text-sm font-semibold text-white mb-2 block">Email Address</label>
              <div className={`relative group`}>
                <div className={`flex items-center gap-3 backdrop-blur-md bg-white/10 rounded-xl px-4 py-3.5 border-2 transition-all duration-300
                                ${errors.email
                    ? 'border-red-500 bg-red-500/10'
                    : focusedField === 'email'
                      ? 'border-blue-400 bg-white/20 shadow-lg shadow-blue-500/50'
                      : 'border-white/30 hover:border-white/50'}`}>
                  <Mail className={`w-5 h-5 transition-colors ${errors.email ? 'text-red-400' : 'text-purple-300'}`} />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full outline-none text-sm bg-transparent text-white placeholder-purple-300/60"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-xs animate-shake bg-red-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <label className="text-sm font-semibold text-white mb-2 block">Password</label>
              <div className={`relative group`}>
                <div className={`flex items-center gap-3 backdrop-blur-md bg-white/10 rounded-xl px-4 py-3.5 border-2 transition-all duration-300
                                ${errors.password
                    ? 'border-red-500 bg-red-500/10'
                    : focusedField === 'password'
                      ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-500/50'
                      : 'border-white/30 hover:border-white/50'}`}>
                  <Lock className={`w-5 h-5 transition-colors ${errors.password ? 'text-red-400' : 'text-purple-300'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full outline-none text-sm bg-transparent text-white placeholder-purple-300/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-purple-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-xs animate-shake bg-red-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => alert("Navigate to forgot password")}
                className="text-sm text-purple-300 hover:text-white transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-white text-base
                         bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                         hover:from-blue-500 hover:via-purple-500 hover:to-pink-500
                         shadow-2xl hover:shadow-purple-500/50 
                         transform hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing you in...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Sign In Securely</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-purple-200">New to VeriMedia?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                         bg-white/10 hover:bg-white/20 border-2 border-white/30
                         hover:border-white/50 transition-all duration-200
                         transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create New Account
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-purple-300 text-xs mt-6">
            Protected by enterprise-grade encryption • Trusted by millions
          </p>
        </div>
      </div>
    </div>
  );
}