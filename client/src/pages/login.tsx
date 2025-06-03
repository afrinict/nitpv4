import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormData {
  identifier: string;
  password: string;
}

const Login = () => {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.identifier, data.password);
      
      // The login function in AuthContext will handle the redirection
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img
            src="/images/logo.png"
            alt="NITP Abuja Chapter Logo"
            className="h-32 w-auto mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold text-white mb-6">
            Welcome Back
          </h1>
          <p className="text-lg text-white/80">
            Sign in to access your NITP Abuja Chapter member portal and stay connected with the planning community.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <img
              src="/images/logo.png"
              alt="NITP Abuja Chapter Logo"
              className="h-20 w-auto mx-auto mb-4"
            />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email, Username or Membership ID
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter your identifier"
                {...register("identifier", {
                  required: "Email, username or membership ID is required"
                })}
              />
              {errors.identifier && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.identifier.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required"
                })}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <Link href="/forgot-password">
                <span className="text-sm font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer">
                  Forgot password?
                </span>
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/register">
                <span className="font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer">
                  Register now
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;