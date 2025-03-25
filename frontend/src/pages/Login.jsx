/* eslint-disable no-unused-vars */
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import React, { useState, useCallback } from "react";
  import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Input } from "@/components/ui/input";
  
  // Validation constants
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_REGEX = {
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /[0-9]/,
  };
  
  // Form field components to reduce duplication
  const FormField = ({
    icon: Icon,
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    disabled,
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`pl-10 ${error ? "border-red-500" : ""}`}
          disabled={disabled}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
  
  const SubmitButton = ({ loading, children, loadingText }) => (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
  
  function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("login");
  
    // Form state
    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });
  
    const [signupData, setSignupData] = useState({
      name: "",
      email: "",
      password: "",
    });
  
    // Validation state
    const [errors, setErrors] = useState({
      login: { email: "", password: "" },
      signup: { name: "", email: "", password: "" },
    });
  
    // Memoized validation functions
    const validateEmail = useCallback((email) => {
      if (!email) return "Email is required";
      if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
      return "";
    }, []);
  
    const validatePassword = useCallback((password) => {
      if (!password) return "Password is required";
      if (password.length < 8) return "Password must be at least 8 characters";
      
      if (!PASSWORD_REGEX.upper.test(password) || 
          !PASSWORD_REGEX.lower.test(password) || 
          !PASSWORD_REGEX.number.test(password)) {
        return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }
      return "";
    }, []);
  
    const validateName = useCallback((name) => {
      if (!name) return "Name is required";
      if (name.length < 2) return "Name must be at least 2 characters";
      return "";
    }, []);
  
    // Handle form changes with dynamic validation
    const handleFormChange = useCallback((formType, e) => {
      const { name, value } = e.target;
      
      const updater = formType === 'login' ? setLoginData : setSignupData;
      updater(prev => ({ ...prev, [name]: value }));
  
      // Validate on change
      let errorMessage = "";
      if (name === "email") {
        errorMessage = validateEmail(value);
      } else if (name === "password") {
        errorMessage = validatePassword(value);
      } else if (name === "name") {
        errorMessage = validateName(value);
      }
  
      setErrors(prev => ({
        ...prev,
        [formType]: {
          ...prev[formType],
          [name]: errorMessage,
        },
      }));
    }, [validateEmail, validatePassword, validateName]);
  
    // Handle form submission with validation
    const handleSubmit = useCallback(async (formType, e) => {
      e.preventDefault();
  
      const formData = formType === 'login' ? loginData : signupData;
      const newErrors = { ...errors[formType] };
  
      // Validate all fields
      if (formType === 'login') {
        newErrors.email = validateEmail(formData.email);
        newErrors.password = validatePassword(formData.password);
      } else {
        newErrors.name = validateName(formData.name);
        newErrors.email = validateEmail(formData.email);
        newErrors.password = validatePassword(formData.password);
      }
  
      setErrors(prev => ({ ...prev, [formType]: newErrors }));
  
      // Check if there are any validation errors
      if (Object.values(newErrors).some(error => error)) {
        return;
      }
  
      // Proceed with submission
      setIsLoading(true);
  
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`${formType} data:`, formData);
        // Handle success (e.g., redirect, show success message)
      } finally {
        setIsLoading(false);
      }
    }, [loginData, signupData, validateEmail, validatePassword, validateName]);
  
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 shadow-lg border border-slate-200 dark:border-slate-700 rounded-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Chat App
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
                <TabsTrigger value="signup" className="cursor-pointer">Sign Up</TabsTrigger>
              </TabsList>
  
              <TabsContent value="login">
                <form onSubmit={(e) => handleSubmit('login', e)}>
                  <div className="space-y-4">
                    <FormField
                      icon={Mail}
                      label="Email"
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={(e) => handleFormChange('login', e)}
                      placeholder="name@example.com"
                      error={errors.login.email}
                      disabled={isLoading}
                    />
                    <FormField
                      icon={Lock}
                      label="Password"
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={(e) => handleFormChange('login', e)}
                      placeholder="••••••••"
                      error={errors.login.password}
                      disabled={isLoading}
                    />
                    <SubmitButton loading={isLoading} loadingText="Logging in...">
                      Login
                    </SubmitButton>
                  </div>
                </form>
              </TabsContent>
  
              <TabsContent value="signup">
                <form onSubmit={(e) => handleSubmit('signup', e)}>
                  <div className="space-y-4">
                    <FormField
                      icon={User}
                      label="Name"
                      name="name"
                      value={signupData.name}
                      onChange={(e) => handleFormChange('signup', e)}
                      placeholder="John Doe"
                      error={errors.signup.name}
                      disabled={isLoading}
                    />
                    <FormField
                      icon={Mail}
                      label="Email"
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={(e) => handleFormChange('signup', e)}
                      placeholder="name@example.com"
                      error={errors.signup.email}
                      disabled={isLoading}
                    />
                    <FormField
                      icon={Lock}
                      label="Password"
                      type="password"
                      name="password"
                      value={signupData.password}
                      onChange={(e) => handleFormChange('signup', e)}
                      placeholder="••••••••"
                      error={errors.signup.password}
                      disabled={isLoading}
                    />
                    <SubmitButton loading={isLoading} loadingText="Creating account...">
                      Create Account
                    </SubmitButton>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" disabled={isLoading}>
                Google
              </Button>
              <Button variant="outline" type="button" disabled={isLoading}>
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  export default Login;