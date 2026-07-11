import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/store/Api/AuthApi";
import { toast } from "sonner";
import { Mail, Lock, User, ImagePlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTracking } from "@/hooks/useTracking";
import { useGetHost } from "@/utils/useGetHost";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.any().optional(),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
  const host = useGetHost();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const { trackSignUp } = useTracking();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setValue("image", file);
    }
  };

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (selectedFile) formData.append("file", selectedFile); // Backend likely expects 'file' or 'image'

      await registerUser(formData).unwrap();
      trackSignUp("email");
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg-base relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 my-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-blue to-primary-green bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-text-muted mt-2">Join {host.title || "us"} today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById("fileInput")?.click()}>
              <div className={`w-24 h-24 rounded-full border-2 border-dashed border-border-main flex items-center justify-center overflow-hidden transition-all ${!preview ? 'hover:border-primary bg-bg-base' : 'border-primary'}`}>
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-text-muted group-hover:text-primary transition-colors">
                    <ImagePlus className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">Upload</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary-blue text-white p-1.5 rounded-full shadow-lg">
                <ImagePlus className="w-3 h-3" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary ml-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                {...register("name")}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-main bg-bg-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
            </div>
            {errors.name && (
              <p className="text-danger text-xs ml-1">{errors.name.message}</p>
            )}
          </div>

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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-blue to-primary-green text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-blue hover:underline decoration-2 underline-offset-4 transition-all">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
