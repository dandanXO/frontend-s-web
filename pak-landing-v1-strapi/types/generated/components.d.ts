import type { Struct, Schema } from '@strapi/strapi';

export interface UiGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_gallery_items';
  info: {
    displayName: 'Gallery Item';
    description: '';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    videoUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'ui.gallery-item': UiGalleryItem;
    }
  }
}
