"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import Spinner from "@/components/Spinner";
import { login } from "@/services/authService";
import { toApiError } from "@/lib/api-error";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setFormError("");
    try {
      const result = await login(values);
      toast.success(result.message);
      router.push("/dashboard");
    } catch (error) {
      const { message, fieldErrors } = toApiError(error);

      fieldErrors.forEach(({ field, message }) => {
        if (field === "email" || field === "password") {
          setError(field, { message });
        }
      });

      if (fieldErrors.length === 0) setFormError(message);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-brand-panel">
        <Logo className="logo-login" />
        <div>
          <h1>
            Every lead.
            <br />
            Every conversation.
            <br />
            <span style={{ color: "#2253a3" }}>One workspace.</span>
          </h1>
          <p>
            A focused workspace for real estate teams to manage enquiries, plan
            site visits and close more deals.
          </p>
        </div>
        <div style={{ fontSize: 12, color: "#7b8493" }}>
          ESTATEFLOW CRM · DEMO WORKSPACE
        </div>
      </section>

      <section className="login-main">
        <div className="login-box">
          <h2>Welcome back</h2>
          <p>Log in to your sales workspace.</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-fields">
              <div className="form-field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  placeholder="Name@Example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="error-text" role="alert">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <div className="password-wrap">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    placeholder="Enter Password"
                    style={{ width: "100%" }}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    aria-label={show ? "Hide password" : "Show password"}
                    onClick={() => setShow(!show)}
                  >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text" role="alert">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
            {formError && (
              <p className="error-text" role="alert" style={{ marginTop: 14 }}>
                {formError}
              </p>
            )}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in…" : "Log in"}
              {isSubmitting ? <Spinner size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>
          <div className="demo-note">
            <strong style={{ color: "#344054" }}>Demo credentials</strong>
            <br />
            Email: demo@estateflow.in
            <br />
            Password: demo1234
          </div>
        </div>
      </section>
    </main>
  );
}
