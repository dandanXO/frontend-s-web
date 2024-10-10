import type { Struct, Schema } from '@strapi/strapi';

export interface UiVideoItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_video_items';
  info: {
    displayName: 'Video Item';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
  };
}

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
      'ui.video-item': UiVideoItem;
      'ui.gallery-item': UiGalleryItem;
    }
  }
}
