export default {
  multipass: true,
  // SMIL animations live in <animate> elements that reference element IDs. Collapsing
  // groups or minifying IDs breaks those references and the animation dies silently.
  plugins: [
    { name: "preset-default", params: { overrides: { cleanupIds: false, collapseGroups: false, removeHiddenElems: false, convertShapeToPath: false } } },
    { name: "cleanupNumericValues", params: { floatPrecision: 1 } },
    { name: "convertPathData", params: { floatPrecision: 1 } },
    { name: "removeDimensions" },
  ],
};
