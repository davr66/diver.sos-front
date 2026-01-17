import { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";
import { getAllJobOpenings, deleteJobOpening } from "../services/api";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import ConfirmModal from "../components/ConfirmModal";
import PreviewModal from "../components/PreviewModal";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ManageJobs(){
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, job: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, job: null });
  const [jobFilter, setJobFilter] = useState('all'); // 'all' | 'pending'

  const isAdminOrModerator = user?.role === 'ADMINISTRADOR' || user?.role === 'MODERADOR';

  useEffect(() => {
    if (isAdminOrModerator) setJobFilter('pending');
  }, [isAdminOrModerator]);

  const columns = [
    { key: "title", label: "Título / Empresa", render: (row) => (
      <div className="flex flex-col">
        <span className="uppercase font-bold">{row?.title ?? "-"}</span>
        <span className="text-sm text-gray-800 font-medium">{row?.company ?? "-"}</span>
      </div>
    ) },
    { key: "status", label: "Status", render: (row) => {
      const status = row?.status || "-";
      const isActive = status?.toUpperCase() === "ATIVA";
      return (
        <span className={`px-3 py-1 rounded-md font-semibold ${
          isActive ? "bg-[var(--profile-bg)]" : "bg-gray-200 text-gray-700"
        }`}>
          {status}
        </span>
      );
    } },
    { key: "location", label: "Localização", render: (row) => {
      const city = row?.city || "-";
      const uf = row?.uf || "-";
      return `${city}/${uf}`;
    } },
    { key: "work_mode", label: "Modalidade" },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobOpenings();
        setJobs(response.data || []);
      } catch (err) {
        console.error("Erro ao carregar vagas", err);
        setFeedback({
          type: "error",
          heading: "Erro ao carregar",
          message: "Não foi possível carregar as vagas. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleEdit = (job) => {
    navigate(`/admin/vaga/editar/${job.id}`);
  };

  const handleDelete = (job) => {
    setConfirmModal({ isOpen: true, job });
  };

  const confirmDelete = async () => {
    const job = confirmModal.job;
    if (!job) return;

    try {
      await deleteJobOpening(job.id);
      setJobs(prevJobs => prevJobs.filter(j => j.id !== job.id));
      setFeedback({
        type: "success",
        heading: "Vaga excluída!",
        message: "A vaga foi excluída com sucesso."
      });
    } catch (err) {
      console.error("Erro ao excluir vaga", err);
      setFeedback({
        type: "error",
        heading: "Erro ao excluir",
        message: err?.response?.data?.message || "Não foi possível excluir a vaga. Tente novamente."
      });
    }
  };

  const handlePreview = (job) => {
    setPreviewModal({ isOpen: true, job });
  };

  const isInactiveJob = (job) => {
    const status = String(job?.status ?? '').toUpperCase();
    return status && status !== 'ATIVA';
  };

  const visibleJobs = (isAdminOrModerator && jobFilter === 'pending')
    ? jobs.filter(isInactiveJob)
    : jobs;

  if (loading) return <Loading />;

  return(
    <div className="flex flex-col items-center w-full px-4 py-4">
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-4">Gerenciar Vagas</h1>
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        {isAdminOrModerator ? (
          <div className='flex self-start gap-2'>
            <button
              onClick={() => setJobFilter('all')}
              className={`px-4 py-1 rounded-full border-2 font-bold text-sm transition-all ${
                jobFilter === 'all'
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:ring-1 hover:ring-gray-300 hover:cursor-pointer'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setJobFilter('pending')}
              className={`px-4 py-1 rounded-full border-2 font-bold text-sm transition-all ${
                jobFilter === 'pending'
                  ? 'bg-black text-white border-black'
                  : 'bg-white hover:ring-1 hover:ring-gray-300 hover:cursor-pointer'
              }`}
            >
              Aguardando aprovação
            </button>
          </div>
        ) : <span />}

        <Link to={`/admin/vaga/criar`} className="bg-[var(--jobs-bg)] px-4 py-2 self-end border-2 border-r-3 border-b-3 rounded-md font-semibold hover:brightness-95">Nova Vaga</Link>
      </div>
      <AdminTable
        columns={columns}
        data={visibleJobs}
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
        onClose={() => setConfirmModal({ isOpen: false, job: null })}
        onConfirm={confirmDelete}
        title="Excluir Vaga"
        message={`Tem certeza que deseja excluir a vaga "${confirmModal.job?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
      />

      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, job: null })}
        type="job"
        item={previewModal.job}
      />
    </div>
  )
}