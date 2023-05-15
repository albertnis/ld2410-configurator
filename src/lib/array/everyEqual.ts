type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

export const everyEqual = (
  a: number[] | TypedArray,
  b: number[] | TypedArray
): boolean => {
  console.log({ a, b });
  if (a.length !== b.length) {
    console.warn(
      "Elementwise array equality automatically failed as input arrays are of different lengths"
    );
    return false;
  }

  return a.every((xa, i) => xa === b[i]);
};
