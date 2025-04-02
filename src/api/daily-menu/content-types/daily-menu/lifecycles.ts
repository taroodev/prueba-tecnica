module.exports = {

    async afterCreate(event) {
        const { data } = event.params;
        await calculateSumPrecio(data);
        console.log("params", data);
      },
    
      async beforeUpdate(event) {
        const { data } = event.params;
        await calculateSumPrecio(data);
        console.log("params",data);
      },
    };
    
    
    async function calculateSumPrecio(data) {

    const valor=0;
    const firtsDish = await strapi.documents("api::daily-menu.daily-menu").findOne( data.first_dish );
    const secondDish = await strapi.documents("api::daily-menu.daily-menu").findOne( data.second_dish);
    const dessertDish = await strapi.documents("api::daily-menu.daily-menu").findOne( data.dessert_dish);

    
    
    console.log(firtsDish)
    console.log(firtsDish)
    console.log(dessertDish)
    
    
   // data.sumPice= (firtsDish.id+ secondDish + dessertDish);
};