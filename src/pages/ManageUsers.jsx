import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminTable from "../components/AdminTable";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import ConfirmModal from "../components/ConfirmModal";
import { getAllUsers, deleteUser } from "../services/api";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
  const API_URL = import.meta.env.VITE_API_URL;

  const columns = [
    {
      key: "name",
      label: "Nome / Perfil",
      render: (row) => {
        const name = row?.nome || row?.name || "-";
        const role = row?.perfil || row?.role;
        const avatarUrl = row?.fotoPerfil ? `${API_URL}${row.fotoPerfil}` : "../src/assets/profile-placeholder.png";
        return (
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={`Foto de ${name}`}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="flex flex-col">
              <span className="uppercase font-bold">{name}</span>
              {role && <span className="text-sm text-gray-800 font-medium">{role}</span>}
            </div>
          </div>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const status = row?.status || "-";
        const normalized = status?.toUpperCase();
        const isActive = normalized === "ATIVA" || normalized === "ATIVO" || normalized === "HABILITADO";
        return (
          <span
            className={`px-3 py-1 rounded-md font-semibold ${
              isActive ? "bg-[var(--profile-bg)]" : "bg-gray-200 text-gray-700"
            }`}
          >
            {status}
          </span>
        );
      }
    },
    {
      key: "email",
      label: "Email",
      render: (row) => row?.email || "-"
    },
    {
      key: "createdAt",
      label: "Criado em",
      render: (row) => row?.dataCriacao || row?.createdAt || "-"
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        const data = Array.isArray(response?.data) ? response.data : [];
        setUsers(data);
      } catch (err) {
        console.error("Erro ao carregar usuários", err);
        setFeedback({
          type: "error",
          heading: "Erro ao carregar",
          message: "Não foi possível carregar os usuários. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    navigate(`/admin/usuario/editar/${user.id}`);
  };

  const handleDelete = (user) => {
    setConfirmModal({ isOpen: true, item: user });
  };

  const confirmDelete = async () => {
    const item = confirmModal.item;
    if (!item) return;

    try {
      await deleteUser(item.id);
      setUsers(prev => prev.filter(u => u.id !== item.id));
      setFeedback({
        type: "success",
        heading: "Usuário excluído!",
        message: "O usuário foi excluído com sucesso."
      });
    } catch (err) {
      console.error("Erro ao excluir usuário", err);
      setFeedback({
        type: "error",
        heading: "Erro ao excluir",
        message: err?.response?.data?.message || "Não foi possível excluir o usuário. Tente novamente."
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-4">Gerenciar Usuários</h1>
      <Link to={`/admin/usuario/criar`} className="bg-[var(--profile-bg)] px-4 py-2 self-end border-2 border-r-3 border-b-3 rounded-md mb-4 font-semibold hover:brightness-95">Novo Usuário</Link>
      <AdminTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário \"${confirmModal.item?.nome || confirmModal.item?.name}\"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}