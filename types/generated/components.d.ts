import type { Schema, Struct } from '@strapi/strapi';

export interface AllergenesAllergen extends Struct.ComponentSchema {
  collectionName: 'components_allergenes_allergens';
  info: {
    displayName: 'Allergen';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'allergenes.allergen': AllergenesAllergen;
    }
  }
}
