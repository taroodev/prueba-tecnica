/*module.exports = {
    async beforeCreate(event) {
      const { data } = event.params;
  
      // Recolectamos los IDs de los platos
      const platosIds = [data.primero, data.segundo, data.postre];
  
      // Validamos que no se repita el mismo plato
      if (new Set(platosIds.filter(id => id)).size !== platosIds.filter(id => id).length) {
        throw new Error("No se puede usar el mismo plato en más de una categoría");
      }
  
      // Obtenemos los precios de cada plato usando el servicio personalizado
      const precios = await strapi.plugin('restaurant-menu').service('menu').obtenerPrecios(platosIds);
  
      // Sumamos los precios (se asume que si un plato no se asigna, su precio es 0)
      data.sum_precio = precios.reduce((acum, precio) => acum + parseFloat(precio || 0), 0);
    },
  
    async beforeUpdate(event) {
      const { data } = event.params;
      // Se puede aplicar la misma lógica en la actualización si es necesario
      const platosIds = [data.primero, data.segundo, data.postre];
      if (new Set(platosIds.filter(id => id)).size !== platosIds.filter(id => id).length) {
        throw new Error("No se puede usar el mismo plato en más de una categoría");
      }
      const precios = await strapi.plugin('restaurant-menu').service('menu').obtenerPrecios(platosIds);
      data.sum_precio = precios.reduce((acum, precio) => acum + parseFloat(precio || 0), 0);
    }
  };

  
  3.1. Creación del servicio
Crea el archivo de servicio, por ejemplo en:
./src/plugins/restaurant-menu/server/services/menu-service.js

js
Copiar
Editar
'use strict';

module.exports = ({ strapi }) => ({
  /**
   * Obtiene los precios de los platos dados sus IDs.
   * @param {Array} platosIds 
   * @returns {Array} Precios de los platos
   
  async obtenerPrecios(platosIds) {
    // Filtrar IDs válidos
    const validIds = platosIds.filter(id => id);
    if (!validIds.length) return [];

    const platos = await strapi.entityService.findMany('api::plato.plato', {
      filters: { id: validIds },
      fields: ['id', 'precio']
    });
    // Mapear los precios en el mismo orden de IDs (asumiendo que se envían correctamente)
    const precios = validIds.map(id => {
      const plato = platos.find(p => p.id === id);
      return plato ? plato.precio : 0;
    });
    return precios;
  },

  /**
   * Aplica impuestos al total según la lógica definida.
   * Por ejemplo, agregar un 10% de impuesto.
   * @param {number} total 
   * @returns {number} total con impuestos
   
  aplicarImpuestos(total) {
    const tasaImpuesto = 0.10; // 10%
    return total + (total * tasaImpuesto);
  }
});
console.log("++++++++++++++++++++++++++++++")
En el lifecycle hook, se accede al servicio mediante:


await strapi.plugin('restaurant-menu').service('menu').obtenerPrecios(platosIds);

/*


4. API Mejorada: Endpoints Personalizados
Queremos exponer endpoints para:

Obtener solo los postres dentro de los menús: GET /menus/postres

Filtrar menús por rango de precios: GET /menus?min_precio=10&max_precio=20

Filtrar menús sin ciertos alérgenos: GET /menus?excluir_alergenos=gluten,lactosa

Obtener los platos más vendidos o populares: GET /platos/populares

4.1. Creación de rutas personalizadas
4.1.1. Para Menús Diarios
Edita o crea el archivo de rutas en:
./src/api/menu/routes/menu-custom-routes.js

js
Copiar
Editar
'use strict';

module.exports = [
  // Endpoint para obtener menús filtrando por rango de precios
  {
    method: 'GET',
    path: '/menus',
    handler: 'menu.customFind',
    config: {
      policies: []
    }
  },
  // Endpoint para obtener solo menús con postres (ejemplo)
  {
    method: 'GET',
    path: '/menus/postres',
    handler: 'menu.findPostres',
    config: {
      policies: []
    }
  },
  // Endpoint para filtrar menús sin ciertos alérgenos
  {
    method: 'GET',
    path: '/menus/excluir-alergenos',
    handler: 'menu.filterByAlergenos',
    config: {
      policies: []
    }
  }
];
4.1.2. Para Platos
Crea un endpoint para obtener los platos más populares en:
./src/api/plato/routes/plato-custom-routes.js

js
Copiar
Editar
'use strict';

module.exports = [
  {
    method: 'GET',
    path: '/platos/populares',
    handler: 'plato.findPopulares',
    config: {
      policies: []
    }
  }
];
4.2. Controladores Personalizados
4.2.1. Menús (API: menu)
Crea o edita el archivo controlador en:
./src/api/menu/controllers/menu.js

js
Copiar
Editar
'use strict';

module.exports = {
  /**
   * customFind: Filtra menús por rango de precios si se indican min_precio y max_precio.
   
  async customFind(ctx) {
    const { min_precio, max_precio } = ctx.query;

    const filters = {};

    if (min_precio || max_precio) {
      filters.sum_precio = {};
      if (min_precio) filters.sum_precio.$gte = parseFloat(min_precio);
      if (max_precio) filters.sum_precio.$lte = parseFloat(max_precio);
    }

    const menus = await strapi.entityService.findMany('api::menu.menu', {
      filters
    });
    ctx.send(menus);
  },

  /**
   * findPostres: Retorna menús donde se haya asignado un postre.
   
  async findPostres(ctx) {
    const menus = await strapi.entityService.findMany('api::menu.menu', {
      filters: { postre: { $notNull: true } }
    });
    ctx.send(menus);
  },

  /**
   * filterByAlergenos: Filtra menús que NO contengan ciertos alérgenos.
   * Se espera un query ?excluir_alergenos=gluten,lactosa
   
  async filterByAlergenos(ctx) {
    const { excluir_alergenos } = ctx.query;
    if (!excluir_alergenos) {
      return ctx.send({ error: 'Debe proporcionar los alérgenos a excluir' });
    }
    const alergenosAExcluir = excluir_alergenos.split(',').map(a => a.trim().toLowerCase());

    // Se asume que cada menú tiene platos asociados y que cada plato tiene componentes alérgenos
    const menus = await strapi.entityService.findMany('api::menu.menu', {
      populate: {
        primero: { populate: ['alergenos'] },
        segundo: { populate: ['alergenos'] },
        postre: { populate: ['alergenos'] }
      }
    });

    // Filtramos los menús que tengan algún alérgeno excluido en alguno de sus platos
    const menusFiltrados = menus.filter(menu => {
      const platos = [menu.primero, menu.segundo, menu.postre].filter(Boolean);
      return platos.every(plato => {
        const alergenos = (plato.alergenos || []).map(a => a.nombre.toLowerCase());
        return !alergenos.some(alergeno => alergenosAExcluir.includes(alergeno));
      });
    });

    ctx.send(menusFiltrados);
  }
};
4.2.2. Platos (API: plato)
Crea o edita el archivo controlador en:
./src/api/plato/controllers/plato.js

js
Copiar
Editar
'use strict';

module.exports = {
  /**
   * findPopulares: Retorna los platos más vendidos o populares.
   * Aquí la lógica puede variar; se puede ordenar por un campo de ventas o popularidad.
   * Por ejemplo, si tienes un campo "ventas", puedes ordenarlo descendentemente.
   
  async findPopulares(ctx) {
    // Ejemplo simple: se listan los 5 platos con más ventas (asumiendo que exista el campo 'ventas')
    const platos = await strapi.entityService.findMany('api::plato.plato', {
      sort: { ventas: 'desc' },
      limit: 5
    });
    ctx.send(platos);
  }
};
4.3. Registro de rutas personalizadas
Para que Strapi reconozca estas rutas, edita el archivo ./src/api/menu/routes/menu.js (o agrégales un routes adicional) e incluye las rutas personalizadas. Por ejemplo:

js
Copiar
Editar
'use strict';

const customRoutes = require('./menu-custom-routes');

module.exports = [
  ...customRoutes,
  // Aquí las rutas generadas automáticamente por Strapi (si las hay)
];
Y para plato, haz lo mismo en ./src/api/plato/routes/plato.js:

js
Copiar
Editar
'use strict';

const customRoutes = require('./plato-custom-routes');

module.exports = [
  ...customRoutes,
  // Rutas por defecto si las hubiera
];
*/
