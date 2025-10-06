const AnimatedLogo = () => {
  return (
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 animate-spin"></div>
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 animate-spin [animation-direction:reverse] [animation-delay:-0.5s]"></div>
      <div className="absolute inset-2 rounded-full bg-background"></div>
      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500 to-sky-600 animate-spin [animation-delay:-1s]"></div>
      <div className="absolute inset-4 rounded-full bg-background"></div>
    </div>
  );
};

export default AnimatedLogo;
