/**
 * daily-menu service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::daily-menu.daily-menu');


module.exports={

async pricePlusIva(resultado){
const iva=0.21
const result = resultado*iva

return result
},

};
