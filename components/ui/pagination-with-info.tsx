import { Pagination } from "@/components/ui/pagination";

interface PaginationWithInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxPageButtons?: number;
  showItemsInfo?: boolean;
  showItemsPerPageSelect?: boolean;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaginationWithInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
  showFirstLast = true,
  maxPageButtons = 5,
  showItemsInfo = true,
  showItemsPerPageSelect = false,
}: PaginationWithInfoProps) {
  // حساب معلومات العناصر الحالية
  const calculateItemsInfo = () => {
    if (!totalItems || !itemsPerPage) return null;

    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
      <div className="text-sm text-muted-foreground">
        عرض {start} - {end} من {totalItems} عنصر
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        {showItemsInfo && calculateItemsInfo()}
        {showItemsPerPageSelect && onItemsPerPageChange && (
          <Select
            value={itemsPerPage?.toString()}
            onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="عدد العناصر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 عناصر</SelectItem>
              <SelectItem value="20">20 عنصر</SelectItem>
              <SelectItem value="30">30 عنصر</SelectItem>
              <SelectItem value="50">50 عنصر</SelectItem>
              <SelectItem value="100">100 عنصر</SelectItem>
              <SelectItem value="1000">عرض الكل</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

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
  );
}
