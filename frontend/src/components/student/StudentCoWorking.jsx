import { motion } from "framer-motion";
import { Search, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { cn } from "../../utils/cn";

export default function StudentCoWorking() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex h-[calc(100vh-120px)] relative justify-center"
    >
      <div className="hidden md:block w-px bg-slate-100 dark:bg-slate-800 absolute left-1/4 top-0 bottom-0 opacity-50"></div>
      <div className="hidden lg:block w-px bg-slate-100 dark:bg-slate-800 absolute right-1/4 top-0 bottom-0 opacity-50"></div>

      {/* Main Chat Area */}
      <motion.div
        variants={itemVariants}
        className="flex-1 max-w-4xl w-full flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm relative z-10"
      >
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg relative">
                SJ
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
             </div>
             <div>
                <h3 className="text-base font-black font-display text-slate-900 dark:text-white leading-none mb-1">Sarah Jenkins</h3>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">En ligne</p>
             </div>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
          {/* Header Date */}
          <div className="flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 mt-4 bg-white dark:bg-slate-900 py-1.5 px-4 rounded-full mx-auto w-max shadow-sm border border-slate-100 dark:border-slate-800">
            Aujourd'hui
          </div>

          {/* Message Other */}
          <div className="flex items-start gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
              SJ
            </div>
            <div>
               <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
                  Salut ! Tu as pu avancer sur le projet React ?
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 ml-1 block">15:30</span>
            </div>
          </div>
          
           {/* Message Other */}
          <div className="flex items-start gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center shrink-0 mt-1"></div>
            <div>
               <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200">
                  J'essaie de finir la partie Redux de mon côté.
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 ml-1 block">15:31</span>
            </div>
          </div>

          {/* Message Me */}
          <div className="flex items-start gap-4 max-w-[80%] ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
              Vous
            </div>
            <div className="flex flex-col items-end">
               <div className="bg-emerald-500 text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-md text-sm font-bold">
                  Oui quasiment ! J'ai juste les animations framer-motion à ajuster.
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 mr-1 block">15:45</span>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 sm:gap-4 items-center">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <Paperclip size={20} />
            </button>
            <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              <Smile size={20} />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Écris un message..."
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-6 py-3.5 outline-none font-medium text-slate-700 dark:text-slate-200 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-md shadow-emerald-500/20 active:scale-95 shrink-0">
              <Send
                size={18}
                className="translate-x-[2px] translate-y-[-1px] -rotate-45"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
