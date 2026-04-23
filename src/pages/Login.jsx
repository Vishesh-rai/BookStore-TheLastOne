import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LogIn, UserPlus, UserCircle, LibraryBig } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, guestLogin, user } = useAuth();
  const navigate = useNavigate();

  // ✅ AUTO REDIRECT AFTER LOGIN
  useEffect(() => {
    if (user) {
      if (user.isNewUser) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }
    }
  }, [user]);

  const handleLogin = async () => {
    await login(); // Firebase login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
            <LibraryBig size={32} />
          </div>
        </div>

        <Card className="border-black/5 bg-white shadow-2xl shadow-indigo-100 rounded-[2.5rem] overflow-hidden p-4">
          <CardHeader className="text-center space-y-2 pb-8">
            <CardTitle className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">
              BookStore
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm font-medium">
              A private digital library for curators and authors.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* SIGN IN */}
            <Button
              type="button"
              onClick={handleLogin}
              className="w-full h-15 text-xs font-black uppercase tracking-widest bg-gray-50 hover:bg-gray-100 text-foreground border border-black/5 flex items-center justify-center gap-4 transition-all active:scale-95 rounded-2xl cursor-pointer group"
            >
              <LogIn size={20} />
              Sign In with Google
            </Button>

            {/* SIGN UP (same logic now) */}
            <Button
              type="button"
              onClick={handleLogin}
              className="w-full h-15 text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-4 transition-all active:scale-95 rounded-2xl shadow-xl shadow-indigo-100 cursor-pointer group"
            >
              <UserPlus size={20} />
              Sign Up with Google
            </Button>

            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5" />
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
                <span className="bg-white px-4 text-gray-300">
                  New Perspective
                </span>
              </div>
            </div>

            {/* GUEST */}
            <Button
              type="button"
              onClick={() => {
                guestLogin();
                navigate("/");
              }}
              variant="ghost"
              className="w-full h-12 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <UserCircle size={20} />
              Continue as Guest
            </Button>

          </CardContent>
        </Card>

        <p className="mt-8 text-center text-gray-300 text-[10px] font-bold uppercase tracking-widest">
          Reading opens worlds of possibilities.
        </p>
      </motion.div>
    </div>
  );
}