import React from 'react';
import { useParams } from 'react-router-dom';
import ModificarResolucion from './ModificarResolucion';

const Modificar = () => {
  const { numeroResolucion } = useParams(); // Se espera una ruta: /modificar/:numeroResolucion
  return <ModificarResolucion numeroResolucion={numeroResolucion} />;
};

export default Modificar;
