import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../auth/hooks/useAuth';
import usuarioControlService from '../../services/usuarioControlService';
import toast from 'react-hot-toast';
import styles from './PerfilPage.module.css';

const PerfilPage = () => {
  const authContext = useAuth();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const userId = authContext?.currentUser?.id || authContext?.user?.id;

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!userId) return;
      try {
        const data = await usuarioControlService.getPerfil(userId);
        setFormData(data);
      } catch (error) {
        toast.error("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usuarioControlService.updatePerfil(userId, formData);
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      toast.error("Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-5 text-center">Cargando perfil...</div>;
  if (!formData) return null;

  return (
    <div className={styles.container}>
      <div className={styles.profileWrapper}>
        
        {/* --- COLUMNA IZQUIERDA: Tarjeta de Identidad --- */}
        <aside className={styles.sidebarCard}>
            <div className={styles.avatarWrapper}>
                {formData.urlImagen ? (
                    <img src={formData.urlImagen} alt="Avatar" className={styles.avatar} 
                         onError={(e)=>{e.target.style.display='none'; e.target.nextSibling.style.display='flex'}}/>
                ) : null}
                <div className={styles.avatarPlaceholder} style={{display: formData.urlImagen ? 'none' : 'flex'}}>
                    {formData.nombre?.charAt(0)}
                </div>
            </div>
            
            <h1 className={styles.userName}>{formData.nombre}</h1>
            <p className={styles.userEmail}>{formData.email}</p>
            <span className={styles.roleBadge}>SUPERVISOR</span>

            <div className={styles.sidebarInfo}>
                <div className={styles.infoRow}>
                    <div className={styles.infoIcon}><i className="fas fa-briefcase"></i></div>
                    <div className={styles.infoData}>
                        <label>Estado</label>
                        <span style={{color: '#41BFB3'}}>{formData.estadoOperativo}</span>
                    </div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoIcon}><i className="fas fa-clock"></i></div>
                    <div className={styles.infoData}>
                        <label>Turno</label>
                        <span>{formData.horaInicioTurno?.substring(0,5)} - {formData.horaFinTurno?.substring(0,5)}</span>
                    </div>
                </div>
            </div>
        </aside>

        {/* --- COLUMNA DERECHA: Formulario de Edición --- */}
        <main className={styles.formCard}>
            <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Editar Información</h2>
                <p className={styles.formSubtitle}>Actualiza tus datos personales y de contacto</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nombre</label>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-user className={styles.inputIcon}"></i>
                            <input className={styles.input} name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Apellido Paterno</label>
                        <div className={styles.inputContainer}>
                            <i className="far fa-user className={styles.inputIcon}"></i>
                            <input className={styles.input} name="apaterno" value={formData.apaterno} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Apellido Materno</label>
                        <div className={styles.inputContainer}>
                            <i className="far fa-user className={styles.inputIcon}"></i>
                            <input className={styles.input} name="amaterno" value={formData.amaterno} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Teléfono / Celular</label>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-phone className={styles.inputIcon}"></i>
                            <input className={styles.input} name="telefono" value={formData.telefono} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className={styles.formGroup} style={{gridColumn: 'span 2'}}>
                        <label className={styles.label}>Dirección de Domicilio</label>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-map-marker-alt className={styles.inputIcon}"></i>
                            <input className={styles.input} name="direccion" value={formData.direccion} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formGroup} style={{gridColumn: 'span 2'}}>
                        <label className={styles.label}>URL de Foto de Perfil</label>
                        <div className={styles.inputContainer}>
                            <i className="fas fa-link className={styles.inputIcon}"></i>
                            <input className={styles.input} name="urlImagen" value={formData.urlImagen || ''} onChange={handleChange} placeholder="https://..." />
                        </div>
                    </div>

                </div>

                <div className={styles.actions}>
                    <button type="submit" className={styles.btnSave} disabled={saving}>
                        {saving ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save" style={{marginRight:'8px'}}></i> GUARDAR CAMBIOS</>}
                    </button>
                </div>
            </form>
        </main>

      </div>
    </div>
  );
};

export default PerfilPage;