// const USERS_KEY = 'bookstore_users';
// const BOOKS_KEY = 'bookstore_books';
// const CURRENT_USER_KEY = 'bookstore_current_session';

// // Initial Books Data
// const DEFAULT_BOOKS = [
//   {
//     id: '1',
//     title: 'The Great Gatsby',
//     description: 'A classic novel set in the Roaring Twenties.',
//     category: 'Novel',
//     imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
//     pdfUrl: 'https://drive.google.com/file/d/1Xy_X-X/view',
//     authorName: 'F. Scott Fitzgerald',
//     likesCount: 120,
//     dislikesCount: 5,
//     downloadsCount: 45,
//     createdAt: Date.now(),
//   },
//   {
//     id: '2',
//     title: 'Introduction to Physics',
//     description: 'Fundamental principles of physics for beginners.',
//     category: 'Education',
//     imageUrl: 'https://images.unsplash.com/photo-1532012197367-e0785873d96c?auto=format&fit=crop&q=80&w=400',
//     pdfUrl: 'https://drive.google.com/file/d/1Yy_Y-Y/view',
//     authorName: 'Dr. Jane Smith',
//     likesCount: 85,
//     dislikesCount: 2,
//     downloadsCount: 150,
//     createdAt: Date.now(),
//   },
// ];

// export const mockDb = {
//   getUsers: () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),

//   saveUser: (user) => {
//     const users = mockDb.getUsers();
//     const index = users.findIndex(u => u.uid === user.uid);
//     if (index > -1) users[index] = user;
//     else users.push(user);
//     localStorage.setItem(USERS_KEY, JSON.stringify(users));
//   },

//   getBooks: () => {
//     const books = localStorage.getItem(BOOKS_KEY);
//     if (!books) {
//       localStorage.setItem(BOOKS_KEY, JSON.stringify(DEFAULT_BOOKS));
//       return DEFAULT_BOOKS;
//     }
//     return JSON.parse(books);
//   },

//   addBook: (book) => {
//     const books = mockDb.getBooks();
//     const newBook = {
//       ...book,
//       id: Math.random().toString(36).substr(2, 9),
//       likesCount: 0,
//       dislikesCount: 0,
//       downloadsCount: 0,
//       createdAt: Date.now(),
//     };
//     books.push(newBook);
//     localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
//     return newBook;
//   },

//   updateBookStats: (bookId, type) => {
//     console.log(`[mockDb] Updating book ${bookId} stat: ${type}`);
//     const books = mockDb.getBooks();
//     const book = books.find(b => b.id === bookId);
//     if (book) {
//       if (type === 'like') book.likesCount = (book.likesCount || 0) + 1;
//       if (type === 'dislike') book.dislikesCount = (book.dislikesCount || 0) + 1;
//       if (type === 'download') book.downloadsCount = (book.downloadsCount || 0) + 1;
//       localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
//     }
//   },

//   updateUserWishlist: (uid, bookId) => {
//     console.log(`[mockDb] Updating user ${uid} wishlist for book ${bookId}`);
//     const users = mockDb.getUsers();
//     const user = users.find(u => u.uid === uid);
//     if (user) {
//       if (!user.wishlist) user.wishlist = [];
//       const index = user.wishlist.indexOf(bookId);
//       if (index > -1) {
//         user.wishlist.splice(index, 1);
//         console.log(`[mockDb] Removed book ${bookId} from wishlist`);
//       } else {
//         user.wishlist.push(bookId);
//         console.log(`[mockDb] Added book ${bookId} to wishlist`);
//       }
//       mockDb.saveUser(user);
//       return user;
//     }
//     return null;
//   }
// };

// export const mockAuth = {
//   getCurrentSession: () => {
//     const session = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
//     console.log('[mockAuth] Current session:', session);
//     return session;
//   },

//   loginWithGoogle: (isSignUp = false) => {
//     console.log(`[mockAuth] Login with Google (isSignUp: ${isSignUp})`);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const existingUsers = mockDb.getUsers();
//         // Simulating finding by email
//         const existingUser = existingUsers.find(u => u.email === 'faaltu545@gmail.com');

//         if (existingUser && !isSignUp) {
//           console.log('[mockAuth] Existing user found:', existingUser);
//           localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existingUser));
//           resolve({ ...existingUser, isNewUser: false });
//         } else {
//           console.log('[mockAuth] Creating new user profile');
//           const newUser = {
//             uid: 'mock_uid_' + Math.random().toString(36).substr(2, 5),
//             name: 'Faaltu User',
//             email: 'faaltu545@gmail.com',
//             interest: 'Novel',
//             role: 'reader',
//             wishlist: [],
//             downloads: [],
//             createdAt: Date.now(),
//             isNewUser: true
//           };
//           localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
//           resolve(newUser);
//         }
//       }, 1000);
//     });
//   },

//   continueAsGuest: () => {
//     console.log('[mockAuth] Continuing as guest');
//     const guest = {
//       uid: 'guest_' + Math.random().toString(36).substr(2, 5),
//       name: 'Guest User',
//       email: '',
//       interest: 'All',
//       role: 'guest',
//       wishlist: [],
//       downloads: [],
//       createdAt: Date.now(),
//       isNewUser: false,
//     };
//     localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guest));
//     return guest;
//   },

//   logout: () => {
//     console.log('[mockAuth] Logging out');
//     localStorage.removeItem(CURRENT_USER_KEY);
//   }
// };
