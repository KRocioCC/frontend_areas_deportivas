// src/features/RolCliente/Inicio/Inicio.jsx
import Hero from "../../../components/ComponentsCli/Hero";
import AreaDeportiva from "../AreaDeportiva/AreaDeportiva"
import BeneficiosCli from "./BeneficiosCli";
import CanchasDestacadas from "./CanchasDestacadas";
import TestimoniosCli from "./TestimoniosCli";
import ContactosCli from "./ContactoCli";


export default function Inicio() {
  return (
    <div style={{ overflow: "hidden" }}>
      <Hero />
      <AreaDeportiva />
      <BeneficiosCli />
      <CanchasDestacadas/>
      <TestimoniosCli/>
      <ContactosCli/>
    </div>
  );
}