import { useState, useMemo } from "react";
import { TbEdit } from "react-icons/tb";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdSearch } from "react-icons/md";
import Eye from '../assets/eye.svg?react';


export default function AdminTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onPreview,
  showPreview = false,
  getRowId,
  emptyMessage = "Nenhum registro encontrado",
  className = "",
  searchable = false,
  searchPlaceholder = "Buscar registros..."
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!searchable || !search.trim()) return data;
    const term = search.toLowerCase().trim();

    const extractStrings = (obj) => {
      if (!obj || typeof obj !== "object") return [];
      return Object.values(obj).flatMap((val) => {
        if (typeof val === "string") return [val.toLowerCase()];
        if (typeof val === "number") return [String(val)];
        if (val && typeof val === "object") return extractStrings(val);
        return [];
      });
    };

    return data.filter((row) =>
      extractStrings(row).some((str) => str.includes(term))
    );
  }, [data, search, searchable]);

  const resolveId = (row, index) => {
    if (typeof getRowId === "function") return getRowId(row, index);
    return row?.id ?? index;
  };

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      {searchable && (
        <div className="relative mb-4 max-w-md">
          <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full border-2 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      )}
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
          {filteredData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-4 py-6 text-center border-b-2"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {filteredData.map((row, index) => {
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
