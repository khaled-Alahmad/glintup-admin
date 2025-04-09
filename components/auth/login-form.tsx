"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { addData } from "@/lib/apiHelper";
import { setCookie } from "cookies-next";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // بيانات الدخول المؤقتة
  const demoCredentials = {
    phone: "+9711234567890",
    password: "password",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fillDemoCredentials = () => {
    setFormData(demoCredentials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      // console.log("dda");

      const response = await addData("admin/auth/login", formData);
      console.log(response);
      if ((await response).success) {
        const demoToken = btoa(JSON.stringify({ token: response.data?.access_token, exp: Date.now() + 24 * 60 * 60 * 1000 }));
        setCookie('token', response.access_token, {
          maxAge: 60 * 60 * 24, // 24 hours
          path: '/',
        });
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة تحكم Glint Up",
          variant: "default",
        });
        router.push("/");
      }


    } catch (error) {
      toast({
        title: "فشل تسجيل الدخول",
        description: (error as { response: { message: string } })?.response?.message || 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-primary/10">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          تسجيل الدخول
        </CardTitle>
        <CardDescription className="text-center">
          أدخل بيانات الدخول للوصول إلى لوحة التحكم
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block">
              رقم الهاتف
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="phone"
                dir="rtl"
                placeholder="ادخل رقم هاتفك "
                className="pl-10"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-right block">
                كلمة المرور
              </Label>
              <Button
                variant="link"
                className="px-0 font-normal text-xs text-primary"
                type="button"
              >
                نسيت كلمة المرور؟
              </Button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                dir="rtl"
                placeholder="••••••••"
                className="pr-10"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">
              تذكرني
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -mr-1 ml-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <LogIn className="ml-2 h-4 w-4" /> تسجيل الدخول
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            بيانات الدخول المؤقتة:
          </p>
          <div className="text-xs bg-muted p-2 rounded-md text-left mb-2 font-mono">
            <div>البريد الإلكتروني: {demoCredentials.phone}</div>
            <div>كلمة المرور: {demoCredentials.password}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={fillDemoCredentials}
          >
            استخدام بيانات الدخول المؤقتة
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">أو</span>
          </div>
        </div>
        <Button variant="secondary" className="w-full">
          تسجيل الدخول باستخدام Google
        </Button>
      </CardFooter>
    </Card>
  );
}
