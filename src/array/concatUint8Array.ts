export function concatUint8Arrays(typedArrays: Uint8Array[]): Uint8Array {
  const outputLength = typedArrays.reduce((acc, arr) => acc + arr.length, 0);
  const output = new Uint8Array(outputLength);

  let offset = 0;
  for (let i = 0; i < typedArrays.length; i++) {
    output.set(typedArrays[i], offset);
    offset += typedArrays[i].length;
  }

  return output;
}
