import React, { useMemo, useState, useCallback } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface DataListColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  exportValue?: (item: T) => string | number | null | undefined;
  sortable?: boolean;
  sortAccessor?: (item: T) => string | number | null | undefined;
}

interface DataListProps<T> {
  data: T[];
  columns: DataListColumn<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  title?: string;
  exportFileName?: string;
}

const DataList = <T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
  title,
  exportFileName = "export",
}: DataListProps<T>) => {
  const [sortState, setSortState] = useState<{
    index: number | null;
    direction: "asc" | "desc";
  }>({ index: null, direction: "asc" });

  const getSortableValue = useCallback((item: T, col: DataListColumn<T>) => {
    if (col.sortAccessor) return col.sortAccessor(item);
    const raw = item[col.key];
    return raw as unknown as string | number | null | undefined;
  }, []);

  const sortedData = useMemo(() => {
    if (sortState.index === null) return data;
    const col = columns[sortState.index];
    const multiplier = sortState.direction === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = getSortableValue(a, col);
      const vb = getSortableValue(b, col);

      if (va == null && vb == null) return 0;
      if (va == null) return -1 * multiplier;
      if (vb == null) return 1 * multiplier;

      const aNum =
        typeof va === "number"
          ? va
          : Number.isNaN(Number(va))
          ? null
          : Number(va);
      const bNum =
        typeof vb === "number"
          ? vb
          : Number.isNaN(Number(vb))
          ? null
          : Number(vb);

      if (aNum !== null && bNum !== null) {
        return aNum === bNum ? 0 : (aNum < bNum ? -1 : 1) * multiplier;
      }

      const aStr = String(va).toLowerCase();
      const bStr = String(vb).toLowerCase();
      if (aStr === bStr) return 0;
      return (aStr < bStr ? -1 : 1) * multiplier;
    });
  }, [data, columns, sortState, getSortableValue]);

  const handleHeaderClick = (index: number, col: DataListColumn<T>) => {
    if (col.sortable === false) return;
    setSortState((prev) => {
      if (prev.index === index) {
        return { index, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { index, direction: "asc" };
    });
  };

  const handleExportExcel = () => {
    // Prepare data for Excel export
    const headers = columns.map((c) => c.label);
    const exportData = (sortedData.length > 0 ? sortedData : data).map((item) =>
      columns.map((c) => {
        if (c.exportValue) {
          const v = c.exportValue(item);
          return v == null ? "" : String(v);
        }
        const raw = item[c.key];
        return raw == null ? "" : String(raw);
      })
    );

    // Create worksheet data with headers
    const wsData = [headers, ...exportData];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for better readability
    const colWidths = columns.map(() => ({ wch: 15 }));
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Save file
    const filename = `${exportFileName}.xlsx`;
    saveAs(blob, filename);
  };
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="data-list">
      {(title || true) && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          {title ? <h2 className="mb-0">{title}</h2> : <div />}
          <div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleExportExcel}
              disabled={(data?.length || 0) === 0}
            >
              Export Excel
            </Button>
          </div>
        </div>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => handleHeaderClick(index, col)}
                style={{
                  cursor: col.sortable === false ? "default" : "pointer",
                  whiteSpace: "nowrap",
                }}
                title={col.sortable === false ? undefined : "Sort"}
              >
                <span>
                  {col.label}
                  {sortState.index === index && (
                    <span className="ms-1">
                      {sortState.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </span>
              </th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render ? col.render(item) : String(item[col.key])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td>
                    {onEdit && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDelete(item)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                <div className="text-center py-4">No records found</div>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default DataList;
