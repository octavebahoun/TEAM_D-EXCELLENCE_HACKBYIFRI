import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { communicationService } from "../../services/communicationService";
import CommunicationComposer from "../communications/CommunicationComposer";
import CommunicationsFeed from "../communications/CommunicationsFeed";

const SCOPE = "responsable";

export default function ResponsableCommunications() {
  const [filieres, setFilieres] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [fils, comms] = await Promise.all([
        communicationService.filieres(SCOPE),
        communicationService.list(SCOPE),
      ]);
      setFilieres(Array.isArray(fils) ? fils : []);
      setCommunications(comms?.data ?? (Array.isArray(comms) ? comms : []));
    } catch (e) {
      toast.error("Erreur lors du chargement des communications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePublish = async (payload) => {
    const tId = toast.loading("Publication…");
    try {
      const created = await communicationService.create(SCOPE, payload);
      setCommunications((prev) => [created, ...prev]);
      toast.success("Publié — la classe a été notifiée !", { id: tId });
      return true;
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Échec de la publication.",
        { id: tId },
      );
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette communication ?")) return;
    try {
      await communicationService.remove(SCOPE, id);
      setCommunications((prev) => prev.filter((c) => c.id !== id));
      toast.success("Communication supprimée");
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6 items-start pb-20">
      <div className="lg:col-span-2">
        <CommunicationComposer filieres={filieres} onPublish={handlePublish} />
      </div>
      <div className="lg:col-span-3">
        <CommunicationsFeed
          items={communications}
          loading={loading}
          onDelete={handleDelete}
          canDelete
          emptyLabel="Aucune communication pour votre classe. Publiez-en une !"
        />
      </div>
    </div>
  );
}
