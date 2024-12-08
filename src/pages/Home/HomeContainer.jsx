import React from 'react';
import Home from './Home';

//crear una promesa
const Archivos = fetch('archivos');
Archivos.then().catch();
const HomeContainer = () => {
  console.log(Home);
  return <Home />;
};

export default HomeContainer;
