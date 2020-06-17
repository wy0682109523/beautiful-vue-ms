module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/v1': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
};