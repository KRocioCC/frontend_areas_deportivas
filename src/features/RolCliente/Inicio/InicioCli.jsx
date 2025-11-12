// src/features/RolCliente/Inicio/Inicio.jsx
import Hero from "../../../components/ComponentsCli/Hero";
import AreaDeportiva from "../AreaDeportiva/AreaDeportiva"
//import Seccion1 from "./Seccion1"; // o lo que tengas

export default function Inicio() {
  return (
    <div>
      <Hero />
      <AreaDeportiva/>
      {/*<Seccion1 />*/}
      {/* Otras secciones aquí */}
    </div>
  );
}