import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mb-6 text-primary"
      >
        <BookOpen size={64} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-medium text-foreground/80 tracking-tight"
      >
        Loading your library...
      </motion.p>
    </div>
  );
}
