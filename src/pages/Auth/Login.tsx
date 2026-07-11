import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/store/Api/AuthApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/Slices/AuthSlice/authSlice";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTracking } from "@/hooks/useTracking";
import { useGetHost } from "@/utils/useGetHost";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(3, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const host = useGetHost();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trackLogin } = useTracking();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setUser({ ...res.data }));
      trackLogin("email");
      toast.success(res.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google Login logic
    toast.info("Google Login integration coming soon!");
    trackLogin("google");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-base relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-text-muted mt-2">Sign in to continue to {host.title || "our store"}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary ml-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-main bg-bg-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-danger text-xs ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary ml-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-main bg-bg-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
            </div>
            {errors.password && (
              <p className="text-danger text-xs ml-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-blue transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-blue to-primary-green text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-main"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-slate-900 text-text-muted">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white dark:bg-slate-800 border border-border-main text-text-primary py-3.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26::84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="text-center mt-8 text-text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-blue hover:underline decoration-2 underline-offset-4 transition-all">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
