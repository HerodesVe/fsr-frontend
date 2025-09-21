import React from 'react';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableAction<T = any> {
  key: string;
  label: string;
  onClick: (record: T, index: number) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: (record: T) => boolean;
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  actions?: TableAction<T>[];
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  emptyMessage?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  actions,
  onRowClick,
  className = "",
  emptyMessage = "No hay datos disponibles"
}: TableProps<T>) => {
  const hasActions = actions && actions.length > 0;
  const allColumns = hasActions ? [...columns, { key: 'actions', title: 'Acciones', align: 'center' as const }] : columns;

  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    if (column.key === 'actions' && hasActions) {
      return (
        <div className="flex gap-2 justify-center">
          {actions.map((action) => {
            const isDisabled = action.disabled ? action.disabled(record) : false;
            return (
              <button
                key={action.key}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) {
                    action.onClick(record, index);
                  }
                }}
                disabled={isDisabled}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                  action.variant === 'danger'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50'
                    : action.variant === 'secondary'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                }`}
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (column.render) {
      return column.render(record[column.dataIndex!], record, index);
    }

    return column.dataIndex ? record[column.dataIndex] : '';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Cargando...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {allColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{
                    width: column.width,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={allColumns.length}
                  className="px-6 py-12 text-center text-gray-500"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(record, index)}
                >
                  {allColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-900 ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;


