import { motion } from "framer-motion";

export default function DepartementBanner({ departement, chef, code, year }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-linear-to-r from-(--primary) to-(--accent) text-white rounded-xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-lg"
    >
      <div>
        <div className="text-2xl font-bold mb-2">Département {departement}</div>
        <div className="text-lg">
          Code: {code} • Chef: {chef}
        </div>
      </div>
      <div className="text-xl font-semibold">
        Année académique <span className="ml-2">{year}</span>
      </div>
    </motion.div>
  );
}
