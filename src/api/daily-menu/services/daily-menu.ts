
import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::daily-menu.daily-menu', ({ strapi }) => ({
  async pricePlusIva(resultado: number) {
    const iva = 0.21;
    const ivaAmount = resultado * iva;
    const totalWithIva = resultado + ivaAmount;
    
    return totalWithIva;
  },
}));