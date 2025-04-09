"use client"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
  maxPageButtons?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showFirstLast = true,
  maxPageButtons = 5,
}: PaginationProps) {
  // ضمان أن الصفحة الحالية ضمن النطاق المسموح
  const safePage = Math.max(1, Math.min(currentPage, totalPages))

  // حساب نطاق الصفحات التي سيتم عرضها
  const getPageRange = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // عدد الأزرار على كل جانب من الصفحة الحالية
    const sideButtons = Math.floor((maxPageButtons - 1) / 2)

    let startPage = Math.max(1, safePage - sideButtons)
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

    // ضبط نطاق الصفحات إذا وصلنا إلى الحد الأقصى
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1)
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
  }

  const pageRange = getPageRange()

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={safePage === 1}
          aria-label="الصفحة الأولى"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage === 1}
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 mx-1">
        {pageRange.map((page) => (
          <Button
            key={page}
            variant={page === safePage ? "default" : "outline"}
            size="icon"
            className={`h-8 w-8 ${page === safePage ? "pointer-events-none" : ""}`}
            onClick={() => onPageChange(page)}
            aria-label={`الصفحة ${page}`}
            aria-current={page === safePage ? "page" : undefined}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage === totalPages}
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={safePage === totalPages}
          aria-label="الصفحة الأخيرة"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
