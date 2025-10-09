import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Button = React.memo(({
  variant = "primary",
  size = "md",
  children,
  onClick,
  icon: Icon,
  iconRight: IconRight,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  ...props
}) => {
  // Tamaños 
  const SIZES = {
    sm: { h: 38, font: 16, padX: 16, med: 22, inset: 10, icon: 22},
    md: { h: 44, font: 14, padX: 20, med: 34, inset: 2, icon: 18 }, //aqui lo diseñe segun loq ue creo
    lg: { h: 54, font: 16, padX: 24, med: 36, inset: 10, icon: 22 },
  };
  const S = SIZES[size] || SIZES.sm;

  const VARS = {
    primary:       "var(--primary)",
    secondary:     "var(--secondary)",
    accent1:       "var(--accent1)",
    accent2:       "var(--accent2)",
    botoncrear:    "var(--botoncrear)",
    botoneditar:   "var(--botoneditar)",
    botoneliminar: "var(--botoneliminar)",
    botonguardar:  "var(--botonguardar)",
  };
  const bg = VARS[variant] || VARS.primary;

  const hasText = !!children;
  const hasLeftIcon = !!Icon || loading;
  const iconOnly = !hasText && hasLeftIcon;

  // Botón circular 
  if (iconOnly) {
    const circleOuter = {
      width: S.h,
      height: S.h,
      borderRadius: "50%",
      backgroundColor: bg,
      boxShadow: "0 8px 16px rgba(0,0,0,.14)",
      position: "relative",
      color: "#fff",
    };
    const circleInner = {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: S.med + 4,
      height: S.med + 4,
      borderRadius: "50%",
      background: "#fff",
      border: "1px solid rgba(255,255,255,.9)",
      boxShadow: "0 0 0 3px rgba(255,255,255,.95), 0 2px 6px rgba(0,0,0,.12)",
      display: "grid",
      placeItems: "center",
      zIndex: 2, 
    };

    return (
      <motion.button
        whileHover={!disabled ? { y: -3, scale: 1.03 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        type={type}
        className={`inline-flex items-center justify-center font-poppins font-semibold focus:outline-none ${className} ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        style={circleOuter}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled || loading}
        {...props}
      >
        <span style={circleInner}>
          {loading ? (
            <Loader2 size={S.icon} className="animate-spin text-gray-400" />
          ) : (
            Icon && <Icon size={S.icon} style={{ color: bg, zIndex: 3 }} />
          )}
        </span>
        {/* highlight debajo del contenido */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-all"
          style={{ background: "linear-gradient(120deg, rgba(255,255,255,.35), transparent 45%)", zIndex: 1 }}
        />
      </motion.button>
    );
  }

  // Botón cápsula con (o sin) medallón
  const pillStyle = {
    backgroundColor: bg,
    height: S.h,
    lineHeight: 1,
    fontSize: S.font,
    borderRadius: 9999,
    paddingRight: S.padX,
    paddingLeft: hasLeftIcon ? S.padX + S.med + S.inset : S.padX,
    color: "#fff",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.36)",
    filter: disabled ? "grayscale(.2) brightness(.92)" : undefined,
    position: "relative",
  };

  const medalBase = hasLeftIcon ? {
    position: "absolute",
    left: S.inset,
    top: "50%",
    transform: "translateY(-50%)",
    width: S.med,
    height: S.med,
    borderRadius: "50%",
    background: "#fff",
    border: "1px solid rgba(255,255,255,.9)",
    boxShadow: "0 0 0 3px rgba(255,255,255,.95), 0 2px 6px rgba(0, 0, 0, 0.61)",
    display: "grid",
    placeItems: "center",
    zIndex: 2, 
    pointerEvents: "none",
  } : null;

  return (
    <motion.button
      whileHover={!disabled ? { y: -3, scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      type={type}
      className={`relative inline-flex items-center justify-center font-poppins font-semibold uppercase tracking-wide focus:outline-none ${className} ${disabled ? "opacity-70 cursor-not-allowed" : "hover:brightness-105"}`}
      style={pillStyle}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {medalBase && (
        <span style={medalBase}>
          {loading ? (
            <Loader2 size={S.icon} className="animate-spin text-gray-400" />
          ) : (
            Icon && <Icon size={S.icon} style={{ color: bg, zIndex: 3 }} />
          )}
        </span>
      )}

      {children && <span className="whitespace-nowrap z-[3]">{children}</span>}
      {IconRight && <IconRight size={S.icon} className="text-white opacity-95 ml-2 z-[3]" />}

      {/* highlight debajo del contenido */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-all"
        style={{ background: "linear-gradient(120deg, rgba(255,255,255,.35), transparent 45%)", zIndex: 1 }}
      />
    </motion.button>
  );
});

export default Button;
