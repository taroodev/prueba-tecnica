/*module.exports = {
  async afterUpdate(event) {
    if (event.params.data._isCalculatedUpdate) {
   return; 
   }
    const documentId = event.params.where?.id || event.result?.id;
    const result = await calculateSumPrecio(event.params.data);
    console.log(result);
    if (documentId) {
      

      await strapi.db.query("api::daily-menu.daily-menu").update({
        where: { id: documentId },
        data: {
          sumPrice: result,
          _isCalculatedUpdate: true 
        }
      });


      const  resultado = await  strapi.service("api::daily-menu.daily-menu").pricePlusIva(result)


      await strapi.db.query("api::daily-menu.daily-menu").update({
        where: { id: documentId },
        data: {
          sumPriceIva: resultado,
          _isCalculatedUpdate: true 
        }
      });



    }
  }
    };
    async function calculateSumPrecio(data) {
      const api = "api::daily-menu.daily-menu";
      const valorDefecto = 0;
      let valor1 = 0, valor2 = 0, valor3 = 0     
      try {
        const firtsDish = await strapi.documents(api).findMany({ 
          populate: { 
            first_dish: {
              fields: ["price"],
            },
          },
        });         
        if (firtsDish[0].first_dish.price !== undefined) {
          valor1 = firtsDish[0].first_dish.price;
        }
      } catch (error) {
        console.error("Error al obtener first_dish:", error);
      }     
      try {
        const secondDish = await strapi.documents(api).findMany({   
          populate: { 
            second_dish: {
              fields: ["price"],
            }, 
          },
        });
        if (secondDish[0].second_dish.price !== undefined) {
          valor2 = secondDish[0].second_dish.price;
        }
      } catch (error) {
        console.error("Error al obtener second_dish:", error);
      }
      try {
        const dessertDish = await strapi.documents(api).findMany({
          populate: { 
            dessert_dish: {
              fields: ["price"],
            }, 
          },
        });
        if (dessertDish[0].dessert_dish.price !== undefined) {
          valor3 = dessertDish[0].dessert_dish.price;
        }
      } catch (error) {
        console.error("Error al obtener dessert_dish:", error);
      }
    
      const total = (valor1 + valor2 + valor3);
      return total;
    }*/

      module.exports = {
        async beforeCreate(event) {
          await validateNoDuplicateDishes(event);
        },
        
        async beforeUpdate(event) {
          await validateNoDuplicateDishes(event);
          
          if (event.params.data._isCalculatedUpdate) {
            return; 
          }
          
     
        },
        
        async afterUpdate(event) {
          if (event.params.data._isCalculatedUpdate) {
            return; 
          }
          const documentId = event.params.where?.id || event.result?.id;
          const result = await calculateSumPrecio(event.params.data);
          console.log(result);
          if (documentId) {
            await strapi.db.query("api::daily-menu.daily-menu").update({
              where: { id: documentId },
              data: {
                sumPrice: result,
                _isCalculatedUpdate: true 
              }
            });
      
            const resultado = await strapi.service("api::daily-menu.daily-menu").pricePlusIva(result)
      
            await strapi.db.query("api::daily-menu.daily-menu").update({
              where: { id: documentId },
              data: {
                sumPriceIva: resultado,
                _isCalculatedUpdate: true 
              }
            });
          }
        }
      };
      
      async function validateNoDuplicateDishes(event) {
        const { first_dish, second_dish, dessert_dish } = event.params.data;
        
       
        if (!first_dish && !second_dish && !dessert_dish) {
          return;
        }
        
        const dishIds = [];
        
       
        if (first_dish) {
          dishIds.push(first_dish.connect ? first_dish.connect[0].id : first_dish);
        }
        
        if (second_dish) {
          const secondDishId = second_dish.connect ? second_dish.connect[0].id : second_dish;
          if (dishIds.includes(secondDishId)) {
            throw new Error('No se puede usar el mismo plato más de una vez en un menú');
          }
          dishIds.push(secondDishId);
        }
        
        if (dessert_dish) {
          const dessertDishId = dessert_dish.connect ? dessert_dish.connect[0].id : dessert_dish;
          if (dishIds.includes(dessertDishId)) {
            throw new Error('No se puede usar el mismo plato más de una vez en un menú');
          }
          dishIds.push(dessertDishId);
        }
      }
      
      
      async function calculateSumPrecio(data) {
        const api = "api::daily-menu.daily-menu";
        const valorDefecto = 0;
        let valor1 = 0, valor2 = 0, valor3 = 0     
        try {
          const firtsDish = await strapi.documents(api).findMany({ 
            populate: { 
              first_dish: {
                fields: ["price"],
              },
            },
          });         
          if (firtsDish[0].first_dish.price !== undefined) {
            valor1 = firtsDish[0].first_dish.price;
          }
        } catch (error) {
          console.error("Error al obtener first_dish:", error);
        }     
        try {
          const secondDish = await strapi.documents(api).findMany({   
            populate: { 
              second_dish: {
                fields: ["price"],
              }, 
            },
          });
          if (secondDish[0].second_dish.price !== undefined) {
            valor2 = secondDish[0].second_dish.price;
          }
        } catch (error) {
          console.error("Error al obtener second_dish:", error);
        }
        try {
          const dessertDish = await strapi.documents(api).findMany({
            populate: { 
              dessert_dish: {
                fields: ["price"],
              }, 
            },
          });
          if (dessertDish[0].dessert_dish.price !== undefined) {
            valor3 = dessertDish[0].dessert_dish.price;
          }
        } catch (error) {
          console.error("Error al obtener dessert_dish:", error);
        }
      
        const total = (valor1 + valor2 + valor3);
        return total;
      }