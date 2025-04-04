
module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/daily-menus',
        handler: 'daily-menu.create',
        config: {
          policies: ['global::prevent-duplicate-dishes']
        }
      },
      {
        method: 'PUT',
        path: '/daily-menus/:id',
        handler: 'daily-menu.update',
        config: {
          policies: ['global::prevent-duplicate-dishes']
        }
      }
    ]
  };