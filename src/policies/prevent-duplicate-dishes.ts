
module.exports = (policyContext, config, { strapi }) => {
    const { first_dish, second_dish, dessert_dish } = policyContext.request.body.data;
    
    const dishIds = [];
    let hasDuplicates = false;
    
    
    [first_dish, second_dish, dessert_dish].forEach(dish => {
      if (dish) {
        const id = typeof dish === 'object' ? dish.id : dish;
        if (id && dishIds.includes(id)) {
          hasDuplicates = true;
        }
        if (id) dishIds.push(id);
      }
    });
    
    if (hasDuplicates) {
      return false; 
    }
    
    return true; 
  };