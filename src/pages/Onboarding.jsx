import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Loader2,
  LibraryBig,
  User,
  PenTool,
} from "lucide-react";

export default function Onboarding() {
  const { user, completeOnboarding } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [interest, setInterest] = useState("Education");
  const [role, setRole] = useState("reader");
  const [step, setStep] = useState("form");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[Onboarding] Submitting form:", { name, interest, role });
    setStep("loading");
    setTimeout(() => {
      console.log("[Onboarding] Completing onboarding");
      completeOnboarding({ name, interest, role, isNewUser: false });
    }, 2500);
  };

  const categories = [
    "Education",
    "Comic",
    "Manga",
    "Hentai",
    "Novel",
    "Poetry",
    "Science",
    "Technology",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 uppercase font-black">
      <AnimatePresence mode="wait">
        {step === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-lg"
          >
            <div className="flex justify-center mb-10">
              <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                <LibraryBig size={32} />
              </div>
            </div>

            <Card className="border-black/5 bg-white shadow-2xl shadow-indigo-100 rounded-[2.5rem] overflow-hidden p-6 md:p-10">
              <CardHeader className="text-center space-y-2 pb-10">
                <CardTitle className="text-4xl font-black text-foreground tracking-tighter uppercase leading-none italic">
                  Welcome <span className="text-primary">Reader.</span>
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm font-medium normal-case">
                  Customize your personal library experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-gray-400 uppercase text-[10px] font-black tracking-widest px-1">
                      Your Full Name
                    </Label>
                    <Input
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => {
                        console.log(
                          `[Onboarding] Name input: ${e.target.value}`,
                        );
                        setName(e.target.value);
                      }}
                      className="bg-gray-50 border-black/5 text-foreground rounded-2xl h-16 px-6 text-lg focus:ring-primary focus:border-primary uppercase"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-400 uppercase text-[10px] font-black tracking-widest px-1">
                      Select Your Role
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          console.log("[Onboarding] Selected role: reader");
                          setRole("reader");
                        }}
                        className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all active:scale-95 cursor-pointer ${
                          role === "reader"
                            ? "border-primary bg-indigo-50 text-primary shadow-lg shadow-indigo-50"
                            : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                        }`}
                      >
                        <User size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Reader
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          console.log("[Onboarding] Selected role: author");
                          setRole("author");
                        }}
                        className={`h-24 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 transition-all active:scale-95 cursor-pointer ${
                          role === "author"
                            ? "border-primary bg-indigo-50 text-primary shadow-lg shadow-indigo-50"
                            : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                        }`}
                      >
                        <PenTool size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Author
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-400 uppercase text-[10px] font-black tracking-widest px-1">
                      Primary Interest
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            console.log(
                              `[Onboarding] Selected interest: ${cat}`,
                            );
                            setInterest(cat);
                          }}
                          className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-tight border-2 transition-all active:scale-95 cursor-pointer ${
                            interest === cat
                              ? "border-primary bg-indigo-50 text-primary shadow-lg shadow-indigo-50"
                              : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 mt-4 active:scale-95 cursor-pointer"
                  >
                    START CURATING
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-[2.5rem] border-4 border-indigo-50 border-t-primary"
              />
              <div className="absolute inset-0 flex items-center justify-center text-primary">
                <BookOpen size={48} />
              </div>
            </div>
            <div className="space-y-4 px-6 max-w-sm mx-auto">
              <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                Preparing Your{" "}
                <span className="text-primary italic">Atmosphere.</span>
              </h2>
              <p className="text-gray-400 font-medium">
                Analyzing your interests and organizing your custom
                bookshelves...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-indigo-200">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[10px] uppercase font-black tracking-widest">
                Synchronizing local data
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
