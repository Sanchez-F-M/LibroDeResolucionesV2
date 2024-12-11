import React, { useEffect, useState } from 'react';

import { products } from '../../ProductsMock';
import ItemDetail from './itemDetail';
const ItemDetailContainer = () => {
  const [item, setItem] = useState({});

  const id = '1';

  useEffect(() => {
    let product = products.find(product => product.id === id);
    if (product) {
      setItem(product);
    } else {
      console.error('Producto no encontrado');
    }
  }, []);

  return <ItemDetail />;
};

export default ItemDetailContainer;
