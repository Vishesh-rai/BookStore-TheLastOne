import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import { signOut } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ NEW (guest modal global control)
  const [showGuestModal, setShowGuestModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      try {
        if (u) {
          const userRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            // ✅ existing user
            setUser(userSnap.data());
          } else {
            // ✅ new user → create in Firestore
            const newUser = {
              uid: u.uid,
              name: u.displayName,
              email: u.email,
              role: null,
              isNewUser: true,
              wishlist: [],
            };

            await setDoc(userRef, newUser); // 🔥 IMPORTANT LINE

            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth/Firestore error:", err);
        setUser(null); // prevent infinite loading
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // ❌ DO NOTHING HERE
      // Firebase will handle user automatically
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        console.error("Login error:", err);
      }
    }
  };

  const guestLogin = () => {
    setUser({
      uid: "guest",
      name: "Guest",
      role: "guest",
      wishlist: [],
      isNewUser: false,
    });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const completeOnboarding = async (userData) => {
    if (!user) return;

    const newUser = {
      uid: user.uid,
      name: userData.name,
      email: user.email,
      role: userData.role,
      wishlist: [],
      isNewUser: false,
    };

    // ✅ Save to Firestore
    await setDoc(doc(db, "users", user.uid), newUser);

    setUser(newUser);
  };

  const updateWishlist = async (bookId) => {
    if (!user || user.role === null) {
      setShowGuestModal(true);
      return;
    }

    let updatedWishlist;

    if (user.wishlist.includes(bookId)) {
      updatedWishlist = user.wishlist.filter((id) => id !== bookId);
    } else {
      updatedWishlist = [...user.wishlist, bookId];
    }

    const updatedUser = {
      ...user,
      wishlist: updatedWishlist,
    };

    // ✅ Update Firestore
    await updateDoc(doc(db, "users", user.uid), {
      wishlist: updatedWishlist,
    });

    setUser(updatedUser);
  };

  // ✅ GLOBAL AUTH CHECK FUNCTION
  const requireAuth = () => {
    if (!user || user.role === null) {
      setShowGuestModal(true);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        guestLogin,
        logout,
        completeOnboarding,
        updateWishlist,
        showGuestModal,
        setShowGuestModal,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
