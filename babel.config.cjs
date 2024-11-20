module.exports = function(api) {
    api.cache(true);
    const disableImportExportTransform = true;
    return {
        presets: [
            // "module:metro-react-native-babel-preset",
            [
                'babel-preset-expo',
                {
                    native: {
                        disableImportExportTransform,
                    },
                    web: {
                        disableImportExportTransform,
                    },
                },
            ]
        ],
        plugins: [
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }]
        ]
    };
};
