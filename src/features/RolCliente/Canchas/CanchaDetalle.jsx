// src/features/RolCliente/Cancha/CanchaDetalle.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCancha } from "../../../api/CanchaApi";
import DisciplinaCli from "../Disciplina/DisciplinaCli";
import CanchaDetallesExtras from "./CanchaDetallesExtras";
import CanchaMapa from "./CanchaMapa";
import { ChevronLeft, Phone, Mail, ChevronRight } from "lucide-react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext"; 
import EquipamientoCliModal from "../Equipamiento/EquipamientoCliModal";
import ComentariosCancha from "../Comentario/ComentariosCancha";

export default function CanchaDetalle() {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, isClient } = useAuth();
  const [error, setError] = useState('');
  const [disciplina, setDisciplina] = useState(null);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [isEquipamientoOpen, setIsEquipamientoOpen] = useState(false);
  const { showToast } = useToast();

  // Estados para el carrusel de imágenes
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cargandoImagen, setCargandoImagen] = useState(true);
  const [showGallery, setShowGallery] = useState(false);

  const getUrlImagenCompleta = (urlAcceso) => {
    if (!urlAcceso) return "https://placehold.co/600x400?text=Sin+Imagen";
    
    if (urlAcceso.startsWith('http')) {
      return urlAcceso;
    }
    
    const baseUrl = 'http://localhost:8032';
    return `${baseUrl}${urlAcceso.startsWith('/') ? urlAcceso : `/${urlAcceso}`}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCancha(id);
        setCancha(data);
        
        if (data.imagenes && data.imagenes.length > 0) {
          const primeraImagen = data.imagenes[0];
          const urlImagen = getUrlImagenCompleta(primeraImagen.urlAcceso);
          
          const img = new Image();
          img.onload = () => {
            setCargandoImagen(false);
          };
          img.onerror = () => {
            setCargandoImagen(false);
          };
          img.src = urlImagen;
        } else {
          console.log("⚠️ No hay imágenes disponibles para esta cancha");
          setCargandoImagen(false);
        }
      } catch (e) {
        console.error("Error al cargar cancha", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const nextImage = () => {
    if (cancha.imagenes && cancha.imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === cancha.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (cancha.imagenes && cancha.imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? cancha.imagenes.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const getCurrentImageUrl = () => {
    if (cancha.imagenes && cancha.imagenes.length > 0) {
      const imagenActual = cancha.imagenes[currentImageIndex];
      return getUrlImagenCompleta(imagenActual.urlAcceso);
    }
    return "https://placehold.co/600x400?text=Sin+Imagen";
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/600x400?text=Error+Cargando";
  };

  const handleReservar = () => {
    if (!disciplina) {
      showToast("Por favor, selecciona una disciplina antes de reservar.", "warning");
      return;
    }
    setError("");
    const url = `/reservascli?canchaId=${cancha.idCancha}&disciplinaId=${disciplina.idDisciplina}`;
    if (currentUser && isClient) {
      navigate(url);
    } else {
      navigate("/login", { state: { from: url } });
    }
  };

  const pageBg = isDarkMode ? 'bg-[#0f1213]' : 'bg-[#ffffff]';
  const cardBg = isDarkMode ? 'bg-[#1a1d1e]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#2d3748]' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const accentColor = isDarkMode ? '#2C7366' : '#41bfb2';
  const warningColor = isDarkMode ? '#f35734' : '#f28627';
  const errorColor = isDarkMode ? '#8a2628' : '#d61727';
  const spinnerColor = isDarkMode ? '#f35734' : '#f28627';

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${pageBg}`}>
        <div
          className="w-10 h-10 border-4 border-transparent rounded-full animate-spin"
          style={{ borderTopColor: spinnerColor }}
        ></div>
      </div>
    );
  }

  if (!cancha) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen text-center px-4 transition-colors duration-300 ${pageBg}`}>
        <p className={`${secondaryText} text-lg mb-4`} style={{ fontFamily: 'var(--font-Balo)' }}>
          Cancha no encontrada.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-semibold transition-colors"
          style={{
            fontFamily: 'var(--font-josefin)',
            color: isDarkMode ? '#f35734' : '#f28627'
          }}
        >
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
      </div>
    );
  }

  let estaAbierta = false;
  if (cancha?.areaDeportiva?.horaInicioArea && cancha?.areaDeportiva?.horaFinArea) {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();
    const tiempoActual = horaActual * 60 + minutoActual;

    const [hInicio, mInicio] = cancha.areaDeportiva.horaInicioArea.split(':').map(Number);
    const [hFin, mFin] = cancha.areaDeportiva.horaFinArea.split(':').map(Number);

    const inicioMin = hInicio * 60 + mInicio;
    const finMin = hFin * 60 + mFin;

    estaAbierta = tiempoActual >= inicioMin && tiempoActual <= finMin;
  }

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasMultipleImages = cancha.imagenes && cancha.imagenes.length > 1;

  return (
    <div className={`pt-10 w-full transition-colors duration-300 ${pageBg}`}>
      {/* HEADER IMAGEN + GALERÍA */}
      <div className="relative w-full max-w-6xl mx-auto mt-4 px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 z-30 font-semibold px-4 py-2 rounded-lg shadow-lg backdrop-blur-md transition"
          style={{
            backgroundColor: isDarkMode ? "rgba(167, 3, 3, 0.55)" : "rgba(237, 13, 13, 0.75)",
            color: isDarkMode ? "#ffffff" : "#fafafaff",
            fontFamily: "var(--font-josefin)",
          }}
        >
          <ChevronLeft className="w-5 h-5" /> Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Imagen principal con carrusel */}
          <div className="md:col-span-3 rounded-xl overflow-hidden shadow-lg h-80 md:h-96 relative">
            {cargandoImagen ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <div className="text-white" style={{fontFamily: "var(--font-Balo)"}}>Cargando imagen...</div>
              </div>
            ) : (
              <>
                <img
                  src={getCurrentImageUrl()}
                  alt={cancha.nombre}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 z-20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 z-20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
                      {cancha.imagenes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentImageIndex 
                              ? 'bg-white shadow-lg scale-125' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium z-20">
                      {currentImageIndex + 1} / {cancha.imagenes.length}
                    </div>
                  </>
                )}
              </>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h1
                className="text-2xl md:text-3xl tracking-wide"
                style={{ fontFamily: 'var(--font-Oswald)' }}
              >
                {cancha.nombre}
              </h1>
            </div>
          </div>

          {/* Mini galería */}
          <div className="md:col-span-1 space-y-4">
            {cancha.imagenes && cancha.imagenes.length > 0 ? (
              cancha.imagenes.slice(0, 3).map((imagen, i) => {
                const urlImagen = getUrlImagenCompleta(imagen.urlAcceso);
                return (
                  <button
                    key={i}
                    onClick={() => goToImage(i)}
                    className={`w-full rounded-xl overflow-hidden shadow-md transition-all duration-200 hover:scale-105 ${
                      currentImageIndex === i ? 'ring-4 ring-offset-2' : ''
                    }`}
                    style={{
                      ringColor: currentImageIndex === i ? accentColor : 'transparent',
                    }}
                  >
                    <img
                      src={urlImagen}
                      alt={`${cancha.nombre} imagen ${i + 1}`}
                      className="w-full h-[7rem] object-cover"
                      onError={(e) => {
                        console.error(`❌ Error cargando mini galería imagen ${i + 1}`);
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Error+Cargando";
                      }}
                    />
                  </button>
                );
              })
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-md">
                  <img
                    src="https://placehold.co/600x400?text=Sin+Imagen"
                    alt={`${cancha.nombre} placeholder`}
                    className="w-full h-[7rem] object-cover"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Resto del código permanece igual */}
      <div className={`w-full mt-8 transition-colors duration-300 `}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 text-sm md:text-base overflow-x-auto pb-2">
            <button
              onClick={() => {
                scrollToSection("descripcion-section");
                setActiveTab("descripcion");
              }}
              className={`pb-2 transition-all duration-200 ${
                activeTab === "descripcion"
                  ? "font-semibold"
                  : `${secondaryText} opacity-80 hover:opacity-100`
              }`}
              style={{
                borderBottom: `2px solid ${
                  activeTab === "descripcion" ? accentColor : "transparent"
                }`,
                color: activeTab === "descripcion" ? accentColor : "",
              }}
            >
              Descripción General
            </button>

            <button
              onClick={() => {
                scrollToSection("disciplina-section");
                setActiveTab("disciplina");
              }}
              className={`pb-2 transition-all duration-200 ${
                activeTab === "disciplina"
                  ? "font-semibold"
                  : `${secondaryText} opacity-80 hover:opacity-100`
              }`}
              style={{
                borderBottom: `2px solid ${
                  activeTab === "disciplina" ? accentColor : "transparent"
                }`,
                color: activeTab === "disciplina" ? accentColor : "",
              }}
            >
              Disciplina
            </button>

            <button
              onClick={() => {
                setIsEquipamientoOpen(true);
                setActiveTab("equipamiento");
              }}
              className={`pb-2 transition-all duration-200 ${
                activeTab === "equipamiento"
                  ? "font-semibold"
                  : `${secondaryText} opacity-80 hover:opacity-100`
              }`}
              style={{
                borderBottom: `2px solid ${
                  activeTab === "equipamiento" ? accentColor : "transparent"
                }`,
                color: activeTab === "equipamiento" ? accentColor : "",
              }}
            >
              Equipamiento
            </button>

            <button
              onClick={() => {
                scrollToSection("opiniones-section");
                setActiveTab("opiniones");
              }}
              className={`pb-2 transition-all duration-200 ${
                activeTab === "opiniones"
                  ? "font-semibold"
                  : `${secondaryText} opacity-80 hover:opacity-100`
              }`}
              style={{
                borderBottom: `2px solid ${
                  activeTab === "opiniones" ? accentColor : "transparent"
                }`,
                color: activeTab === "opiniones" ? accentColor : "",
              }}
            >
              Opiniones
            </button>
          </div>
        </div>
      </div>

      <div id="descripcion-section" className="max-w-6xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={`p-6 rounded-xl`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1
                className="text-2xl md:text-3xl tracking-wide"
                style={{ fontFamily: 'var(--font-Oswald)', color: textColor }}
              >
                {cancha.nombre}
              </h1>
              <span
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: estaAbierta
                    ? (isDarkMode ? '#2C736640' : '#41bfb220')
                    : (isDarkMode ? '#8a262840' : '#d6172720'), 
                  color: estaAbierta ? accentColor : errorColor
                }}
              >
                {estaAbierta ? "Abierto" : "Cerrado"}
              </span>
            </div>

            <p className={`mt-2 ${secondaryText}`} style={{ fontFamily: 'var(--font-Balo)' }}>
              {cancha.areaDeportiva?.zona?.macrodistrito?.nombre} – {cancha.areaDeportiva?.zona?.nombre}
            </p>

            <div className="flex flex-col gap-2 mt-4 text-sm">
              {cancha.areaDeportiva?.telefonoArea && (
                <a
                  href={`tel:${cancha.areaDeportiva.telefonoArea}`}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                  style={{ color: secondaryText }}
                >
                  <Phone 
                    className="w-4 h-4 flex-shrink-0" 
                    style={{ color: isDarkMode ? '#f35734' : '#f28627' }} 
                  />
                  {cancha.areaDeportiva.telefonoArea}
                </a>
              )}
              {cancha.areaDeportiva?.emailArea && (
                <a
                  href={`mailto:${cancha.areaDeportiva.emailArea}`}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                  style={{ color: secondaryText }}
                >
                  <Mail 
                    className="w-4 h-4 flex-shrink-0" 
                    style={{ color: isDarkMode ? '#f35734' : '#f28627' }} 
                  />
                  {cancha.areaDeportiva.emailArea}
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className={`flex-1 min-w-[140px] ${cardBg} ${borderColor} border rounded-xl p-4`}>
                <p className={`text-sm ${secondaryText}`}>Costo/Hora</p>
                <p className="text-xl font-bold mt-1" style={{ color: warningColor }}>
                  {cancha.costoHora?.toFixed(2) || '0.00'} Bs
                </p>
              </div>
              <div className={`flex-1 min-w-[140px] ${cardBg} ${borderColor} border rounded-xl p-4`}>
                <p className={`text-sm ${secondaryText}`}>Capacidad</p>
                <p className="text-xl font-bold mt-1" style={{ color: textColor }}>
                  {cancha.capacidad} Pers.
                </p>
              </div>
            </div>
          </div>

          <div className={`p-6 `}>
            <CanchaDetallesExtras cancha={cancha} />
          </div>
        </div>

        <div className={`p-6 rounded-xl ${cardBg} ${borderColor} border shadow-sm`}>
          <h3
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-Alumni)', color: accentColor }}
          >
            Ubicación
          </h3>
          <CanchaMapa cancha={cancha} />
        </div>
      </div>

      <div id="disciplina-section" className={`mt-12 py-10 px-4 transition-colors duration-300 `} style={{ 
        backgroundColor: isDarkMode ? '#0b0d0e' : '#e5ededff'
      }}>
        <div className="max-w-4xl mx-auto">
          <h3
            className="text-xl font-semibold mb-6"
            style={{ fontFamily: 'var(--font-Oswald)', color: textColor }}
          >
            Escoge tu Disciplina Favorita
          </h3>
          <DisciplinaCli canchaId={cancha.idCancha} onSelectDisciplina={setDisciplina} />
          {disciplina && (
            <p className="mt-3 text-green-500 font-medium text-sm" style={{ color: accentColor }}>
              ✓ {disciplina.nombre}
            </p>
          )}
          {error && <p className="text-sm mt-2" style={{ color: errorColor }}>{error}</p>}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleReservar}
              className={`px-8 py-3 rounded-lg font-semibold text-white shadow-md flex items-center justify-center gap-2 transition-all`}
              style={{
                fontFamily: 'var(--font-josefin)',
                backgroundColor: disciplina ? errorColor : warningColor,
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                minWidth: '180px'
              }}
            >
              Reservar Ya
            </button>
          </div>
        </div>
      </div>

      <div id="opiniones-section" className="mt-16">
        <ComentariosCancha canchaId={cancha.idCancha} />
      </div>

      {isEquipamientoOpen && (
        <EquipamientoCliModal 
          canchaId={cancha.idCancha} 
          onClose={() => setIsEquipamientoOpen(false)} 
        />
      )}
    </div>
  );
}