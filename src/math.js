const calc = (total, tipPercent) => {
  const tip = total * tipPercent;
  return tip + total;
};

const FtoC = (temp) => temp * 1.8 + 32;

const CtoF = (temp) => (temp - 32) / 1.8;

module.exports = {
  calc,
  FtoC,
  CtoF,
};
