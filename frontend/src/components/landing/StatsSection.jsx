import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Users, BookOpen, Brain, Clock, Mic, Code2 } from "lucide-react";

function AnimatedCounter({ value, suffix = "", prefix = "", duration = 2 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats = [
  {
    icon: Brain,
    value: 6,
    suffix: "+",
    label: "Modules IA",
    description: "Résumés, Quiz, Podcasts, Exercices...",
    color: "emerald",
  },
  {
    icon: BookOpen,
    value: 100,
    suffix: "%",
    label: "Gratuit",
    description: "Aucun frais pour les étudiants",
    color: "emerald",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Disponible",
    description: "Accès permanent à tous les outils",
    color: "emerald",
  },
  {
    icon: Users,
    value: 3,
    suffix: "",
    label: "Rôles",
    description: "Admin, Chef de dept., Étudiant",
    color: "emerald",
  },
  {
    icon: Mic,
    value: 100,
    suffix: "%",
    label: "IA TTS",
    description: "Podcasts générés par l'IA",
    color: "emerald",
  },
  {
    icon: Code2,
    value: 3,
    suffix: "",
    label: "Backends",
    description: "Laravel, Node.js, Python",
    color: "emerald",
  },
];

const colorMap = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-500",
    glow: "shadow-emerald-500/20",
  },
};

export default function StatsSection() {
  return (
    <section className="relative py-14 sm:py-20 lg:py-24 bg-slate-900 overflow-hidden">
      {/* BG pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            AcademiX en{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-white bg-clip-text text-transparent">
              chiffres
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {stats.map((stat, i) => {
            const colors = colorMap[stat.color];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative p-4 sm:p-5 lg:p-6 rounded-2xl bg-slate-800 border ${colors.border} shadow-lg ${colors.glow} hover:shadow-xl transition-all`}
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-3 sm:mb-4`}
                >
                  <stat.icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div
                  className={`text-2xl sm:text-3xl font-extrabold font-display ${colors.text}`}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix}
                  />
                </div>
                <div className="text-sm font-bold text-white mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
