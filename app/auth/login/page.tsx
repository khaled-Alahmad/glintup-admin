import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/auth/login-form";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "تسجيل الدخول | Glint Up",
  description: "تسجيل الدخول إلى لوحة تحكم Glint Up",
};

export default function LoginPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col md:flex-row bg-gray-50 w-full"
    >
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md mx-auto mb-6 md:mb-8">
          <Logo size="lg" className="mx-auto" />
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Glint Up. جميع الحقوق محفوظة.
        </p>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden md:block md:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-800 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 md:p-12 lg:p-16 z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
            مرحباً بك في Glint Up
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-center max-w-md">
            منصة إدارة مزودات التجميل الأولى في المنطقة
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-bold text-xl md:text-2xl mb-1">+1000</h3>
              <p className="text-sm">مزود تجميل</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-bold text-xl md:text-2xl mb-1">+5000</h3>
              <p className="text-sm">مستخدم نشط</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-bold text-xl md:text-2xl mb-1">+10000</h3>
              <p className="text-sm">حجز شهري</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
              <h3 className="font-bold text-xl md:text-2xl mb-1">+100</h3>
              <p className="text-sm">مدينة</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
