import React, { useState, useEffect } from 'react';
import { agregarImagenesAreaConProgreso, agregarImagenesArea } from '../../../api/AreadeportivaApi';

export default function UploadAreaImages({ areaId, onUploaded }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!files || files.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = files.map((f) => URL.createObjectURL(f));
    setPreviews(objectUrls);

    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    if (valid.length !== selected.length) {
      alert('Algunos archivos no son imágenes o exceden 10MB. Los inválidos fueron ignorados.');
    }
    setFiles(valid);
    setError(null);
  };

  const handleUpload = async () => {
    if (!areaId) {
      setError('No se proporcionó areaId');
      return;
    }
    if (!files.length) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Si existe la variante con progreso, úsala para mostrar barra
      if (agregarImagenesAreaConProgreso) {
        await agregarImagenesAreaConProgreso(areaId, files, (ev) => {
          if (ev.lengthComputable) {
            const pct = Math.round((ev.loaded * 100) / ev.total);
            setProgress(pct);
          }
        });
      } else {
        // Fallback: usar la versión sin progreso
        await agregarImagenesArea(areaId, files);
        setProgress(100);
      }

      setTimeout(() => setProgress(0), 400);
      setFiles([]);
      onUploaded?.();
    } catch (err) {
      console.error('Error al subir imágenes:', err);
      setError(err.response?.data?.message || err.message || 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto card text-gray-900">
      <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes de la Área Deportiva</label>
      <input type="file" accept="image/*" multiple onChange={handleSelect} />

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="w-full h-28 overflow-hidden rounded border">
              <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="px-4 py-2 bg-[#45bfb5] text-white rounded shadow disabled:opacity-50"
        >
          {uploading ? 'Subiendo...' : 'Subir imágenes'}
        </button>

        <button
          onClick={() => { setFiles([]); setError(null); }}
          className="px-4 py-2 bg-gray-100 rounded"
        >
          Limpiar
        </button>
      </div>

      {uploading && (
        <div className="mt-3 w-full bg-gray-200 rounded h-3">
          <div className="bg-green-500 h-3 rounded" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
