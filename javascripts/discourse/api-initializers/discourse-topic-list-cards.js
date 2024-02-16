import { readOnly } from "@ember/object/computed";
import { once } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import { withPluginApi } from "discourse/lib/plugin-api";
import {
  getResolverOption,
  setResolverOption,
} from "discourse-common/resolver";

export default {
  name: "discourse-topic-list-cards",
  initialize() {
    withPluginApi("0.8.7", (api) => this.initWithApi(api));
  },

  initWithApi(api) {
    api.modifyClass("component:topic-list", {
      pluginId: "discourse-topic-list-cards",
      topicThumbnailsService: service("topic-list-thumbnail"),
      classNameBindings: [
        "isThumbnailList:topic-thumbnails-list",
        "isBlogStyleGrid:topic-thumbnails-blog-style-grid",
      ],
      isThumbnailList: readOnly("topicThumbnailsService.displayList"),
      isBlogStyleGrid: readOnly("topicThumbnailsService.displayBlogStyle"),
    });

    // const siteSettings = api.container.lookup("service:site-settings");

    api.modifyClass("component:topic-list-item", {
      pluginId: "discourse-topic-list-card",
      topicThumbnailsService: service("topic-list-thumbnail"),

      // Hack to disable the mobile topic-list-item template
      // Our grid styling is responsive, and uses the desktop HTML structure
      //   @observes("topic.pinned")
      //   renderTopicListItem() {
      //     const wasMobileView = getResolverOption("mobileView");
      //     if (
      //       wasMobileView &&
      //       (this.topicThumbnailsService.displayGrid ||
      //         this.topicThumbnailsService.displayMasonry ||
      //         this.topicThumbnailsService.displayMinimalGrid ||
      //         this.topicThumbnailsService.displayBlogStyle)
      //     ) {
      //       setResolverOption("mobileView", false);
      //     }

      //     this._super();

      //     if (wasMobileView) {
      //       setResolverOption("mobileView", true);
      //     }
      //   },
      // });
    });
  },
};
