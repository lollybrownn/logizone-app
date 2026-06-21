import { ChevronLeft, ChevronRight } from "lucide-react";

// Generic client-side pagination control + the hook-like helper to slice data.
// Usage:
//   const { pageItems, currentPage, totalPages, setPage } = usePagination(data, 10);
//   ...render pageItems...
//   <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />

export function paginate(items, page, perPage) {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
}

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, perPage }) {
    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * perPage + 1;
    const end = Math.min(currentPage * perPage, totalItems);

    // Show a small window of page numbers around the current page
    const pages = [];
    const windowSize = 1;
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= windowSize) {
            pages.push(p);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-50">
            <p className="text-xs text-gray-400">
                Menampilkan {start}-{end} dari {totalItems} data
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Halaman sebelumnya"
                >
                    <ChevronLeft size={14} />
                </button>

                {pages.map((p, idx) =>
                    p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">...</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors ${
                                p === currentPage
                                    ? "bg-[#1D5ABF] text-white"
                                    : "text-gray-500 hover:bg-gray-50 border border-transparent"
                            }`}
                        >
                            {p}
                        </button>
                    ),
                )}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Halaman berikutnya"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
