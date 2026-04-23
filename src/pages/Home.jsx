import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/components/AuthContext";
import { db } from "@/services/firebase";
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
// import { doc, updateDoc, increment } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BookCard from "@/components/BookCard";
import GuestModal from "@/components/GuestModal";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { db } from "@/services/firebase";
// firestore
//Drawer
//handlePreview
//BookCard
import {
  ExternalLink,
  Download,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
//library
export default function Home() {
  const { user, updateWishlist } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  // const [selectedBook, setSelectedBook] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  // ✅ HANDLERS
  // const handlePreview = (book) => {
  //   window.open(book.pdfUrl, "_blank");
  // };
  // ✅ ADD THIS HERE 👇 (with other functions)
  const handleDetails = (book) => {
    console.log("[Home] View Details clicked for featured book");
    featuredBook && handleBookClick(featuredBook);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(booksData);
    });

    return () => unsubscribe();
  }, []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  const handleWishlistFromCard = (e, bookId) => {
    e.stopPropagation();
    if (!user || user.role === "guest") {
      setIsGuestModalOpen(true);
      return;
    }
    updateWishlist(bookId);
  };
  const handlePreview = async (book) => {
    console.log("[Home] handlePreview clicked");

    if (!user || user.role === "guest") {
      setIsGuestModalOpen(true);
      return;
    }

    try {
      const bookRef = doc(db, "books", book.id);

      await updateDoc(bookRef, {
        downloadsCount: increment(1),
      });

      window.open(book.pdfUrl, "_blank");
    } catch (err) {
      console.error("Preview error:", err);
    }
  };

  const handleLike = (bookId) => {
    if (!requireAuth()) return;

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;

        const alreadyLiked = b.likedBy?.includes(user.uid);
        const alreadyDisliked = b.dislikedBy?.includes(user.uid);

        if (alreadyLiked) return b;

        let newLikes = (b.likesCount || 0) + 1;
        let newDislikes = b.dislikesCount || 0;

        if (alreadyDisliked) {
          newDislikes -= 1;
        }

        return {
          ...b,
          likesCount: newLikes,
          dislikesCount: newDislikes,
          likedBy: [...(b.likedBy || []), user.uid],
          dislikedBy: (b.dislikedBy || []).filter((id) => id !== user.uid),
        };
      }),
    );
  };

  const handleDislike = (bookId) => {
    if (!requireAuth()) return;

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;

        const alreadyLiked = b.likedBy?.includes(user.uid);
        const alreadyDisliked = b.dislikedBy?.includes(user.uid);

        if (alreadyDisliked) return b;

        let newLikes = b.likesCount || 0;
        let newDislikes = (b.dislikesCount || 0) + 1;

        if (alreadyLiked) {
          newLikes -= 1;
        }

        return {
          ...b,
          dislikesCount: newDislikes,
          likesCount: newLikes,
          dislikedBy: [...(b.dislikedBy || []), user.uid],
          likedBy: (b.likedBy || []).filter((id) => id !== user.uid),
        };
      }),
    );
  };

  const toggleWishlist = () => {
    console.log("[Home] toggleWishlist clicked in drawer");
    if (!user || user.role === "guest") {
      console.log("[Home] Guest restricted from wishlist");
      setIsGuestModalOpen(true);
      return;
    }
    if (selectedBook) updateWishlist(selectedBook.id);
  };

  const categories = [
    "All",
    "Education",
    "Comic",
    "Manga",
    "Hentai",
    "Novel",
    "Poetry",
    "Science",
    "Technology",
  ];
  const featuredBook = books[0];
  const filteredBooks = books.filter(
    (b) => activeCategory === "All" || b.category === activeCategory,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 lg:p-10 uppercase font-black">
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Bento Top Row */}
            <div className="grid grid-cols-12 gap-6 h-auto lg:h-[400px]">
              {/* Featured Card */}
              <section className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                <div className="flex-1 z-10 flex flex-col">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-full w-fit mb-4 uppercase tracking-wider">
                    Featured Release
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black leading-[0.9] mb-4 tracking-tighter">
                    {featuredBook?.title || "No Books Published Yet"}
                  </h2>
                  <p className="text-gray-500 mb-8 line-clamp-2 max-w-md normal-case font-medium">
                    {featuredBook?.description ||
                      "Connect with authors and explore our curated digital library."}
                  </p>
                  <div className="mt-auto flex gap-4">
                    <Button
                      type="button"
                      onClick={() => {
                        console.log(
                          "[Home] View Details clicked for featured book",
                        );
                        featuredBook && handleBookClick(featuredBook);
                      }}
                      className="bg-primary text-white h-14 px-8 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-transform active:scale-95 cursor-pointer"
                    >
                      View Details
                    </Button>
                    {user?.role === "author" && (
                      <Link to="/upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-2 border-gray-100 text-gray-500 h-14 px-6 rounded-2xl font-bold hover:bg-gray-50 cursor-pointer"
                        >
                          Publish Your Own
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                {featuredBook && (
                  <div className="w-56 h-72 md:h-full shrink-0 bg-gray-200 rounded-2xl shadow-2xl relative rotate-6 transform translate-y-8 group-hover:rotate-0 group-hover:translate-y-4 transition-all duration-500">
                    <img
                      src={featuredBook.imageUrl}
                      className="w-full h-full object-cover rounded-xl"
                      alt={featuredBook.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                  </div>
                )}
              </section>

              {/* Interests & Categories Card */}
              <section className="col-span-12 lg:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-black/5 flex flex-col">
                <h3 className="font-bold text-xl mb-6">Your Interests</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => {
                        console.log(`[Home] Category filter: ${cat}`);
                        setActiveCategory(cat);
                      }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 cursor-pointer",
                        activeCategory === cat
                          ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm"
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:border-indigo-300",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="mt-auto space-y-4 pt-6 border-t border-black/5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                    Trending Today
                  </p>
                  {books.slice(1, 3).map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        console.log(
                          `[Home] Trending book click: ${book.title}`,
                        );
                        handleBookClick(book);
                      }}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={book.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                          {book.title}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {book.category} • {book.downloadsCount} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Recently Added Section */}
            <div className="mt-16 space-y-6 relative z-0">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight uppercase">
                  Recently <span className="text-primary italic">Added</span>
                </h3>
                <div className="h-px bg-black/5 flex-1 mx-6 hidden sm:block"></div>
                <span className="text-xs text-gray-400 font-bold uppercase">
                  {filteredBooks.length} Books Found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <div key={book.id}>
                    <BookCard
                      book={book}
                      onPreview={handlePreview} // ✅ for Preview button
                      onDetails={handleDetails} // ✅ for Details button
                      onLike={handleLike}
                      onDislike={handleDislike}
                    />
                  </div>
                ))}

                {/* Plus Card */}
                {user?.role === "author" && (
                  <Link to="/upload" className="block h-full min-h-[300px]">
                    <div className="h-full bg-primary rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:scale-[0.98] transition-transform">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-6 group-hover:rotate-180 transition-transform duration-500">
                        <Plus size={32} strokeWidth={3} />
                      </div>
                      <p className="text-white font-black text-xl uppercase tracking-tight">
                        Upload Your Creation
                      </p>
                      <p className="text-indigo-200 text-xs mt-2 font-medium">
                        Share your stories with
                        <br />
                        the global community
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Drawer Detail */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="bg-white border-black/5 rounded-t-[3rem] max-h-[95vh] selection:bg-primary/10">
          <div className="mx-auto w-12 h-1.5 bg-gray-200 rounded-full mt-4 mb-8" />
          {selectedBook && (
            <div className="container max-w-6xl mx-auto px-6 pb-20 overflow-y-auto uppercase">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                <div className="relative">
                  <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 border-8 border-white group">
                    <img
                      src={selectedBook.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt={selectedBook.title}
                    />
                  </div>
                </div>

                <div className="space-y-8 py-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 font-black">
                      <Badge className="bg-indigo-50 text-indigo-700 border-none px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px]">
                        {selectedBook.category}
                      </Badge>
                      <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Eye size={12} /> {selectedBook.downloadsCount} views
                      </span>
                    </div>
                    <h2 className="text-5xl lg:text-6xl font-black text-foreground leading-[1] tracking-tighter uppercase">
                      {selectedBook.title}
                    </h2>
                    <p className="text-2xl text-gray-400 font-medium italic underline decoration-primary/20">
                      by {selectedBook.authorName}
                    </p>
                  </div>

                  <p className="text-lg text-gray-500 leading-relaxed font-medium normal-case">
                    {selectedBook.description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-10 border-t border-black/5">
                    <Button
                      type="button"
                      onClick={() => handlePreview(selectedBook)}
                      className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white text-xl font-black rounded-2xl gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95 cursor-pointer min-w-[200px]"
                    >
                      <ExternalLink size={24} />
                      PREVIEW PDF
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleLike(selectedBook.id)}
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
                        onClick={() => handleDislike(selectedBook.id)}
                        className="h-16 w-16 rounded-2xl border-2 border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1"
                      >
                        <ThumbsDown size={24} />
                        <span className="text-[10px] font-black">
                          {selectedBook.dislikesCount || 0}
                        </span>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          console.log(
                            "[Home] Wishlist toggle clicked in drawer",
                          );
                          toggleWishlist();
                        }}
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

                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center italic">
                    Reading is the ultimate superpower
                  </p>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      <GuestModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
      />
    </div>
  );
}
// View Details
