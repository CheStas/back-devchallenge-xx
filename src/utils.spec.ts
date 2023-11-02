import {
  calculateExpression,
  getExpressionVariables,
  isExpression,
} from './utils';

describe('isExpression', () => {
  it('should return expression is true', () => {
    expect(isExpression('=1+2')).toBe(true);
  });

  it('should return expression is false', () => {
    expect(isExpression('')).toBe(false);
  });

  it('should return expression is false, broken data', () => {
    expect(isExpression(null as any)).toBe(false);
    expect(isExpression(undefined as any)).toBe(false);
  });
});

describe('getExpressionVariables', () => {
  it('should return expression variables', () => {
    const expression = '2 * x + y';
    const expected = { x: true, y: true };

    expect(getExpressionVariables(expression)).toStrictEqual(expected);
  });

  it('should return expression variables', () => {
    const expression = 'var-adf+ad9a/1(ki+ia)';
    const expected = { var: true, adf: true, ad9a: true, ki: true, ia: true };

    expect(getExpressionVariables(expression)).toStrictEqual(expected);
  });

  it('should not return expression variables', () => {
    const expression = '2 + 3';

    expect(getExpressionVariables(expression)).toStrictEqual({});
  });

  it('should throw SyntaxError', () => {
    const expression = '= 2 + 3';

    expect(() => getExpressionVariables(expression)).toThrow();
  });

  it('should not throw error on first symobol space', () => {
    const expression = ' 2 + 3';

    expect(getExpressionVariables(expression)).toStrictEqual({});
  });
});

describe('calculateExpression', () => {
  test.each([
    { expression: '2+3', scoupe: undefined, result: '5' },
    { expression: '2', scoupe: undefined, result: '2' },
    { expression: '-2', scoupe: undefined, result: '-2' },
    { expression: '0', scoupe: undefined, result: '0' },
    { expression: '2*a', scoupe: { a: '2' }, result: '4' },
    { expression: '2 * a', scoupe: { a: '2' }, result: '4' },
    { expression: '(2 + 2) * a', scoupe: { a: '2' }, result: '8' },
    { expression: '2 + 2 * a', scoupe: { a: '2' }, result: '6' },
  ])(
    '.calculateExpression($expression, $scoupe) === $result',
    ({ expression, scoupe, result }) => {
      expect(calculateExpression(expression, scoupe)).toEqual(result);
    },
  );

  test.each([
    { expression: '2 + 2 * a*b', scoupe: { a: '2', b: '2' }, result: '10' },
  ])(
    '.calculateExpression($expression, $scoupe) === $result',
    ({ expression, scoupe, result }) => {
      expect(calculateExpression(expression, scoupe)).toEqual(result);
    },
  );

  // test('precision', () => {
  //   expect(calculateExpression('0.1 + 0.2')).toEqual('0.3');
  // });
});
