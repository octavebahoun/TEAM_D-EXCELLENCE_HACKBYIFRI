import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  MessagesSquare,
  Send,
  Paperclip,
  ArrowLeft,
  Plus,
  X,
  FileText,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authService } from "../../services/authService";
import { discussionService } from "../../services/discussionService";
import { discussionSocket } from "../../services/discussionSocket";
import { communicationService } from "../../services/communicationService";

const fmt = (v) =>
  v ? new Date(v).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "";

/**
 * Vue partagée des discussions Prof ↔ Responsable.
 * @param {boolean} isProf  true = espace professeur (peut démarrer un fil vers une classe)
 */
export default function DiscussionsView({ isProf = false }) {
  const me = authService.getCurrentUser();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // fil ouvert
  const [messages, setMessages] = useState([]);
  const [newMode, setNewMode] = useState(false); // prof : composer un nouveau fil
  const [filieres, setFilieres] = useState([]);
  const [newFiliereId, setNewFiliereId] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const showChat = Boolean(selected || newMode);

  // --- Chargement initial + socket ---
  useEffect(() => {
    loadDiscussions();
    if (isProf) {
      communicationService
        .filieres("professeur")
        .then((f) => setFilieres(Array.isArray(f) ? f : []))
        .catch(() => {});
    }
    discussionSocket.connect();
    const handler = ({ discussion_id, message }) => {
      setSelected((cur) => {
        if (cur && String(cur._id) === String(discussion_id)) {
          setMessages((prev) =>
            prev.some((m) => String(m._id) === String(message._id)) ? prev : [...prev, message],
          );
        }
        return cur;
      });
      loadDiscussions();
    };
    discussionSocket.onNewMessage(handler);
    return () => {
      discussionSocket.offNewMessage(handler);
      if (selected?._id) discussionSocket.leaveDiscussion(selected._id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadDiscussions = useCallback(async () => {
    try {
      const list = await discussionService.list();
      setDiscussions(list);
    } catch (e) {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  const openDiscussion = async (d) => {
    setNewMode(false);
    setSelected(d);
    setMessages([]);
    try {
      const { messages: msgs } = await discussionService.getMessages(d._id);
      setMessages(msgs || []);
      discussionSocket.joinDiscussion(d._id);
      loadDiscussions(); // rafraîchit les non-lus
    } catch (e) {
      toast.error("Impossible de charger la discussion.");
    }
  };

  const startNew = () => {
    setSelected(null);
    setMessages([]);
    setNewFiliereId("");
    setNewMode(true);
  };

  const backToList = () => {
    setSelected(null);
    setNewMode(false);
  };

  const isMine = (m) =>
    Number(m.sender_id) === Number(me?.id) &&
    ((isProf && m.sender_type === "professeur") ||
      (!isProf && m.sender_type === "responsable"));

  const handleSend = async (e) => {
    e.preventDefault();
    if (sending) return;
    if (!text.trim() && !file) return;
    if (newMode && !newFiliereId) {
      toast.error("Choisis une classe.");
      return;
    }

    setSending(true);
    try {
      let file_url = null;
      let file_name = null;
      if (file) {
        const uploaded = await discussionService.uploadFile(file);
        file_url = uploaded?.url || null;
        file_name = uploaded?.name || file.name;
      }

      const payload = { content: text.trim(), file_url, file_name };

      if (newMode) {
        const { discussion, message } = await discussionService.sendToClasse({
          filiere_id: newFiliereId,
          ...payload,
        });
        setNewMode(false);
        setSelected(discussion);
        setMessages([message]);
        discussionSocket.joinDiscussion(discussion._id);
      } else {
        const { message } = await discussionService.reply(selected._id, payload);
        setMessages((prev) =>
          prev.some((m) => String(m._id) === String(message._id)) ? prev : [...prev, message],
        );
      }

      setText("");
      setFile(null);
      loadDiscussions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de l'envoi.");
    } finally {
      setSending(false);
    }
  };

  const titleOf = (d) => (isProf ? d.filiere_nom || `Classe #${d.filiere_id}` : `Prof. ${d.professeur_info?.prenom || ""} ${d.professeur_info?.nom || ""}`.trim());

  return (
    <div className="flex h-[calc(100vh-9rem)] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 mb-6">
      {/* Liste */}
      <aside
        className={cn(
          "w-full md:w-80 md:shrink-0 border-r border-slate-100 dark:border-slate-800 flex flex-col",
          showChat ? "hidden md:flex" : "flex",
        )}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <MessagesSquare size={18} className="text-emerald-500" /> Discussions
          </h2>
          {isProf && (
            <button
              onClick={startNew}
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 px-2.5 py-1.5 rounded-lg"
            >
              <Plus size={13} /> Nouvelle
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : discussions.length === 0 ? (
            <div className="grid place-items-center text-center py-16 px-4">
              <Inbox size={36} className="text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isProf ? "Aucune discussion. Démarrez-en une avec une classe." : "Aucune discussion pour le moment."}
              </p>
            </div>
          ) : (
            discussions.map((d) => (
              <button
                key={d._id}
                onClick={() => openDiscussion(d)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors",
                  selected?._id === d._id && "bg-emerald-50 dark:bg-emerald-500/10",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {titleOf(d)}
                  </span>
                  {d.unread > 0 && (
                    <span className="shrink-0 text-[10px] font-black text-white bg-emerald-500 rounded-full min-w-5 h-5 px-1.5 grid place-items-center">
                      {d.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {d.last_message || "—"}
                </p>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Chat / nouveau */}
      <section className={cn("flex-1 flex flex-col min-w-0", showChat ? "flex" : "hidden md:flex")}>
        {!showChat ? (
          <div className="flex-1 grid place-items-center text-center p-8">
            <div>
              <MessagesSquare size={40} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">Sélectionne une discussion.</p>
            </div>
          </div>
        ) : (
          <>
            {/* En-tête */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button onClick={backToList} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <ArrowLeft size={18} />
              </button>
              {newMode ? (
                <select
                  value={newFiliereId}
                  onChange={(e) => setNewFiliereId(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-3 text-sm font-medium"
                >
                  <option value="" disabled>— Choisir la classe destinataire —</option>
                  {filieres.map((f) => (
                    <option key={f.id} value={f.id}>{f.nom}{f.niveau ? ` (${f.niveau})` : ""}</option>
                  ))}
                </select>
              ) : (
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{titleOf(selected)}</p>
                  <p className="text-[11px] text-slate-400">{selected?.sujet}</p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
              {newMode && messages.length === 0 && (
                <p className="text-center text-sm text-slate-400 py-8">
                  Écris un message ou joins un support de cours pour démarrer la discussion.
                </p>
              )}
              {messages.map((m) => {
                const mine = isMine(m);
                return (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", mine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                        mine
                          ? "bg-emerald-500 text-white rounded-br-md"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-md",
                      )}
                    >
                      {!mine && (
                        <p className="text-[10px] font-bold opacity-70 mb-0.5">
                          {m.sender_info?.prenom} {m.sender_info?.nom}
                        </p>
                      )}
                      {m.content && <p className="whitespace-pre-wrap break-words">{m.content}</p>}
                      {m.file_url && (
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "mt-1.5 inline-flex items-center gap-2 text-xs font-medium underline",
                            mine ? "text-white" : "text-emerald-600 dark:text-emerald-400",
                          )}
                        >
                          <FileText size={14} /> {m.file_name || "Télécharger le support"}
                        </a>
                      )}
                      <p className={cn("text-[9px] mt-1", mine ? "text-white/70" : "text-slate-400")}>{fmt(m.createdAt)}</p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800">
              {file && (
                <div className="flex items-center justify-between gap-2 mb-2 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs">
                  <span className="flex items-center gap-1.5 truncate">
                    <Paperclip size={13} className="text-emerald-500 shrink-0" /> <span className="truncate">{file.name}</span>
                  </span>
                  <button type="button" onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500 shrink-0">
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <label className="cursor-pointer p-2.5 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800" title="Joindre un support">
                  <Paperclip size={18} />
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  rows={1}
                  placeholder="Écris un message…"
                  className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-3 py-2.5 text-sm max-h-32"
                />
                <button
                  type="submit"
                  disabled={sending || (!text.trim() && !file)}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
