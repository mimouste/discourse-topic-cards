import { dependentKeyCompat } from "@ember/object/compat";
import Service, { inject as service } from "@ember/service";
import Site from "discourse/models/site";
import discourseComputed from "discourse-common/utils/decorators";

console.log(
  settings.list_style_categories,
  settings.blog_style_categories,
  settings.list_style_tags,
  settings.blog_style_tags
);
const listCategories = settings.list_style_categories
  .split("|")
  .map((id) => parseInt(id, 10));

const blogStyleCategories = settings.blog_style_categories
  .split("|")
  .map((id) => parseInt(id, 10));

const listStyleTags = settings.list_style_tags.split("|");
const blogStyleTags = settings.blog_style_tags.split("|");

export default class TopicThumbnailService extends Service {
  @service router;
  @service discovery;

  @dependentKeyCompat
  get isTopicListRoute() {
    return this.discovery.onDiscoveryRoute;
  }

  @discourseComputed("router.currentRouteName")
  isTopicRoute(currentRouteName) {
    return currentRouteName.match(/^topic\./);
  }

  // @discourseComputed("router.currentRouteName")
  // isDocsRoute(currentRouteName) {
  //   return currentRouteName.match(/^docs\./);
  // }

  @dependentKeyCompat
  get viewingCategoryId() {
    return this.discovery.category?.id;
  }

  @dependentKeyCompat
  get viewingTagId() {
    return this.discovery.tag?.id;
  }

  @discourseComputed(
    "viewingCategoryId",
    "viewingTagId",
    "router.currentRoute.metadata.customThumbnailMode",
    "isTopicListRoute"
    // "isTopicRoute",
    // "isDocsRoute"
  )
  displayMode(
    viewingCategoryId,
    viewingTagId,
    customThumbnailMode,
    isTopicListRoute
    // isTopicRoute,
    // isDocsRoute
  ) {
    console.log("ello");
    if (customThumbnailMode) {
      return customThumbnailMode;
    }
    if (blogStyleCategories.includes(viewingCategoryId)) {
      return "blog-style";
    } else if (listCategories.includes(viewingCategoryId)) {
      return "list";
    } else if (blogStyleTags.includes(viewingTagId)) {
      return "blog-style";
    } else if (listStyleTags.includes(viewingTagId)) {
      return "list";
    } else if (isTopicListRoute) {
      return "list";
    } else {
      return "none";
    }
  }

  @discourseComputed("displayMode")
  enabledForRoute(displayMode) {
    return displayMode !== "none";
  }

  // @discourseComputed()
  // enabledForDevice() {
  //   return Site.current().mobileView ? settings.mobile_thumbnails : true;
  // }

  @discourseComputed("enabledForRoute")
  shouldDisplay(enabledForRoute) {
    return enabledForRoute;
  }

  @discourseComputed("shouldDisplay", "displayMode")
  displayList(shouldDisplay, displayMode) {
    return shouldDisplay && displayMode === "list";
  }

  @discourseComputed("shouldDisplay", "displayMode")
  displayBlogStyle(shouldDisplay, displayMode) {
    return shouldDisplay && displayMode === "blog-style";
  }
}
