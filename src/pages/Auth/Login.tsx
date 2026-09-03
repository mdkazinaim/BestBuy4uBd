import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "@/store/Api/AuthApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/Slices/AuthSlice/authSlice";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useTracking } from "@/hooks/useTracking";
import { useGetHost } from "@/utils/useGetHost";
import authBg from "@/assets/auth-bg.png";

type Mode = "signin" | "signup";

const EASE = [0.22, 1, 0.36, 1] as const;

/* --------------------------------- Floating Label Input ---------------------------------- */

function FloatField({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  trailing,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  trailing?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="group relative block">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          autoComplete={autoComplete}
          className="peer w-full h-12 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pb-1.5 pt-5.5 text-[14px] text-slate-900 dark:text-white outline-none transition-colors duration-200 placeholder-transparent focus:border-slate-400 dark:focus:border-slate-600 focus:outline-none focus:ring-0 focus-visible:ring-0"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 dark:text-slate-500 transition-all duration-200 peer-focus:top-[13px] peer-focus:text-[9px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-slate-600 dark:peer-focus:text-slate-400 peer-[:not(:placeholder-shown)]:top-[13px] peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.14em]">
          {label}
        </span>
        {trailing}
      </label>
      {error && (
        <p className="text-rose-500 text-xs ml-2 font-medium">{error}</p>
      )}
    </div>
  );
}

/* ----------------------------- Password Strength Score ----------------------------- */

