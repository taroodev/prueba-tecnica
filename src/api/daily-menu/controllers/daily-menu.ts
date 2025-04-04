import { factories } from '@strapi/strapi'

const UIDMODEL='api::daily-menu.daily-menu'

export default factories.createCoreController(UIDMODEL, ({ strapi }) => ({
 
  async moreSales(ctx) {
    

    try {

      const collections = await strapi.documents(UIDMODEL).findMany({
        populate: {
          first_dish: {
            fields: ['name'] 
          },
          second_dish: {
            fields: ['name']
          },
          dessert_dish: {
            fields: ['name']
          }
        }
      });

      const dishCountMap = new Map();
      
for (let i = 0; i < collections.length; i++) {
  const menu = collections[i];
  
  if (menu.first_dish && menu.first_dish.name) {
    const dishName = menu.first_dish.name;
    dishCountMap.set(dishName, (dishCountMap.get(dishName) || 0) + 1);
  }
  
  if (menu.second_dish && menu.second_dish.name) {
    const dishName = menu.second_dish.name;
    dishCountMap.set(dishName, (dishCountMap.get(dishName) || 0) + 1);
  }
  
  if (menu.dessert_dish && menu.dessert_dish.name) {
    const dishName = menu.dessert_dish.name;
    dishCountMap.set(dishName, (dishCountMap.get(dishName) || 0) + 1);
  }
}
      const sortedDishes = Array.from(dishCountMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));
      
      return { popularDishes: sortedDishes };


    } catch (error) {
      ctx.throw("Not found Dishes :", error);
    }
  },









  async getMenusWithoutAllergens(ctx) {
    const api = 'api::daily-menu.daily-menu';
    try {
      const { allergens } = ctx.request.query;
      console.log(allergens);
      if (!allergens) {
        return ctx.badRequest('Se requieren alérgenos');
      }
      const allergensArray = Array.isArray(allergens) ? allergens : [allergens];
           
      const menus = await strapi.documents(api).findMany({
        populate: {
          first_dish: {
            fields: ['name', 'price'],
            populate: {
              allergens: {
                fields: ['name']
              }
            }
          },
          second_dish: {
            fields: ['name', 'price'],
            populate: {
              allergens: {
                fields: ['name']
              }
            }
          },
          dessert_dish: {
            fields: ['name', 'price'],
            populate: {
              allergens: {
                fields: ['name']
              }
            }
          }
        }
      });
  
      const hasProhibitedAllergens = (dish) => {
        if (!dish || !dish.allergens || dish.allergens.length === 0) return false;
        
        return dish.allergens.some(allergen => 
          allergensArray.includes(allergen.name)
        );
      };
      const filteredMenus = menus.filter(menu => {
        
        const firstDishHasAllergen = hasProhibitedAllergens(menu.first_dish);
        const secondDishHasAllergen = hasProhibitedAllergens(menu.second_dish);
        const dessertDishHasAllergen = hasProhibitedAllergens(menu.dessert_dish);
              
        return !firstDishHasAllergen && !secondDishHasAllergen && !dessertDishHasAllergen;
      });
  
      return { data: filteredMenus };
    } catch (error) {
      return ctx.badRequest('Error al procesar la solicitud: ' + error.message);
    }
  }


}));

