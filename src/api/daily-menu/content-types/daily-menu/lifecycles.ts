const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

module.exports = {
 
  async afterCreate(event) {
    if (event.state?.isCalculatedUpdate) return;

    const { result } = event;
    const menu = await strapi.entityService.findOne('api::daily-menu.daily-menu', result.id, {
      populate: ['first_dish', 'second_dish', 'dessert_dish'],
    });

    const { sumPrice, sumPriceIva } = menu;

    const calculatedPrice = await strapi.service('api::daily-menu.calculate-price').calculateSumPrecio(menu);
    const calculatedIva = await strapi.service('api::daily-menu.daily-menu').pricePlusIva(calculatedPrice);

    const currentPrice = sumPrice ?? 0;
    const currentIva = typeof sumPriceIva === "number" ? sumPriceIva : parseFloat(sumPriceIva) || 0;

    if (currentPrice !== calculatedPrice) {
      await strapi.entityService.update('api::daily-menu.daily-menu', result.id, {
        data: { sumPrice: calculatedPrice },
      });
    }

    if (currentIva !== calculatedIva) {
      await strapi.entityService.update('api::daily-menu.daily-menu', result.id, {
        data: { sumPriceIva: calculatedIva },
      });
    }
  },
  async afterUpdate(event) {
    if (event.state?.isCalculatedUpdate) return;

    const { result } = event;
    const menu = await strapi.entityService.findOne('api::daily-menu.daily-menu', result.id, {
      populate: ['first_dish', 'second_dish', 'dessert_dish'],
    });

    const { sumPrice, sumPriceIva } = menu;

    const calculatedPrice = await strapi.service('api::daily-menu.calculate-price').calculateSumPrecio(menu);
    const calculatedIva = await strapi.service('api::daily-menu.daily-menu').pricePlusIva(calculatedPrice);

    const currentPrice = sumPrice ?? 0;
    const currentIva = typeof sumPriceIva === "number" ? sumPriceIva : parseFloat(sumPriceIva) || 0;

    if (currentPrice !== calculatedPrice) {
      await strapi.entityService.update('api::daily-menu.daily-menu', result.id, {
        data: { sumPrice: calculatedPrice },
      });
    }

    if (currentIva !== calculatedIva) {
      await strapi.entityService.update('api::daily-menu.daily-menu', result.id, {
        data: { sumPriceIva: calculatedIva },
      });
    }
  },

  async beforeCreate(event) {
    await validateNoDuplicateDishes(event.params.data);
  },

  async beforeUpdate(event) {
    await validateNoDuplicateDishes(event.params.data);
  },

  

};
async function validateNoDuplicateDishes(data) {
 
  const dishIds = [];
  const extractId = (relation) => {
    if (!relation) return null;
    
    if (relation.connect && relation.connect[0] && relation.connect[0].id) {
      return relation.connect[0].id;
    }
 
    if (relation.id) {
      return relation.id;
    }

    if (typeof relation === 'number') {
      return relation;
    }
    if (typeof relation === 'object' && relation !== null) {
      return relation.id;
    }
  
    return null;
  };
  
  const firstDishId = extractId(data.first_dish);
  const secondDishId = extractId(data.second_dish);
  const dessertDishId = extractId(data.dessert_dish);
  
  if (firstDishId) dishIds.push(firstDishId);
  if (secondDishId) dishIds.push(secondDishId);
  if (dessertDishId) dishIds.push(dessertDishId);
  
 

  const uniqueDishIds = [...new Set(dishIds)];
 
  
  if (uniqueDishIds.length !== dishIds.length) {
    throw new ApplicationError('No se puede repetir el mismo plato en diferentes categorías', {
      field: 'dishes',
      validation: 'duplicate'
    });
  }

  return { firstDishId, secondDishId, dessertDishId };
}