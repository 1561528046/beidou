<template>
  <div class="admin-transfer">
    <div class="left-transfer transfer-box">
      <div class="_header">{{titles[0]||"列表1"}}</div>
      <div class="_body">
        <div class="_list">
          <div
            v-if="leftList.length==0"
            style="padding:20px 0; text-align: center; color:#999;"
          >数据为空</div>
          <el-table
            :data="leftList"
            style="width: 100%"
            v-if="leftList.length!=0"
            size="mini"
            @selection-change="leftSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              v-for="(col,index) in leftCol"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :key="index"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="btns-transfer">
      <div class="_position">
        <el-button
          type="primary"
          icon="el-icon-arrow-right"
          @click="goRight"
          :disabled="!leftChecked.length"
        ></el-button>
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          @click="goLeft"
          :disabled="!rightChecked.length"
        ></el-button>
      </div>
    </div>
    <div class="right-transfer transfer-box">
      <div class="_header">{{titles[1]||"列表2"}}</div>
      <div class="_body">
        <div class="_list">
          <div
            v-if="rightList.length==0"
            style="padding:20px 0; text-align: center;color:#999;"
          >数据为空</div>
          <!-- <el-checkbox-group v-model="rightChecked">
            <el-checkbox v-for="item in rightList" :key="item.key" :label="item.key">{{item.label}}</el-checkbox>
          </el-checkbox-group>-->
          <el-table
            :data="rightList"
            style="width: 100%"
            v-if="rightList.length!=0"
            size="mini"
            @selection-change="rightSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              v-for="(col,index) in rightCol"
              :prop="col.prop"
              :label="col.label"
              :formatter="col.formatter"
              :key="index"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.admin-transfer {
  display: flex;
  justify-content: space-around;
  width: 800px;
  height: 100%;
}

.btns-transfer {
  position: relative;
  width: 100px;
  ._position {
    text-align: center;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .el-button {
      margin: 10px 0;
    }
  }
}

.transfer-box {
  border: 1px solid #ebeef5;
  overflow: hidden;
  background: #fff;
  display: inline-block;
  vertical-align: middle;
  max-height: 100%;
  box-sizing: border-box;
  position: relative;
  width: 40%;
  ._header {
    height: 40px;
    line-height: 40px;
    background: #f5f7fa;
    margin: 0;
    padding-left: 15px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    color: #000;
    label {
      display: block;
    }
  }
  ._body {
    position: absolute;
    top: 40px;
    bottom: 0;
    width: 100%;
  }
  ._list {
    height: 100%;
    width: 100%;
    overflow: auto;

    label {
      display: block;
      height: 30px;
      line-height: 30px;
      padding-left: 15px;
      display: block;
    }
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
  ._search {
  }
}
</style>
<script>
export default {
  data() {
    return {
      leftCheckAll: false,
      rightCheckAll: false,
      leftChecked: [], //已选key
      rightChecked: [], //已选key
      list: this.$props.lists
      // list: [
      //     {
      //         key: 1,
      //         label: "1",
      //         parent: "left"
      //     },
      //     {
      //         key: 2,
      //         label: "2",
      //         parent: "right"
      //     }
      // ]
    };
  },
  computed: {
    leftList: function() {
      return this.list.filter(item => {
        return item.parent == "left";
      });
    },
    rightList: function() {
      return this.list.filter(item => {
        return item.parent == "right";
      });
    }
  },
  watch: {
    btn: function() {
      this.leftChecked = [];
      this.rightChecked = [];
    },
    lists: function() {
      this.$set(this.$data, "list", this.lists);
    },
    leftCheckAll: function(val) {
      var arr = [];
      if (val) {
        this.list.filter(item => {
          if (item.parent == "left") {
            arr.push(item.key);
          }
        });
      }
      this.$set(this.$data, "leftChecked", arr);
    },
    rightCheckAll: function(val) {
      var arr = [];
      if (val) {
        this.list.filter(item => {
          if (item.parent == "right") {
            arr.push(item.key);
          }
        });
      }
      this.$set(this.$data, "rightChecked", arr);
    }
  },
  props: {
    lists: Array,
    titles: Array,
    leftCol: Array,
    rightCol: Array,
    btn: Number
  },
  created() {},
  methods: {
    leftSelectionChange(selection) {
      this.$set(this.$data, "leftChecked", selection);
    },
    rightSelectionChange(selection) {
      this.$set(this.$data, "rightChecked", selection);
    },
    goLeft() {
      var loader = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
        target: ".right-transfer"
      });
      this.$emit("onLeft", this.rightChecked, state => {
        if (state) {
          this.rightChecked.map(item => {
            item.parent = "left";
          });
          this.$set(this.$data, "rightChecked", []);
          this.rightCheckAll = false;
        }
        loader.close();
      });
    },
    goRight() {
      var loader = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.3)",
        target: ".left-transfer"
      });
      this.$emit("onRight", this.leftChecked, state => {
        if (state) {
          this.leftChecked.map(item => {
            item.parent = "right";
          });
          this.$set(this.$data, "leftChecked", []);
          this.leftCheckAll = false;
        }
        loader.close();
      });
    }
  }
};
</script>