const Counter = () => {
  const CounterContainer = () => {
    const [contador, setContador] = useState(10);

    const sumar = () => {
      setContador(contador + 1);
    };
    const restar = () => {
      setContador(contador - 1);
    };

    return (
      <div>
        <h4>Contador:{contador}</h4>

        <button onClick={sumar}>Sumar</button>
        <button onClick={restar}>Restar</button>
      </div>
    );
  };
};

export default Counter;
