import { Pagination } from "@/components/ui/pagination"

interface PaginationWithInfoProps {
    currentPage: number
    totalPages: number
    totalItems?: number
    itemsPerPage?: number
    onPageChange: (page: number) => void
    className?: string
    showFirstLast?: boolean
    maxPageButtons?: number
    showItemsInfo?: boolean
}

export function PaginationWithInfo({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    className = "",
    showFirstLast = true,
    maxPageButtons = 5,
    showItemsInfo = true,
}: PaginationWithInfoProps) {
    // حساب معلومات العناصر الحالية
    const calculateItemsInfo = () => {
        if (!totalItems || !itemsPerPage) return null

        const start = (currentPage - 1) * itemsPerPage + 1
        const end = Math.min(currentPage * itemsPerPage, totalItems)

        return (
            <div className="text-sm text-muted-foreground">
                عرض {start} - {end} من {totalItems} عنصر
            </div>
        )
    }

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {showItemsInfo && calculateItemsInfo()}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showFirstLast={showFirstLast}
                maxPageButtons={maxPageButtons}
            />

            <div className="text-sm text-muted-foreground hidden sm:block">
                الصفحة {currentPage} من {totalPages}
            </div>
        </div>
    )
}
