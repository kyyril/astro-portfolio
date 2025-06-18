module.exports = {
  plugins: [
    require("postcss-preset-env")({
      stage: 2,
      features: {
        "nesting-rules": true,
        "custom-properties": true,
        "custom-media-queries": true,
        "media-query-ranges": true,
      },
      autoprefixer: {
        flexbox: "no-2009",
        grid: "autoplace",
      },
    }),
    require("cssnano")({
      preset: [
        "advanced",
        {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyParams: true,
          minifyFontValues: true,
          convertValues: true,
          discardDuplicates: true,
          discardEmpty: true,
          discardUnused: {
            fontFace: false,
            keyframes: false,
          },
          mergeRules: true,
          mergeLonghand: true,
          mergeIdents: true,
          reduceIdents: false, // Keep CSS custom properties
          zindex: false, // Don't optimize z-index values
          cssDeclarationSorter: true,
          calc: true,
          colormin: true,
          orderedValues: true,
          uniqueSelectors: true,
        },
      ],
    }),
  ],
};
