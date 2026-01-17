import { Link } from 'react-router-dom';
import { TbMessageReport, TbMessageReportFilled } from 'react-icons/tb';

export default function ContactFab({ to = '/contato' }) {
  return (
    <Link
      to={to}
      aria-label="Contato / Feedback / Denúncia"
      title="Contato / Feedback / Denúncia"
      className="group flex items-center justify-center fixed bottom-30 right-2 rounded-full border-black border-3 border-r-4 border-b-4 bg-white w-15 h-15 text-center transition-colors transition-scale lg:right-10 hover:bg-gray-200 hover:scale-102"
    >
      <span className="block group-hover:hidden">
        <TbMessageReport size={30} />
      </span>
      <span className="hidden group-hover:block">
        <TbMessageReportFilled size={30} />
      </span>
    </Link>
  );
}
