<template>
  <scroll-bar>
    <!-- 
        collapse 是否水平折叠收起菜单
        default-active 当前激活菜单的index
        show-timeout 展开sub-menu的延时
    -->
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
    >
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
  components: {
    SidebarItem,
    ScrollBar
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      // console.log(this.$router)
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>