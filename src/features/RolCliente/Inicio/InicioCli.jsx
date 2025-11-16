// src/features/RolCliente/Inicio/Inicio.jsx
import Hero from "../../../components/ComponentsCli/Hero";
import AreaDeportiva from "../AreaDeportiva/AreaDeportiva"
import Servicios from "./Servicios";
import Nosotros from "./Nosotros";
import MisionVision from "./MisionVision"
import Contacto from "./Contacto"
import Footer from "./Footer"

export default function Inicio() {
  return (
    <div style={{ overflow: "hidden" }}>
      <Hero />
      <Servicios />
      <AreaDeportiva />
      <Nosotros/>
      <MisionVision/>
      <Contacto/> 
      <Footer/> 
    </div>
  );
}