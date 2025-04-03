export default {
    routes: [
    {
    method: 'GET',
    path: '/platos/populares',
    handler: 'daily-menu.moreSales',
    config: {
    policies: [],
    middlewares: [],
    },
    },
    ]
}