function scorePassword(pw: string): number {
  let s = 0;
  if (pw.length >= 4) s++;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

const STRENGTH_META = [
  { label: "Weak", color: "#f59e0b" },
  { label: "Fair", color: "#f59e0b" },
  { label: "Good quality", color: "#10b981" },
  { label: "Very strong", color: "#059669" },
  { label: "Maximum security", color: "#3e70ff" },
];

/* --------------------------------- Visual Panel ---------------------------------- */

function VisualPanel() {
  const host = useGetHost();

  /* Cursor Parallax Motion */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 55, damping: 20, mass: 0.7 });
  const y = useSpring(my, { stiffness: 55, damping: 20, mass: 0.7 });

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 24);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 16);
    },
    [mx, my]
  );

  return (
    <div
      onMouseMove={onMove}
      className="relative h-full w-full max-w-full overflow-hidden bg-[#1b150f] text-[#fbf8f1]"
    >
      {/* Interactive Photography Layer with Parallax */}
      <motion.div style={{ x, y }} className="absolute -inset-4 overflow-hidden">
        <img
          src={authBg}
          alt="Featured Collection"
          className="absolute inset-0 h-full w-full object-cover scale-105 pointer-events-none"
        />
      </motion.div>

      {/* Lighting & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b150f]/95 via-[#1b150f]/30 to-[#1b150f]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1b150f]/40 via-transparent to-transparent pointer-events-none" />

      {/* Top Header Bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-6 pt-6 lg:p-10 lg:pt-8">
        <Link to="/" className="flex items-center gap-3">
          {host.logo ? (
            <img src={host.logo} alt={host.title} className="h-8 max-h-8 object-contain" />
          ) : (
            <span className="font-bold text-xl tracking-tight text-[#fbf8f1]">
              {host.title}
            </span>
          )}
        </Link>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fbf8f1]/90">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9a24b] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c9a24b]" />
          </span>
          50,000+ Happy Shoppers
        </div>
      </header>

      {/* Headline */}
      <div className="absolute inset-x-0 bottom-24 lg:bottom-32 z-10 px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c9a24b]"
        >
          <span className="h-px w-8 bg-[#c9a24b]" />
          The Premium E-Commerce Experience
        </motion.p>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-[#fbf8f1]">
          Products that <br />
          <span className="text-[#e6dac3]">
            feel like <span className="text-[#c9a24b]">you.</span>
          </span>
        </h1>

        <p className="mt-4 hidden sm:block max-w-md text-sm leading-relaxed text-[#fbf8f1]/80 font-normal">
          Discover exclusive deals, genuine quality items, fast express delivery, and seamless one-click order management.
        </p>
      </div>

      {/* Floating Feature Card */}
      <div className="absolute inset-x-0 bottom-6 z-20 hidden lg:block px-10">
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-4 max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a24b]">
            Featured Catalog
          </p>
          <p className="font-bold text-base text-[#fbf8f1] mt-0.5">
            Verified Genuine Products Guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Main Auth Experience Component ---------------------------------- */

export default function Login() {
  const host = useGetHost();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { trackLogin, trackSignUp } = useTracking();

  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerApi, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const initialMode: Mode = location.pathname.includes("signup") ? "signup" : "signin";
  const [mode, setMode] = useState<Mode>(initialMode);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const controls = useAnimationControls();

  const strength = useMemo(() => scorePassword(password), [password]);
  const meta = STRENGTH_META[strength];

  function triggerShake(msg: string) {
    setStatus("idle");
    setError(msg);
    void controls.start({
      x: [0, -8, 8, -5, 5, 0],
      transition: { duration: 0.4, ease: "easeOut" },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && name.trim().length < 2) {
      return triggerShake("Please enter your full name.");
    }
    if (!email.includes("@") || !email.includes(".")) {
      return triggerShake("Please enter a valid email address.");
    }
    if (!password) {
      return triggerShake("Please enter your password.");
    }

    setStatus("loading");

    try {
      if (mode === "signin") {
        const res = await loginApi({ email, password }).unwrap();
        dispatch(setUser({ ...res.data }));
        trackLogin("email");
        toast.success(res.message || "Signed in successfully!");
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        await registerApi(formData).unwrap();
        trackSignUp("email");
        toast.success("Account created successfully! Please sign in.");
      }

      setStatus("success");
      setTimeout(() => navigate("/"), 800);
    } catch (err: any) {
      triggerShake(err?.data?.message || "Authentication failed. Please check credentials.");
    }
  }

  const isLoading = isLoginLoading || isRegisterLoading || status === "loading";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 lg:h-screen lg:overflow-hidden font-sans">
      <div className="grid h-full min-h-screen lg:min-h-0 lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[1.25fr_1fr] max-w-full overflow-x-hidden">
        {/* Left Visual Panel */}
        <section className="relative h-[40vh] sm:h-[45vh] lg:h-full overflow-hidden">
          <VisualPanel />
        </section>

        {/* Right Form Section */}
        <section className="relative flex flex-col justify-between p-6 pt-6 lg:p-10 lg:pt-8 bg-white dark:bg-slate-950 overflow-x-hidden">
          {/* Top Bar Navigation */}
          <header className="relative z-10 flex items-center justify-between mb-6 sm:mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-[#3e70ff] transition-colors bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-4 py-2.5 rounded-xl hover:border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
          </header>

          {/* Form Content */}
          <motion.div animate={controls} className="relative z-10 mx-auto w-full max-w-[420px] my-auto">
            {/* Title & Subtitle */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {mode === "signin" ? (
                      <>Welcome <span className="text-[#3e70ff]">back.</span></>
                    ) : (
                      <>Join the <span className="text-[#3e70ff]">collective.</span></>
                    )}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 font-normal">
                    {mode === "signin"
                      ? "Sign in to access your orders, saved items, and account."
                      : "Create an account to unlock member discounts & instant checkout."}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mode Switch Pill */}
            <div className="grid grid-cols-2 gap-1 rounded-full border border-gray-200 dark:border-slate-800 bg-gray-100 dark:bg-slate-900 p-1 mb-6">
              {(["signin", "signup"] as Mode[]).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError(null);
                    }}
                    className={`relative rounded-full px-4 py-2.5 text-[13px] font-semibold transition-colors duration-300 ${
                      active ? "text-white dark:text-slate-900" : "text-gray-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="mode-pill"
                        className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">
                      {m === "signin" ? "Sign in" : "Create account"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="space-y-3.5 overflow-hidden"
                  >
                    <FloatField
                      label="Full Name"
                      value={name}
                      onChange={setName}
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <FloatField
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />

              <div>
                <FloatField
                  label="Password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-slate-800 dark:hover:text-white"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />

                {/* Password strength meter */}
                {mode === "signup" && password.length > 0 && (
                  <div className="flex items-center gap-3 px-1 pt-2.5">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                          style={{ background: i < strength ? meta.color : "#e5e7eb" }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      {meta.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Sign In Options */}
              {mode === "signin" && (
                <div className="flex items-center justify-between px-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setRemember(!remember)}
                    className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-slate-400"
                  >
                    <span
                      className={`grid h-4 w-4 place-items-center rounded border transition-all ${
                        remember ? "border-[#3e70ff] bg-[#3e70ff]" : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {remember && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </span>
                    Remember me
                  </button>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#3e70ff] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-medium text-rose-600 dark:text-rose-400"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-slate-800 dark:hover:bg-gray-100 disabled:opacity-80 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In to Account" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Terms Footer */}
            <p className="mt-8 text-center text-[11px] leading-relaxed text-gray-500 dark:text-slate-400">
              By continuing you agree to our{" "}
              <Link to="/terms" className="font-semibold text-slate-900 dark:text-white underline">
                Terms of Service
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="font-semibold text-slate-900 dark:text-white underline">
                Privacy Policy
              </Link>.
            </p>
          </motion.div>

          {/* Footer Copyright */}
          <div className="relative z-10 text-[11px] text-gray-400 dark:text-slate-500 text-center mt-6">
            © {new Date().getFullYear()} {host.title}. All rights reserved.
          </div>
        </section>
      </div>
    </div>
  );
}
