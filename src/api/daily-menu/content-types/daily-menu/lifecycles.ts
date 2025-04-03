module.exports = {
  async afterUpdate(event) {
    if (event.params.data._isCalculatedUpdate) {
   return; 
   }
   // 21% de impuestos paar cada plato 


   // crear nuevo campo  donde multiple por el impuesto y de un resultado final 

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
    }