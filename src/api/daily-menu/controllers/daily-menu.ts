/**
 * daily-menu controller
 */


import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::daily-menu.daily-menu', ({ strapi }) => ({
  async moreSales(ctx) {

    //  const popularDishes = await strapi.documents('api::daily-menu.daily-menu').findMany({
        // Puedes usar filters para filtrar resultados específicos
     //   filters: {
         
      /*    sales: {
            $gt: 0 // Platos con al menos una venta
          }
        },
      // Ordenar por número de ventas (descendente)
        sort: [{ sales: 'desc' }],
        // Limitar a los 10 más populares
        pagination: {
          pageSize: 10,
          page: 1
        },
        // Incluir campos relevantes
        fields: ['name', 'price', 'sales'],
        // Opcionalmente, poblar relaciones
        populate: {
          image: {
            fields: ['url', 'alternativeText']
          }
        }
      });*/
      
   
  }
}));

