"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons/index";
import { Tooltip } from "../ui/tooltip/Tooltip";
import ActionsDropdown, { CustomActionItem } from "./ActionsDropdown";

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string; // Optional width for column (e.g., "150px", "20%", "auto")
  minWidth?: string; // Optional minimum width
  maxWidth?: string; // Optional maximum width
}

export interface ActionHandlers<T> {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCopyId?: (row: T) => void;
  customActions?: CustomActionItem<T>[];
}

export interface ReusableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: ActionHandlers<T>;
  className?: string;
}

function ReusableTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  className = "",
}: ReusableTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Handle column header click for sorting
  const handleSort = (columnKey: keyof T | string) => {
    if (sortColumn === columnKey) {
      // Toggle between asc, desc, and null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Sort the data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  // Get sort icon for column header
  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortColumn !== columnKey) {
      return null;
    }
    return sortDirection === "asc" ? (
      <ArrowUpIcon className="w-4 h-4 ml-1 inline-block" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 ml-1 inline-block" />
    );
  };

  // Helper function to render cell content with truncation and tooltip
  const renderCellContent = (column: Column<T>, value: any, row: T) => {
    if (column.render) {
      const rendered = column.render(value, row);
      // If it's a string or can be converted to string, wrap with tooltip
      const textValue = String(value ?? "");
      if (textValue.length > 30 && typeof rendered === "string") {
        return (
          <Tooltip content={textValue}>
            <div className="truncate">{rendered}</div>
          </Tooltip>
        );
      }
      return rendered;
    }

    const textValue = String(value ?? "");
    const cellContent = (
      <div
        className="truncate"
        style={{
          maxWidth: column.maxWidth || "200px",
        }}
      >
        {textValue}
      </div>
    );

    // Show tooltip if text is long (likely to be truncated)
    if (textValue.length > 25) {
      return (
        <Tooltip content={textValue}>
          {cellContent}
        </Tooltip>
      );
    }

    return cellContent;
  };

  return (
    <div
      className={`rounded-lg border ${className}`}
      style={{
        borderColor: "var(--theme-border)",
        backgroundColor: "var(--theme-surface)",
        overflow: "hidden",
      }}
    >
      <div 
        className="overflow-x-auto custom-scrollbar"
        style={{
          maxHeight: "calc(100vh - 300px)",
        }}
      >
        <Table className="w-full">
          <TableHeader
            className="border-b sticky top-0 z-10"
            style={{ 
              borderColor: "var(--theme-border)",
              backgroundColor: "var(--theme-surface)",
            }}
          >
            <TableRow>
              {/* Row number column */}
              <TableCell
                isHeader
                className="px-4 py-2.5 font-medium text-start text-theme-xs whitespace-nowrap"
                style={{
                  color: "var(--theme-text-secondary)",
                  width: "60px",
                  minWidth: "60px",
                }}
              >
                #
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  isHeader
                  className={`px-4 py-2.5 font-medium text-start text-theme-xs transition-colors whitespace-nowrap ${
                    column.sortable !== false
                      ? "cursor-pointer select-none hover:opacity-70"
                      : ""
                  }`}
                  style={{
                    color: "var(--theme-text-secondary)",
                    width: column.width || "auto",
                    minWidth: column.minWidth || "100px",
                    maxWidth: column.maxWidth || "none",
                  }}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.key)
                  }
                >
                  <span className="flex items-center gap-1.5">
                    {column.label}
                    {getSortIcon(column.key) && (
                      <span style={{ color: "var(--theme-text-tertiary)" }}>
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </span>
                </TableCell>
              ))}
              {/* Action column - always last */}
              <TableCell
                isHeader
                className="px-4 py-2.5 font-medium text-start text-theme-xs whitespace-nowrap"
                style={{
                  color: "var(--theme-text-secondary)",
                  width: "80px",
                  minWidth: "80px",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody
            style={{ borderColor: "var(--theme-border)" }}
          >
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="px-4 py-8 text-center text-theme-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="border-b transition-colors duration-150"
                  style={{
                    borderColor: "var(--theme-border)",
                    backgroundColor: "var(--theme-surface)",
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    e.currentTarget.style.backgroundColor = "var(--theme-surface-hover)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => {
                    e.currentTarget.style.backgroundColor = "var(--theme-surface)";
                  }}
                >
                  {/* Row number cell */}
                  <TableCell
                    className="px-4 py-2.5 text-theme-sm text-center"
                    style={{ 
                      color: "var(--theme-text-tertiary)",
                      width: "60px",
                      minWidth: "60px",
                    }}
                  >
                    {rowIndex + 1}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className="px-4 py-2.5 text-theme-sm"
                      style={{ 
                        color: "var(--theme-text-primary)",
                        width: column.width || "auto",
                        minWidth: column.minWidth || "100px",
                        maxWidth: column.maxWidth || "none",
                      }}
                    >
                      {renderCellContent(column, row[column.key], row)}
                    </TableCell>
                  ))}
                  {/* Action dropdown column */}
                  <TableCell 
                    className="px-4 py-2.5 whitespace-nowrap"
                    style={{
                      width: "80px",
                      minWidth: "80px",
                    }}
                  >
                    <ActionsDropdown
                      row={row}
                      onView={actions?.onView}
                      onEdit={actions?.onEdit}
                      onDelete={actions?.onDelete}
                      onCopyId={actions?.onCopyId}
                      customActions={actions?.customActions}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ReusableTable;

