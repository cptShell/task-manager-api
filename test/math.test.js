const { resolveConfig } = require('prettier');
const { calc, FtoC, CtoF } = require('../src/math');

test('Should calc total with tip', () => {
  const result = calc(10, 0.3);

  expect(result).toEqual(13);
});

describe('Temperature tests', () => {
  test('Should convert 32 C to 0 F', () => {
    const fahreheit = CtoF(32);
    const expected = 0;

    expect(fahreheit).toEqual(expected);
  });
  test('Should convert 0 F to 32 C', () => {
    const celsius = FtoC(0);
    const expected = 32;

    expect(celsius).toEqual(expected);
  });
});

test('Should calculate values asynchronous', async () => {
  const expected = 6;
  const asyncCalc = async (a, b) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(a + b), 1000);
    });
  };

  const result = await asyncCalc(3, 3);
  expect(result).toEqual(expected);
});
