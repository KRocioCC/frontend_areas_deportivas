// src/components/ui/CRUDForm.jsx
import React from 'react';
import Button from './Button';

const CRUDForm = ({ 
  fields, 
  values, 
  onChange, 
  onSubmit, 
  onCancel,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar"
}) => {
  const renderField = (field) => {
    const { name, label, type = 'text', required = false, options } = field;
    
    const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none";
    
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={values[name] || ''}
            onChange={onChange}
            className={baseClasses}
            required={required}
          >
            <option value="">Seleccionar...</option>
            {options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            name={name}
            value={values[name] || ''}
            onChange={onChange}
            className={baseClasses}
            rows="4"
            required={required}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={!!values[name]}
              onChange={onChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              {label}
            </label>
          </div>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={values[name] || ''}
            onChange={onChange}
            className={baseClasses}
            required={required}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.map((field, index) => (
        <div key={index}>
          {field.type !== 'checkbox' && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {renderField(field)}
        </div>
      ))}
      
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </form>
  );
};

export default CRUDForm;