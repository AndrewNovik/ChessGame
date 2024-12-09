export function isEquel(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function yToNum(l: string): number {
  let result: number | null = null;
  const smallL = l.toLowerCase();
  switch (smallL) {
    case 'a':
      result = 0;
      break;
    case 'b':
      result = 1;
      break;
    case 'c':
      result = 2;
      break;
    case 'd':
      result = 3;
      break;
    case 'e':
      result = 4;
      break;
    case 'f':
      result = 5;
      break;
    case 'g':
      result = 6;
      break;
    case 'h':
      result = 7;
      break;
  }
  if (result === null) {
    console.log('problem with responce');
    return 0;
  }
  return result;
}
