import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import { useAuth } from "./AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { preview } from "vite";

// BookCard;
export default function BookCard({
  book,
  onPreview,
  onDetails,
  onLike,
  onDislike,
}) {
  const { user } = useAuth();
  const isWishlisted = user?.wishlist?.includes(book.id);

  const fallbackImage = "https://via.placeholder.com/300x400?text=No+Image";

  const [imgSrc, setImgSrc] = useState(book.imageUrl || fallbackImage);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImgSrc(book.imageUrl || fallbackImage);
    setFailed(false);
  }, [book.imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      onClick={() => onDetails(book)}
      className="cursor-pointer group h-full"
    >
      <Card className="h-full border-black/5 bg-white hover:border-primary/30 transition-all duration-300 rounded-[2rem] overflow-hidden p-3 shadow-sm hover:shadow-xl hover:shadow-indigo-100 flex flex-col relative">
        {/* IMAGE */}
        {/* IMAGE */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4">
          <img
            src={imgSrc}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => {
              if (!failed) {
                setImgSrc(fallbackImage);
                setFailed(true);
              }
            }}
          />
        </div>

        {/* CONTENT */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-gray-400 font-black">
            <Eye size={12} />
            <span className="text-[10px]">{book.downloadsCount} views</span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              className="w-1/2 text-[10px] font-bold uppercase"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(book);
              }}
            >
              Preview
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="w-1/2 text-[10px] font-bold uppercase"
              onClick={(e) => {
                e.stopPropagation();
                onDetails(book);
              }}
            >
              Details
            </Button>
          </div>

          <Badge
            className={cn(
              "px-2 py-0.5 rounded text-[9px] font-black border-none pointer-events-none",
              book.category === "Education"
                ? "bg-indigo-50 text-indigo-700"
                : book.category === "Novel"
                  ? "bg-pink-50 text-pink-700"
                  : book.category === "Hentai"
                    ? "bg-red-50 text-red-700"
                    : book.category === "Manga"
                      ? "bg-orange-50 text-orange-700"
                      : "bg-gray-50 text-gray-400",
            )}
          >
            {book.category.toUpperCase()}
          </Badge>
        </div>

        {/* 🔥 NEW PREVIEW BUTTON */}
      </Card>
    </motion.div>
  );
}
