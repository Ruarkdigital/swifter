import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Table as TableType,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataTableOptions = {
  disablePagination: boolean;
  disableSelection: boolean;
  isLoading: boolean;
  totalCounts: number;
  manualPagination: boolean;
  setPagination: OnChangeFn<PaginationState>;
  pagination: PaginationState;
};

type ClassNames = {
  table?: string;
  tHeader?: string;
  tRow?: string;
  tHeadRow?: string;
  tBody?: string;
  tCell?: string;
  tHead?: string;
  container?: string;
  pagination?: string;
  paginationItem?: string;
  paginationLink?: string;
  paginationNext?: string;
  paginationContent?: string;
  paginationActiveLink?: string;
  paginationPrevious?: string;
  paginationEllipsis?: string;
  paginationItemDisabled?: string;
  paginationLinkDisabled?: string;
};

type DataTable<T = unknown> = {
  data: T[];
  columns: ColumnDef<T>[];
  header?: (value: TableType<T>) => ReactNode;
  options?: Partial<DataTableOptions>;
  classNames?: ClassNames;
  emptyPlaceholder?: ReactNode;
};

export function DataTable<T = unknown>({
  data,
  columns,
  header,
  options,
  classNames,
  emptyPlaceholder,
}: DataTable<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    onPaginationChange: options?.setPagination,
    onSortingChange: setSorting,
    rowCount: options?.totalCounts,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,

      pagination: options?.pagination ?? { pageIndex: 0, pageSize: 10 },
    },
  });

  const activePage = table?.getState()?.pagination?.pageIndex + 1;

  const renderTable = (
    <Table
      className={cn("border-separate border-spacing-y-3", classNames?.table)}
    >
      <TableHeader className={cn("bg-accent", classNames?.tHeader)}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className={cn(classNames?.tHeadRow)} key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className={cn("h-10", classNames?.tHead)}
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length && !options?.isLoading
          ? table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "bg-white dark:bg-slate-950 px-3",
                  classNames?.tRow
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className={cn(
                      "p-2 text-gray-900 dark:text-gray-200",
                      classNames?.tCell
                    )}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );

  const renderLoadingTable = (
    <Table className={cn("border-separate border-spacing-y-3", classNames?.table)}>
      <TableBody className={cn("bg-accent", classNames?.tHeader)}>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <TableRow key={index}>
            {[1].map((_, index) => (
              <TableCell
                colSpan={columns.length}
                className="h-10 text-center w-full"
              >
                <Skeleton key={index} className="h-8 w-full bg-slate-300" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className={cn("w-full", classNames?.container ?? "")}>
      <div className="">
        {header && (
          <div className="flex items-center py-4">{header?.(table)}</div>
        )}

        {data.length > 0 && !options?.isLoading
          ? renderTable
          : options?.isLoading
          ? renderLoadingTable
          : emptyPlaceholder}
      </div>
      <div className="grid grid-cols-2 py-4 px-3">
        {!options?.disableSelection ? (
          <div className="flex-1 text-sm dark:text-gray-200 text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        ) : (
          <div></div>
        )}

        {!options?.disablePagination && (
          <Pagination
            className={cn(
              "justify-end pt-10 md:pt-0 lg:pt-0",
              classNames?.pagination
            )}
          >
            <PaginationContent
              className={cn("", classNames?.paginationContent)}
            >
              <PaginationItem>
                <PaginationPrevious
                  className="dark:text-gray-200"
                  onClick={() => {
                    table.previousPage();
                  }}
                />
              </PaginationItem>

              {createPageNumbers(
                table.getPageCount(),
                table.getState().pagination.pageIndex + 1
              ).map((page) =>
                typeof page === "string" ? (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={activePage === page}
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  className="dark:text-gray-200"
                  onClick={() => {
                    table.nextPage();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

const createPageNumbers = (totalPages: number, currentPage: number) => {
  const pageNumbers = [];
  const pageRangeDisplayed = 2; // Number of pages to display around the current page
  //  const breakPoint = 2; // When to show breaklines

  // Generate the page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // Always show the first page
      i === totalPages || // Always show the last page
      (i >= currentPage - pageRangeDisplayed &&
        i <= currentPage + pageRangeDisplayed) // Show pages around the current page
    ) {
      pageNumbers.push(i);
    } else if (
      (i === 2 || i === totalPages - 1) && // Show second and second last page if breakline exists
      pageNumbers[pageNumbers.length - 1] !== "..."
    ) {
      pageNumbers.push("...");
    }
  }

  return pageNumbers;
};
