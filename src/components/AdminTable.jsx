import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import Eye from '../assets/eye.svg?react';


// Componente de tabela reutilizável para telas de administração
export default function AdminTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onPreview,
  showPreview = false,
  getRowId,
  emptyMessage = "Nenhum registro encontrado",
  className = ""
}) {
  const resolveId = (row, index) => {
    if (typeof getRowId === "function") return getRowId(row, index);
    return row?.id ?? index;
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 font-semibold border-b-2"
              >
                {col.label}
              </th>
            ))}
            <th className="text-left px-4 py-3 font-semibold border-b-2 w-[180px]">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-6 text-center border-b-2"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {data.map((row, index) => {
            const rowId = resolveId(row, index);
            return (
              <tr key={rowId}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top border-b-2">
                    {typeof col.render === "function"
                      ? col.render(row)
                      : row?.[col.key] ?? "-"}
                  </td>
                ))}
                <td className="px-4 py-3 border-b-2">
                  <div className="flex gap-2 items-center">
                    {showPreview && (
                      <button
                        type="button"
                        onClick={() => onPreview && onPreview(row)}
                        className="border-2 border-b-3 border-r-3 px-3 py-2 rounded-xl bg-white text-xs font-semibold hover:brightness-95 disabled:opacity-60 hover:cursor-pointer"
                      >
                        <Eye/>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit && onEdit(row)}
                      className="border-2 border-b-3 border-r-3 px-3 py-2 rounded-xl bg-white text-xs font-semibold hover:brightness-90 disabled:opacity-60 flex items-center justify-center
                      hover:cursor-pointer"
                    >
                      <TbEdit size={18}/>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete && onDelete(row)}
                      className="border-black border-2 border-b-3 border-r-3 px-3 py-2 rounded-xl bg-[#ff4d4f] text-white text-xs font-semibold hover:brightness-90 disabled:opacity-60 flex items-center justify-center
                      hover:cursor-pointer"
                    >
                     <FaRegTrashCan size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
