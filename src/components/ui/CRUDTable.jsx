// Tabla CRUD reutilizable
import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Eye } from 'lucide-react';
import Button from './Button';

const CRUDTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  getRowClassName,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            {(onEdit || onDelete || onView) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className={getRowClassName ? getRowClassName(row) : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
              {(onEdit || onDelete || onView) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onView(row)}
                        icon={Eye}
                      />
                    )}
                    {onEdit && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit(row)}
                        icon={Edit3}
                      />
                    )}
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(row)}
                        icon={Trash2}
                      />
                    )}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron registros
        </div>
      )}
    </div>
  );
};
export default CRUDTable;