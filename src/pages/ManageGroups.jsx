import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import ConfirmModal from "../components/ConfirmModal";
import PreviewModal from "../components/PreviewModal";
import { getSupportGroups, deleteGroup } from "../services/api";

export default function ManageGroups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, group: null });

  const columns = [
    {
      key: "name",
      label: "Grupo / Responsável",
      render: (row) => {
        const name = row?.name || row?.nome || row?.titulo || "-";
        const owner = row?.responsavel || row?.owner || row?.mediador;
        return (
          <div className="flex flex-col">
            <span className="uppercase font-bold">{name}</span>
            {owner && <span className="text-sm text-gray-800 font-medium">{owner}</span>}
          </div>
        );
      }
    },
    {
      key: "location",
      label: "Localização",
      render: (row) => {
        const city = row?.cidade || row?.city || "-";
        const uf = row?.estado || row?.uf || row?.state || "-";
        return `${city}/${uf}`;
      }
    },
    { key: "categoria", label: "Categoria", render: (row) => row?.categoria || row?.tema || row?.topic || "-" }
  ];

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getSupportGroups();
        const data = Array.isArray(response?.data) ? response.data : [];
        setGroups(data);
      } catch (err) {
        console.error("Erro ao carregar grupos", err);
        setFeedback({
          type: "error",
          heading: "Erro ao carregar",
          message: "Não foi possível carregar os grupos. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleEdit = (group) => {
    navigate(`/admin/grupo/editar/${group.id}`);
  };

  const handleDelete = (group) => {
    setConfirmModal({ isOpen: true, item: group });
  };

  const confirmDelete = async () => {
    const item = confirmModal.item;
    if (!item) return;

    try {
      await deleteGroup(item.id);
      setGroups(prev => prev.filter(g => g.id !== item.id));
      setFeedback({
        type: "success",
        heading: "Grupo excluído!",
        message: "O grupo foi excluído com sucesso."
      });
    } catch (err) {
      console.error("Erro ao excluir grupo", err);
      setFeedback({
        type: "error",
        heading: "Erro ao excluir",
        message: err?.response?.data?.message || "Não foi possível excluir o grupo. Tente novamente."
      });
    }
  };

  const handlePreview = (group) => {
    setPreviewModal({ isOpen: true, group });
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-4">Gerenciar Grupos</h1>
      <Link to={`/admin/grupo/criar`} className="bg-[var(--groups-bg)] px-4 py-2 self-end border-2 border-r-3 border-b-3 rounded-md mb-4 font-semibold hover:brightness-95">Novo Grupo</Link>
      <AdminTable
        columns={columns}
        data={groups}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
        showPreview
      />

      {feedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        title="Excluir Grupo"
        message={`Tem certeza que deseja excluir o grupo \"${confirmModal.item?.nome || confirmModal.item?.name}\"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, group: null })}
        type="group"
        item={previewModal.group}
      />
    </div>
  );
}
