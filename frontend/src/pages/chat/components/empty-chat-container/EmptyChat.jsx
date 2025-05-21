// import { animationDefaultOptions } from "../../../../lib/utils";
import Lottie from "react-lottie";
import { motion } from "framer-motion";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="relative bg-blue-600 h-32 w-32 rounded-2xl flex items-center justify-center transform rotate-12">
          <div className="absolute -top-3 -right-3 bg-blue-400 h-24 w-24 rounded-2xl"></div>
          <MessageSquare className="h-16 w-16 text-white z-10" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 text-3xl font-bold text-center"
      >
        Hi! Welcome to <span className="text-blue-500">ChatU</span> App.
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-4 text-slate-400 max-w-md text-center"
      >
        Connect with friends, family, and colleagues in real-time with our
        secure messaging platform.
      </motion.p>
    </div>
  );
};

export default EmptyChatContainer;
