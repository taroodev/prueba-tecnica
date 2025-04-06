import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::daily-menu.daily-menu', ({ strapi }) => ({

    async calculateSumPrecio(data) {
        let valor1 = 0, valor2 = 0, valor3 = 0;
        
        const extractId = (relation) => {
          return relation?.connect?.[0]?.id || relation?.id || (typeof relation === 'number' ? relation : null);
        };
      
        const firstDishId = extractId(data.first_dish);
        const secondDishId = extractId(data.second_dish);
        const dessertDishId = extractId(data.dessert_dish);
        
        console.log("IDs extraídos:", { firstDishId, secondDishId, dessertDishId });
      
        const getDishPrice = async (dishId) => {
          if (!dishId) return 0;
          try {
            const dish = await strapi.db.query('api::dishe.dishe').findOne({
              where: { id: dishId },
              select: ['price']
            });
            return dish.price || 0;  
          } catch (error) {
            console.error(`Error al obtener plato con id ${dishId}:`, error);
            return 0;
          }
        };
      
       
        valor1 = await getDishPrice(firstDishId);
        valor2 = await getDishPrice(secondDishId);
        valor3 = await getDishPrice(dessertDishId);
      
        const total = valor1 + valor2 + valor3;
        console.log("Valores calculados:", { valor1, valor2, valor3, total });
      
        return total;
      }
      
  }));
