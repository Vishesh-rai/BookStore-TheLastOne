import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/components/AuthContext";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BookCard from "@/components/BookCard";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
//

import { db } from "@/services/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
//
import {
  Heart,
  ExternalLink,
  Library,
  Eye,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Wishlist() {
  const { user, updateWishlist } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
      const allBooks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const wishlistBooks = allBooks.filter((book) =>
        user.wishlist?.includes(book.id),
      );

      setBooks(wishlistBooks);
    });

    return () => unsubscribe();
  }, [user]);
  const handleBookClick = (book) => {
    console.log(`[Wishlist] Selected book: ${book.title}`);
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  const handleWishlistFromCard = (e, bookId) => {
    e.stopPropagation();
    console.log(`[Wishlist] Toggling wishlist for: ${bookId}`);
    updateWishlist(bookId);
  };

  const handlePreview = async () => {
    if (!selectedBook) return;

    console.log(`[Wishlist] Previewing PDF for: ${selectedBook.title}`);

    try {
      const bookRef = doc(db, "books", selectedBook.id);

      await updateDoc(bookRef, {
        downloadsCount: increment(1),
      });

      window.open(selectedBook.pdfUrl, "_blank");
    } catch (err) {
      console.error("Failed to update download count:", err);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();

    if (!selectedBook) return;

    console.log(`[Wishlist] Liking book: ${selectedBook.title}`);

    try {
      const bookRef = doc(db, "books", selectedBook.id);

      await updateDoc(bookRef, {
        likesCount: increment(1),
      });
    } catch (err) {
      console.error("Like update failed:", err);
    }
  };

  const handleDislike = async (e) => {
    e.preventDefault();

    if (!selectedBook) return;

    console.log(`[Wishlist] Disliking book: ${selectedBook.title}`);

    try {
      const bookRef = doc(db, "books", selectedBook.id);

      await updateDoc(bookRef, {
        dislikesCount: increment(1),
      });
    } catch (err) {
      console.error("Dislike update failed:", err);
    }
  };

  const toggleWishlist = () => {
    if (selectedBook) {
      console.log(`[Wishlist] Toggling wishlist for: ${selectedBook.title}`);
      updateWishlist(selectedBook.id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black tracking-tight uppercase">
                Your <span className="text-primary italic">Curation.</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase">
                A private gallery of books you've saved to read later.
              </p>
            </div>

            {books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {books.map((book) => (
                  <div key={book.id}>
                    <BookCard
                      book={book}
                      onClick={handleBookClick}
                      onWishlistClick={handleWishlistFromCard}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 bg-white rounded-[3rem] border border-black/5 text-center space-y-6 shadow-sm">
                <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-primary/30">
                  <Heart size={48} />
                </div>
                <div className="space-y-4 px-6 uppercase">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-400 max-w-sm mx-auto text-[10px] font-black tracking-widest leading-relaxed">
                    Discover something new in the library and add it to your
                    personal curation.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  className="bg-primary hover:bg-primary/90 text-white px-10 h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 cursor-pointer active:scale-95 transition-all"
                >
                  Explore Library
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-white border-black/5 rounded-t-[3rem] max-h-[95vh]">
          <div className="mx-auto w-12 h-1.5 bg-gray-200 rounded-full mt-4 mb-8" />
          {selectedBook && (
            <div className="container max-w-6xl mx-auto px-6 pb-20 overflow-y-auto uppercase">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img
                    src={selectedBook.imageUrl}
                    className="w-full h-full object-cover"
                    alt={selectedBook.title}
                  />
                </div>
                <div className="space-y-8 py-6">
                  <div className="space-y-4">
                    <Badge className="bg-indigo-50 text-indigo-700 border-none px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-black">
                      {selectedBook.category}
                    </Badge>
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                      {selectedBook.title}
                    </h2>
                    <p className="text-2xl text-gray-400 font-medium italic">
                      by {selectedBook.authorName}
                    </p>
                  </div>
                  <p className="text-lg text-gray-500 leading-relaxed font-medium normal-case">
                    {selectedBook.description}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-10 border-t border-black/5">
                    <Button
                      type="button"
                      onClick={handlePreview}
                      className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-2xl gap-3 shadow-xl shadow-indigo-100 cursor-pointer active:scale-95 transition-all min-w-[200px]"
                    >
                      <ExternalLink size={24} />
                      PREVIEW PDF
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLike}
                        className="h-16 w-16 rounded-2xl border-2 border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
                      >
                        <ThumbsUp size={24} />
                        <span className="text-[10px] font-black">
                          {selectedBook.likesCount || 0}
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDislike}
                        className="h-16 w-16 rounded-2xl border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
                      >
                        <ThumbsDown size={24} />
                        <span className="text-[10px] font-black">
                          {selectedBook.dislikesCount || 0}
                        </span>
                      </Button>
                      <Button
                        type="button"
                        onClick={toggleWishlist}
                        variant="outline"
                        className={cn(
                          "h-16 w-16 rounded-2xl border-2 transition-all active:scale-95 cursor-pointer",
                          user?.wishlist?.includes(selectedBook.id)
                            ? "border-pink-500 text-pink-500 bg-pink-50"
                            : "border-gray-100 text-gray-400 hover:text-pink-500 hover:border-pink-200",
                        )}
                      >
                        <Heart
                          size={28}
                          fill={
                            user?.wishlist?.includes(selectedBook.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
