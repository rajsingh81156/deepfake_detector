import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, UserPlus, Shield, Check } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully! Welcome, " + formData.name);
    }, 2000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              VeriMedia
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </h1>
            <p className="text-purple-200 text-sm">Secure Media Verification Platform</p>
          </div>

          {/* Glass Morphism Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">

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
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-purple-200 text-sm">
                Join thousands of verified users today
              </p>
            </div>

            {/* Name Field */}
            <div className="mb-5 relative">
              <label className="text-sm font-semibold text-white mb-2 block">Full Name</label>
              <div className={`relative group`}>
                <div className={`flex items-center gap-3 backdrop-blur-md bg-white/10 rounded-xl px-4 py-3.5 border-2 transition-all duration-300
                                ${errors.name
                    ? 'border-red-500 bg-red-500/10'
                    : focusedField === 'name'
                      ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-500/50'
                      : 'border-white/30 hover:border-white/50'}`}>
                  <User className={`w-5 h-5 transition-colors ${errors.name ? 'text-red-400' : 'text-purple-300'}`} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full outline-none text-sm bg-transparent text-white placeholder-purple-300/60"
                  />
                </div>
                {errors.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-xs animate-shake bg-red-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
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
            <div className="mb-5 relative">
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-purple-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-200">Password Strength</span>
                      <span className={`text-xs font-semibold ${passwordStrength <= 1 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? getStrengthColor() : 'bg-white/20'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {errors.password && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-xs animate-shake bg-red-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6 relative">
              <label className="text-sm font-semibold text-white mb-2 block">Confirm Password</label>
              <div className={`relative group`}>
                <div className={`flex items-center gap-3 backdrop-blur-md bg-white/10 rounded-xl px-4 py-3.5 border-2 transition-all duration-300
                                ${errors.confirmPassword
                    ? 'border-red-500 bg-red-500/10'
                    : focusedField === 'confirmPassword'
                      ? 'border-purple-400 bg-white/20 shadow-lg shadow-purple-500/50'
                      : 'border-white/30 hover:border-white/50'}`}>
                  <Shield className={`w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-400' : 'text-purple-300'}`} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full outline-none text-sm bg-transparent text-white placeholder-purple-300/60"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-purple-300 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-2 mt-2 text-green-400 text-xs bg-green-500/10 px-3 py-2 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </div>
                )}
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-xs animate-shake bg-red-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-white text-base
                         bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600
                         hover:from-purple-500 hover:via-pink-500 hover:to-blue-500
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
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-purple-200">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-xl font-semibold text-white
                         bg-white/10 hover:bg-white/20 border-2 border-white/30
                         hover:border-white/50 transition-all duration-200
                         transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In Instead
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-purple-300 text-xs mt-6">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}