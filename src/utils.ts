import { create, all, parse, MathNode } from 'mathjs';

const math = create(all, {
  // number: 'BigNumber',
  number: 'number',
});

type SymbolNodeType = MathNode & {
  isSymbolNode: boolean;
  name: string;
};

export function isExpression(value: string): boolean {
  return value?.[0] === '=';
}

export function getExpressionVariables(value: string): {
  [key: string]: boolean;
} {
  const node = parse(value);
  const variables: { [key: string]: boolean } = {};

  node.traverse((node: SymbolNodeType) => {
    if (node.isSymbolNode) {
      variables[node.name] = true;
    }
  });

  return variables;
}

export function calculateExpression(
  value: string,
  scope: { [key: string]: string } = {},
): string {
  return math.evaluate(value, scope).toString();
}

export function transformUrl(value: string) {
  return value.toLowerCase();
}
