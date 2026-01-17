import NewsArticle from "./NewsArticle";
import placeholderNewsImage from "../assets/cards/image1.png";

export default function NewsPreviewModal({ isOpen, onClose, item }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const title = item?.titulo || "(sem título)";
  const description = item?.conteudo || "";
  const link = item?.linkExterno || null;

  const rawImagePath =item?.imagemUrl || null;
  const imgSrc = rawImagePath
    ? (String(rawImagePath).startsWith("http") ? rawImagePath : `${apiUrl}${rawImagePath}`)
    : placeholderNewsImage;

  return (
    <div
      className="fixed inset-0 backdrop-blur flex items-center justify-center z-50 overflow-y-auto p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-3xl my-8">
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4">Prévia</h3>
          <div className="flex justify-center">
            <NewsArticle
              aditionalClasses="max-h-[20rem]"
              title={title}
              description={description}
              imgSrc={imgSrc}
              textColor={"text-white"}
              link={link}
            />
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t-2 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:brightness-95 px-4 py-2 rounded-lg font-semibold border-2 border-r-2 border-b-2 hover:cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
