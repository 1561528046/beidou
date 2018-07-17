<template>
  <el-cascader :options="areaList" @active-item-change="handleItemChange" v-model="area" :props="props"></el-cascader>
</template>

<script>
import { getArea } from "@/api/index.js";
import _ from "lodash";
export default {
  name: "city-select",
  data() {
    return {
      area: [],
      areaList: [],
      props: {
        value: "area_id",
        label: "area_name"
      }
    };
  },
  watch: {
    area: function() {
      this.$emit("input", this.area);
    }
  },
  props: {
    value: Array
  },
  created() {
    //初始化省
    getArea({ parent_id: 0 }).then(res => {
      let data = res.data.data;
      data = data.map(item => {
        if (item.level == 3) {
          return item;
        }
        item.children = [];
        return item;
      });
      this.$set(this.$data, "areaList", data);
      //初始化值后，根据props传来的value进行层级渲染
      this.initData();
    });
    this.$set(this.$data, "area", this.$props.value);
  },
  methods: {
    initData: function() {
      var cloneValue = Object.assign([], this.$props.value);
      var arrPromise = [];
      cloneValue.map((area_id, index) => {
        if (index == 2) {
          return false;
        }
        arrPromise.push(getArea({ parent_id: area_id }));
      });
      Promise.all(arrPromise).then(arrRes => {
        var currentArea = this.areaList[
          _.findIndex(this.areaList, { area_id: cloneValue[0] })
        ]; //获取level 1 对象
        if (currentArea.level == 3) {
          this.$set(this.$data, "area", this.area.slice(0, 1));
          return false;
        }
        arrRes.map((item, index) => {
          //currentArea
          currentArea.children = item.data.data;
          if (cloneValue[index + 1] && currentArea) {
            var currentIndex = _.findIndex(currentArea.children, {
              area_id: cloneValue[index + 1]
            });
            if (currentIndex == -1) {
              //如果没有匹配的值、currentArea赋值为flase，不进行后面的循环
              currentArea = false;
              return false;
            }
            currentArea =
              currentArea.children[
                _.findIndex(currentArea.children, {
                  area_id: cloneValue[index + 1]
                })
              ];
          }
        });
      });
    },
    handleItemChange(val) {
      //根据返回的路径在层级数组中查找到最后一个匹配的值
      var currentObj = this.areaList;
      val.map(item => {
        currentObj = currentObj.length ? currentObj : currentObj.children;
        currentObj = currentObj[_.findIndex(currentObj, { area_id: item })];
      });

      getArea({ parent_id: currentObj.area_id }).then(res => {
        let data = res.data.data;
        data = data.map(item => {
          if (item.level == 3) {
            return item;
          }
          item.children = [];
          return item;
        });
        this.$set(currentObj, "children", data);
      });
    }
  }
};
</script>
