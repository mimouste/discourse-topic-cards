import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-topic-list-cards",
  initialize() {
    withPluginApi("0.8.7", (api) => this.initWithApi(api));
  },

  initWithApi(api) {
    api.modifyClass("component:topic-list", {
      pluginId: "discourse-topic-list-cards",
      classNames: "topic-cards-list",
    });
    api.modifyClass("component:topic-list-item", {
      pluginId: "discourse-topic-list-cards",
      classNames: "topic-card",
    });
  },
};
