// const UnpluginElementPlusWebpack = require('unplugin-element-plus/webpack')

module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 8082,
        proxy: {
            '^/search': {
                target: 'http://localhost:8081'
            }
        }
    },

    configureWebpack: {
        plugins: [
            require('unplugin-element-plus/webpack')({
                // options
              })
        ]
    }
}