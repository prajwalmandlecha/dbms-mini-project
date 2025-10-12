import React from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';

interface DataListProps<T> {
  data: T[];
  columns: { key: keyof T; label: string; render?: (item: T) => React.ReactNode }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  title?: string;
}

const DataList = <T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
  title
}: DataListProps<T>) => {
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
      {title && <h2 className="mb-4">{title}</h2>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
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