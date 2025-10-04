// Contenedor de acciones CRUD
import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';
import SearchInput from './SearchInput';
const CRUDActions = ({ 
  onSearch, 
  onAdd, 
  searchValue, 
  onClearSearch,
  showAddButton = true,
  customActions = []
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <SearchInput
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          onClear={onClearSearch}
          placeholder="Buscar registros..."
        />
      </div>
      <div className="flex gap-2">
        {showAddButton && (
          <Button
            variant="primary"
            onClick={onAdd}
            icon={Plus}
          >
            Nuevo
          </Button>
        )}
        {customActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'secondary'}
            onClick={action.onClick}
            icon={action.icon}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
export default CRUDActions;