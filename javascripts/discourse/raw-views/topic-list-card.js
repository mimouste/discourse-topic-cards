import discourseComputed from "discourse-common/utils/decorators";
import EmberObject from "@ember/object";
import { inject as service } from "@ember/service";
import { and } from "@ember/object/computed";

export default EmberObject.extend({
  topicListThumbnailService: service("topic-list-thumbnail"),

  shouldDisplay: and(
    "topicListThumbnailsService.shouldDisplay",
    "enabledForOutlet"
  ),

  // Make sure to update about.json thumbnail sizes if you change these variables
  @discourseComputed("topicListThumbnailService.displayList")
  displayWidth(displayList) {
    return displayList ? settings.list_thumbnail_size : 400;
  },

  responsiveRatios: [1, 1.5, 2],

  @discourseComputed(
    "location",
    "topicListThumbnailService.displayList",
    "topicListThumbnailService.displayBlogStyle"
  )
  enabledForOutlet(location, displayList, displayBlogStyle) {
    if (displayBlogStyle && location === "before-columns") {
      return true;
    }
    if (displayList && location === "before-link") {
      return true;
    }
    return false;
  },

  @discourseComputed("topic.thumbnails")
  hasThumbnail(thumbnails) {
    return !!thumbnails;
  },

  @discourseComputed("topic.thumbnails", "displayWidth")
  srcSet(thumbnails, displayWidth) {
    const srcSetArray = [];

    this.responsiveRatios.forEach((ratio) => {
      const target = ratio * displayWidth;
      const match = thumbnails.find((t) => t.url && t.max_width === target);
      if (match) {
        srcSetArray.push(`${match.url} ${ratio}x`);
      }
    });

    if (srcSetArray.length === 0) {
      srcSetArray.push(`${this.original.url} 1x`);
    }

    return srcSetArray.join(",");
  },

  @discourseComputed("topic.thumbnails")
  original(thumbnails) {
    return thumbnails[0];
  },

  @discourseComputed("original")
  width(original) {
    return original.width;
  },
  @discourseComputed("original")
  isLandscape(original) {
    return original.width >= original.height;
  },
  @discourseComputed("original")
  height(original) {
    return original.height;
  },

  @discourseComputed("topic.thumbnails")
  fallbackSrc(thumbnails) {
    const largeEnough = thumbnails.filter((t) => {
      if (!t.url) {
        return false;
      }
      return t.max_width > this.displayWidth * this.responsiveRatios.lastObject;
    });

    if (largeEnough.lastObject) {
      return largeEnough.lastObject.url;
    }

    return this.original.url;
  },

  @discourseComputed("topic")
  url(topic) {
    return topic.linked_post_number
      ? topic.urlForPostNumber(topic.linked_post_number)
      : topic.get("lastUnreadUrl");
  },
});
