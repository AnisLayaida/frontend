import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, AlertCircle, Shield, Zap, Users } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import type { LoginFormData } from '../../types'

export function LoginPage() {
  const { user, login, isLoading } = useAuth()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()

  if (user && !isLoading) {
    const from = location.state?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError('')
      await login(data.email, data.password)
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Invalid email or password. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-label="Loading application">
        <LoadingSpinner size="large" />
        <span className="sr-only">Loading application</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Skip to main content for screen readers */}
      <a href="#login-form" className="skip-to-main">
        Skip to login form
      </a>

      {/* Left side - Enhanced BT Branding */}
      <div className="hidden lg:flex lg:w-1/2 bt-gradient items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bt-cyan opacity-10 rounded-full translate-y-32 -translate-x-32"></div>
        
        <div className="max-w-lg text-center text-white relative z-10">
          <div className="mb-12">
            {/* Enhanced BT Logo */}
            <div className="relative mb-8">
              <div className="h-24 w-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm">
                <span className="text-bt-purple font-bold text-4xl">BT</span>
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-bt-orange rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to BT
              <span className="block text-3xl font-normal opacity-90 mt-2">
                Annual Leave System
              </span>
            </h1>
            
            <p className="text-xl opacity-90 leading-relaxed mb-8">
              Streamlining leave management for a better work-life balance across BT Group
            </p>
          </div>
          
          {/* Enhanced Feature List */}
          <div className="space-y-6 text-left bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm border border-white border-opacity-20">
            <h2 className="text-xl font-semibold mb-4 text-center">Key Features</h2>
            
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Instant Submissions</h3>
                <p className="text-sm opacity-80">Submit leave requests in seconds with our streamlined process</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Team Coordination</h3>
                <p className="text-sm opacity-80">Real-time approval workflow with your managers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Compliant</h3>
                <p className="text-sm opacity-80">Enterprise-grade security with comprehensive leave tracking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        {/* Mobile BT Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <div className="h-16 w-16 bt-gradient rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">BT</span>
          </div>
        </div>

        <div className="max-w-md w-full">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8 mt-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BT Leave System</h1>
            <p className="text-gray-600">Secure access to your leave management</p>
          </div>

          <main className="card shadow-2xl border-0 overflow-hidden">
            <div className="card-header text-center">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Secure Sign In</h2>
              <p className="text-white opacity-90">Access your leave management account</p>
            </div>

            <div className="card-body">
              {loginError && (
                <div 
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg" 
                  role="alert"
                  aria-live="polite"
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Login Failed</p>
                      <p className="text-sm text-red-700">{loginError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form 
                id="login-form"
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6" 
                noValidate
                aria-label="Login form"
              >
                <div className="form-group">
                  <label 
                    htmlFor="email" 
                    className="form-label required"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your BT email address"
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  <div id="email-help" className="form-help">
                    Use your official BT email address to sign in
                  </div>
                  {errors.email && (
                    <div id="email-error" className="form-error" role="alert">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label 
                    htmlFor="password" 
                    className="form-label required"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`input-field pr-12 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter your secure password"
                      aria-describedby={errors.password ? 'password-error' : 'password-help'}
                      aria-invalid={errors.password ? 'true' : 'false'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters long'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded-r-xl"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={0}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  <div id="password-help" className="form-help">
                    Your password is encrypted and secure
                  </div>
                  {errors.password && (
                    <div id="password-error" className="form-error" role="alert">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-bt-purple focus:ring-bt-purple border-gray-300 rounded focus:ring-2 focus:ring-offset-2"
                      aria-describedby="remember-help"
                    />
                    <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700">
                      Remember me for 30 days
                    </label>
                  </div>
                  <div id="remember-help" className="sr-only">
                    Keep you signed in on this device for 30 days
                  </div>

                  <div className="text-sm">
                    <a 
                      href="#forgot-password" 
                      className="font-medium text-bt-purple hover:text-bt-purple-dark focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded-md px-2 py-1 transition-colors"
                      aria-label="Reset your forgotten password"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary relative overflow-hidden group"
                  aria-describedby="submit-help"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="small" className="mr-3" />
                        <span>Signing you in...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-2" />
                        <span>Sign In Securely</span>
                      </>
                    )}
                  </span>
                </button>
                <div id="submit-help" className="sr-only">
                  Sign in to access your BT leave management dashboard
                </div>
              </form>

              {/* Enhanced Demo Credentials */}
              <div className="mt-8 p-6 bg-gradient-to-br from-bt-purple/5 to-bt-blue/5 rounded-2xl border border-bt-purple/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-8 w-8 bg-bt-purple rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Demo Access</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Try the system with these demo accounts:
                </p>
                
                <div className="space-y-3">
                  <div className="flex flex-col space-y-1 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-bt-purple">Administrator</span>
                      <span className="text-xs bg-bt-purple text-white px-2 py-1 rounded-full">Full Access</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Email:</strong> admin@bt.com</div>
                      <div><strong>Password:</strong> password123</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-bt-blue">Manager</span>
                      <span className="text-xs bg-bt-blue text-white px-2 py-1 rounded-full">Team Lead</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Email:</strong> manager@bt.com</div>
                      <div><strong>Password:</strong> password123</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-bt-green">Employee</span>
                      <span className="text-xs bg-bt-green text-white px-2 py-1 rounded-full">Standard</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div><strong>Email:</strong> employee@bt.com</div>
                      <div><strong>Password:</strong> password123</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> Demo accounts reset every 24 hours. 
                      Data changes are temporary and for testing purposes only.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Security Notice</span>
                </div>
                <ul className="text-xs text-gray-600 space-y-1" role="list">
                  <li>• Your session is protected with enterprise-grade encryption</li>
                  <li>• Passwords are securely hashed and never stored in plain text</li>
                  <li>• All actions are logged for security and compliance</li>
                  <li>• Session expires automatically after 8 hours of inactivity</li>
                </ul>
              </div>
            </div>
          </main>

          {/* Enhanced Footer */}
          <footer className="mt-8 text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <a 
                  href="#privacy" 
                  className="hover:text-bt-purple transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#terms" 
                  className="hover:text-bt-purple transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  Terms of Service
                </a>
                <a 
                  href="#support" 
                  className="hover:text-bt-purple transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  IT Support
                </a>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  © 2024 BT Group plc. All rights reserved.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Version 2.1.0 • Built with accessibility and security in mind
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}