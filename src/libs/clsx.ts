const classPrefixes = [
  'h-',
  'w-',
  'max-w-',
  'min-w-',
  'max-h-',
  'min-h-',
  'px-',
  'py-',
  'pl-',
  'pr-',
  'pt-',
  'pb-',
  'p-',
  'mx-',
  'my-',
  'ml-',
  'mr-',
  'mt-',
  'mb-',
  'm-',
  'rounded-',
];

function mergedTailwindClassName(
  originals: string[],
  overrides: string[],
): string {
  const merged = originals.reduce((prev: string[], originalClassName) => {
    let remove = false;
    overrides.forEach(overrideClassName => {
      if (
        classPrefixes.some(
          prefix =>
            originalClassName.includes(prefix) &&
            overrideClassName.includes(prefix),
        )
      ) {
        remove = true;
        return;
      }
    });
    if (remove) {
      return [...prev];
    }
    return [...prev, originalClassName];
  }, []);
  return [...merged, ...overrides].join(' ');
}
export default function clsx(
  classNames: {[key: string]: boolean},
  custom?: string,
): string {
  const arrayClassNames = Object.entries(classNames)
    .map(pair => (pair[1] ? pair[0] : ''))
    .filter(x => !!x)
    .join(' ')
    .split(' ');
  const arrayCustomClassNames = custom ? custom.split(' ') : [];

  return arrayCustomClassNames.length === 0
    ? arrayClassNames.join(' ')
    : mergedTailwindClassName(arrayClassNames, arrayCustomClassNames);
}
