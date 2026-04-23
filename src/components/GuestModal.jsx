import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, UserPlus, X } from "lucide-react";

export default function GuestModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[90%] max-w-md rounded-2xl p-6 bg-white shadow-xl"
      >
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <DialogHeader className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-primary/30">
            <Lock size={32} />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tighter uppercase italic">
            Welcome to <span className="text-primary">BookStore.</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-medium text-sm">
            Please sign in to use this feature. Curating your own library,
            downloading PDFs, and tracking progress requires an account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button
            type="button"
            onClick={() => {
              console.log("[GuestModal] Redirecting to sign in");
              navigate("/auth");
              onClose();
            }}
            className="h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-50 cursor-pointer"
          >
            <UserPlus size={18} />
            Sign In
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              console.log("[GuestModal] Continuing as guest");
              onClose();
            }}
            className="h-12 text-gray-400 font-bold hover:text-foreground cursor-pointer"
          >
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
