import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import Feedback from "../components/Feedback";
import { confirmAccount } from "../services/api";

export default function AccountActivated() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useMemo(() => {
    return searchParams.get("token") || searchParams.get("t") || "";
  }, [searchParams]);

  useEffect(() => {
    let redirectTimer;

    const run = async () => {
      setLoading(true);
      setFeedback(null);

      if (!token) {
        setFeedback({
          type: "error",
          heading: "Link inválido",
          message: "Token não encontrado na URL. Verifique o link recebido por e-mail."
        });
        setLoading(false);
        redirectTimer = setTimeout(() => navigate("/login"), 5000);
        return;
      }

      try {
        await confirmAccount(token);
        setFeedback({
          type: "success",
          heading: "Conta ativada!",
          message: "Sua conta foi confirmada com sucesso. Você será redirecionado para o login em 5 segundos."
        });
      } catch (err) {
        setFeedback({
          type: "error",
          heading: "Não foi possível confirmar",
          message:
            err?.response?.data?.message ||
            "Não foi possível confirmar sua conta. O link pode ter expirado ou já ter sido usado."
        });
      } finally {
        setLoading(false);
        redirectTimer = setTimeout(() => navigate("/login"), 5000);
      }
    };

    run();

    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [navigate, token]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      <div className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="font-[Nunito] font-extrabold text-3xl text-center">Conta ativada!</h1>

        {feedback && (
          <Feedback
            type={feedback.type}
            heading={feedback.heading}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        )}

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full border-2 border-b-3 border-r-3 rounded-lg py-2 bg-[var(--profile-bg)] font-semibold hover:brightness-95"
        >
          Ir para o login agora
        </button>
      </div>
    </div>
  );
}
