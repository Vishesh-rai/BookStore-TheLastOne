import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthContext";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/services/firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";
import {
  Upload as UploadIcon,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";

export default function AuthorUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user && user.role !== "author") {
    return <Navigate to="/" />;
  }

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Education",
    imageUrl: "",
    pdfUrl: "",
  });

  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pdfUrl.includes("drive.google.com")) {
      alert("Must be a valid Google Drive link");
      return;
    }

    setStatus("uploading");

    let p = 0;

    const interval = setInterval(() => {
      p += 5;
      setProgress(p);

      if (p >= 100) {
        clearInterval(interval);
        saveBook(); // ✅ call async function separately
      }
    }, 40);
  };

  const saveBook = async () => {
    const newBook = {
      ...formData,
      authorName: user?.name || "Unknown Author",

      likesCount: Math.floor(Math.random() * 200),
      dislikesCount: Math.floor(Math.random() * 50),

      likedBy: [],
      dislikedBy: [],
      downloadsCount: 0,
    };

    try {
      await addDoc(collection(db, "books"), newBook);
      setStatus("success");
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("idle");
    }
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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 lg:p-10 uppercase font-black">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-black">
                Publish Your <span className="text-primary italic">Words.</span>
              </h1>

              {/* ⚠️ WARNING ADDED */}
              <p className="text-red-500 text-xs font-bold mt-2">
                ⚠️ Once a book is uploaded, it cannot be deleted.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* FORM */}
              <Card className="lg:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-sm">
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="md:col-span-2">
                    <Label>Book Title</Label>
                    <Input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        setFormData({ ...formData, category: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image URL</Label>

                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />

                    {/* ✅ ADD THIS HERE */}
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Use direct image links only (.jpg, .png, .webp). Avoid
                      Google/Yahoo search links. <br />
                      For best results, use{" "}
                      <span className="font-bold">
                        vertical (portrait) images
                      </span>
                      (e.g. book cover ratio like 3:4). Horizontal images may
                      not display properly.
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Google Drive PDF Link</Label>
                    <Input
                      required
                      type="url"
                      value={formData.pdfUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, pdfUrl: e.target.value })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Button type="submit" disabled={status === "uploading"}>
                      {status === "uploading" ? (
                        <span className="flex gap-2 items-center">
                          <Loader2 className="animate-spin" /> Publishing...
                        </span>
                      ) : (
                        <span className="flex gap-2 items-center">
                          <UploadIcon size={18} /> Publish Book
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>

              {/* PREVIEW */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 rounded-[2.5rem]">
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 font-bold">
                    {formData.title || "Book Title"}
                  </p>
                  <p className="text-xs text-gray-400">By {user?.name}</p>
                </Card>

                {/* STATUS */}
                <AnimatePresence>
                  {status !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-primary p-6 text-white rounded-xl"
                    >
                      {status === "uploading" ? (
                        <p>Uploading... {progress}%</p>
                      ) : (
                        <>
                          <p>Success! Book uploaded.</p>
                          <Button onClick={() => navigate("/")}>Go Home</Button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
