import { useMemo, useState } from 'react';
import Button from '../components/Button';
import BackButton from '../components/BackBtn';

export default function Contact() {
  const supportEmail = 'atemporal.smd@gmail.com';
  const anonymousFormUrl = import.meta?.env?.VITE_ANON_REPORT_URL;
  console.log(anonymousFormUrl)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const canSubmit = useMemo(() => {
    return Boolean(
      form.nome.trim() &&
      form.email.trim() &&
      form.assunto.trim() &&
      form.mensagem.trim()
    );
  }, [form]);

  const handleChange = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const subject = `[diver.sos] ${form.assunto}`;
    const body = [
      `Nome: ${form.nome}`,
      `E-mail: ${form.email}`,
      '',
      form.mensagem
    ].join('\n');

    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="flex flex-col items-center px-4 lg:px-10 pt-5">
      <BackButton className="self-start mb-5"/>
      <div className="w-full max-w-[820px]">
        <h1 className="font-[Nunito] font-extrabold text-2xl mb-2">Contato / Feedbacks / Denúncias</h1>
        <p className="text-sm text-gray-700 mb-5">
          Escolha uma das opções abaixo: contato/feedback identificado por e-mail, ou denúncia/feedback anônimo via formulário externo.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white border-2 rounded-xl p-5">
            <h2 className="font-extrabold text-lg mb-1">1) Feedback / denúncia anônima</h2>
            <p className="text-sm text-gray-700">
              Se preferir, envie anonimamente aqui:
            </p>
              <a
                href={anonymousFormUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 font-bold underline"
              >
                Abrir formulário anônimo
              </a>
          </div>

          <div className="bg-white border-2 rounded-xl p-5">
            <h2 className="font-extrabold text-lg mb-1">2) Contato e feedback por e-mail</h2>
            <p className="text-sm text-gray-700">
              Preencha o formulário e enviaremos pelo seu cliente de e-mail padrão.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-sm">Nome</label>
                  <input
                    className="border-2 rounded-lg py-2 px-2"
                    value={form.nome}
                    onChange={handleChange('nome')}
                    placeholder="Seu nome"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-sm">E-mail</label>
                  <input
                    className="border-2 rounded-lg py-2 px-2"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="seuemail@exemplo.com"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Assunto</label>
                <input
                  className="border-2 rounded-lg py-2 px-2"
                  value={form.assunto}
                  onChange={handleChange('assunto')}
                  placeholder="Ex: Sugestão, problema, dúvida..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Mensagem</label>
                <textarea
                  className="border-2 rounded-lg py-2 px-2 min-h-[120px]"
                  value={form.mensagem}
                  onChange={handleChange('mensagem')}
                  placeholder="Descreva sua mensagem"
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-xs text-gray-600">
                  Ou envie direto para: <a className="underline font-semibold" href={`mailto:${supportEmail}`}>{supportEmail}</a>
                </p>
                <div className="w-full md:w-[240px]">
                  <Button type="submit" disabled={!canSubmit}>Enviar e-mail</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
