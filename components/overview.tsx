import { motion } from 'framer-motion';
import Image from "next/image";
import { Pages } from "@/constants/en";
import ReactMarkdown from 'react-markdown';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <div className="flex flex-row justify-center gap-4 items-center">
          <h1 className="text-4xl md:text-5xl font-black text-balance">{`${Pages.chat.welcome.hello} 👋`}</h1>
        </div>
        <div className="text-muted-foreground">
          <ReactMarkdown>{Pages.chat.welcome.description}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};
