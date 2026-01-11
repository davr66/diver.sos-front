import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import ConfirmModal from "../components/ConfirmModal";
import { getNews, deleteNews } from "../services/api";

export default function ManageNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
  const API_URL = import.meta.env.VITE_API_URL;

  const columns = [
    {
      key: "titulo",
      label: "Título",
      render: (row) => (row?.titulo || row?.title || "-")
    },
    {
      key: "dataPublicacao",
      label: "Publicada em",
      render: (row) => {
        const raw = row?.dataPublicacao || row?.createdAt || row?.dataCriacao;
        if (!raw) return "-";
        const d = new Date(raw);
        return isNaN(d) ? raw : d.toLocaleDateString("pt-BR");
      }
    },
    {
      key: "autor",
      label: "Autor",
      render: (row) => {
        const author = row?.autor || row?.author;
        const name = typeof author === "object"
          ? (author?.nome || author?.name || author?.username || author?.email)
          : author;
        const photoPath = typeof author === "object" ? author?.fotoPerfil : null;
        const avatarUrl = photoPath ? `${API_URL}${photoPath}` : null;
        const initial = (name || "?").charAt(0).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={`Foto de ${name || "Autor"}`} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">{initial}</div>
            )}
            <span className="font-medium">{name || "-"}</span>
          </div>
        );
      }
    }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNews();
        const data = Array.isArray(response?.data) ? response.data : [];
        setNews(data);
      } catch (err) {
        console.error("Erro ao carregar notícias", err);
        setFeedback({
          type: "error",
          heading: "Erro ao carregar",
          message: "Não foi possível carregar as notícias. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleEdit = (item) => {
    navigate(`/admin/noticia/editar/${item.id}`);
  };

  const handleDelete = (item) => {
    setConfirmModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    const item = confirmModal.item;
    if (!item) return;

    try {
      await deleteNews(item.id);
      setNews(prev => prev.filter(n => n.id !== item.id));
      setFeedback({
        type: "success",
        heading: "Notícia excluída!",
        message: "A notícia foi excluída com sucesso."
      });
    } catch (err) {
      console.error("Erro ao excluir notícia", err);
      setFeedback({
        type: "error",
        heading: "Erro ao excluir",
        message: err?.response?.data?.message || "Não foi possível excluir a notícia. Tente novamente."
      });
    }
  };

  const handlePreview = (item) => {
    console.log("Pré-visualizar notícia", item);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-4">Gerenciar Notícias</h1>
      <Link to={`/admin/noticia/criar`} className="bg-[var(--news-bg)] px-4 py-2 self-end border-2 border-r-3 border-b-3 rounded-md mb-4 font-semibold hover:brightness-95">Nova Notícia</Link>
      <AdminTable
        columns={columns}
        data={news}
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
        title="Excluir Notícia"
        message={`Tem certeza que deseja excluir a notícia \"${confirmModal.item?.titulo || confirmModal.item?.title}\"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}
