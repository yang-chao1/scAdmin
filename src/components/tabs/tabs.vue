<template>
  <div style="position: relative;">
    <el-tabs v-model="activeIndex"
             type="border-card"
             v-if="openTab.length"
             @tab-click="tabClick"
             @tab-remove="tabRemove"
             ref="tabb"
    >
      <el-tab-pane :key="item.name"
                   v-for="(item,index) in openTab"
                   :name="item.route"
                   :label="item.meta.title"
                   :closable="item.route!=='/welcome'?true:false"
                   :ref="`tabb${index}`"
      >
        <!--这是定义tab的 内容的solt   -->
        <!-- <span slot="label"><svg-icon :icon-class="item.meta.icon !==undefined?item.meta.icon:
                             'sms-coupon'"
                           ></svg-icon>
          {{ item.meta.title }}</span> -->
      </el-tab-pane>
    </el-tabs>

    <span class="zi">
      <el-dropdown @command="handleCommand">

        <i class="el-icon-arrow-down"></i>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="cloneOther">
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="cloneAll">
            关闭所有
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>
    </span>
  </div>
</template>

<script src="./tabs.js">

</script>

<style lang="scss" scoped>
/deep/.el-tabs__nav {

}
/deep/.el-tabs__nav-wrap.is-scrollable {
     padding: 0 40px;
//    padding-right: 0;
}
/deep/.el-tabs--border-card {
    margin: 0 -20px;

    > .el-tabs__content {
        padding: 0;
    }

    > .el-tabs__header {
        margin-right: 40px;

    }
}

/deep/.el-tabs__nav-next, /deep/.el-tabs__nav-prev {
    line-height: 40px;
    font-size: 22px;
    width: 40px;

    padding-left: 10px;
    border-right: 1px solid #E0E0E0	;
    border-left: 1px solid #E0E0E0	;
}
/deep/.el-tabs__nav-next {
    // display: none;
    margin-left: -50px;
    background-color: white;
}
/deep/.el-tabs__nav-next:hover, /deep/.el-tabs__nav-prev:hover {

    background-color: white;
}
/deep/.el-dropdown {
    font-size: 20px;
}
.zi {
    position: absolute;
    right: -10px;
    top: 0;
    top: 50%;
    transform: translateY(-50%);
}
</style>
