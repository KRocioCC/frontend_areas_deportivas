// src/features/RolUsuarioControl/context/useControlContext.js
import { useContext } from 'react';
import { ControlContext } from './ControlProvider';

export const useControlContext = () => {
  const context = useContext(ControlContext);
  if (!context) {
    throw new Error('useControlContext debe usarse dentro de un ControlProvider');
  }
  return context;
};