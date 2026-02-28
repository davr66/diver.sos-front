import { useEffect, useState } from "react";
import Feedback from "../components/Feedback";
import Loading from "../components/Loading";
import { getSkills, createSkill } from "../services/api";

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkills();
        const data = Array.isArray(response?.data) ? response.data : [];
        setSkills(data);
      } catch (err) {
        console.error("Erro ao carregar habilidades", err);
        setFeedback({
          type: "error",
          heading: "Erro ao carregar",
          message: "Não foi possível carregar as habilidades. Tente novamente."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmed = newSkillName.trim();
    if (!trimmed) {
      setFeedback({
        type: "error",
        heading: "Nome obrigatório",
        message: "Digite um nome para a habilidade."
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createSkill(trimmed);
      const created = response.data;
      setSkills(prev => [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome)));
      setNewSkillName("");
      setFeedback({
        type: "success",
        heading: "Habilidade criada!",
        message: `A habilidade "${created.nome}" foi criada com sucesso.`
      });
    } catch (err) {
      console.error("Erro ao criar habilidade", err);
      const errorMessage = err?.response?.data?.message || "Não foi possível criar a habilidade. Verifique se já existe uma com esse nome.";
      setFeedback({
        type: "error",
        heading: "Erro ao criar",
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-4">
      <h1 className="font-[Nunito] font-extrabold text-2xl mb-6">Gerenciar Habilidades</h1>

      <form onSubmit={handleAddSkill} className="w-full max-w-md mb-6 flex gap-2">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Nome da nova habilidade"
          className="flex-1 border-2 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--jobs-bg)] px-4 py-2 border-2 border-r-3 border-b-3 rounded-lg font-semibold hover:brightness-95 disabled:opacity-60"
        >
          {isSubmitting ? "Adicionando..." : "Adicionar"}
        </button>
      </form>

      <div className="w-full max-w-2xl">
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar habilidades..."
            className="w-full border-2 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="border-2 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b-2 font-semibold text-sm flex justify-between items-center">
            <span>Habilidades cadastradas</span>
            <span className="text-gray-500">{filteredSkills.length} de {skills.length}</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredSkills.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                {skills.length === 0 ? "Nenhuma habilidade cadastrada" : "Nenhuma habilidade encontrada"}
              </div>
            ) : (
              <div className="divide-y">
                {filteredSkills.map((skill) => (
                  <div key={skill.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                    <span className="font-medium">{skill.nome}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {feedback && (
        <Feedback
          type={feedback.type}
          heading={feedback.heading}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
}
