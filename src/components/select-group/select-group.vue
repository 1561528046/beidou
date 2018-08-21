<template>

  <el-popover placement="bottom" width="400" trigger="click" v-model="visible">

    <div slot="reference">
      <el-input placeholder="点击选择" style="width:100%;" disabled :value="currentNodeData.group_name">
        <el-button slot="append" icon="el-icon-more" @click="visible = !visible"></el-button>
      </el-input>
    </div>
    <div class="select-group-cotainer">

      <div class="_body" @click.stop>
        <div class="_filter">
          <input placeholder="输入关键字进行过滤" v-model="filterText" class="el-input__inner" style="height:30px; line-height:30px;" />
        </div>
        <div class="_tree" v-if="list.length">
          <div v-if="filterEmpty" style="padding:10px; text-align:center; color:#999;">
            没有相关数据！
          </div>
          <el-tree default-expand-all :expand-on-click-node="false" @node-click="nodeClick" :data="list" node-key="group_id" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <tree-item :props="defaultProps" v-model="data" :treeNode="node" @append="append" @remove="remove" @edit="edit" @add="add" placeholder="请输入分组名称" :useing="$props.useing"></tree-item>
            </span>
          </el-tree>

        </div>
      </div>
    </div>
  </el-popover>

</template>
<style lang="less">
.select-group-cotainer {
  margin: -12px;
  ._body {
    .el-input__inner,
    .el-input__inner:focus,
    .el-textarea__inner,
    .el-textarea__inner:focus {
      border: 1px solid #dcdfe6;
    }
  }
  ._filter {
    padding: 5px;
    box-sizing: border-box;
    height: 40px;
  }
  ._tree {
    width: 100%;
    height: 300px;
    overflow: auto;
    top: 40px;
    bottom: 0;
    .is-current > .el-tree-node__content {
      background-color: #f5f7fa;
    }
  }
}
</style>
<script>
// eslint-disable-next-line
import { getUserGroup, addGroup, delGroup, updateGroup } from "@/api/index.js";
import treeItem from "./tree-item.vue";
export default {
  components: { treeItem },
  beforeMount() {
    this.visible = false;
  },
  props: ["useing", "group_id"],
  data() {
    return {
      visible: false,
      filterText: "",
      filterEmpty: false,
      defaultProps: {
        label: "group_name"
      },
      props: {
        useing: [Array], //开启功能['add','remove','edit']
        group_id: [String]
      },
      currentNodeData: {},
      addId: 999,
      list: [
        // {
        //   id: 1,
        //   label: "一级 1",
        //   isAdd: true,
        //   children: [
        //     {
        //       id: 4,
        //       label: "二级 1-1",
        //       children: [
        //         {
        //           id: 9,
        //           label: "三级 1-1-1"
        //         },
        //         {
        //           id: 10,
        //           label: "三级 1-1-2"
        //         }
        //       ]
        //     }
        //   ]
        // },
      ]
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
      this.checkEmpty();
    }
  },
  created() {
    document.addEventListener("click", () => {
      this.visible = false;
    });
    getUserGroup({ user_id: 1 }).then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "list", res.data.data);
        // console.log(this.$refs.tree2.getNode({ key: "3" }));
        this.$nextTick(() => {
          var currentNode = this.$refs.tree2.getNode(this.$props.group_id);
          if (currentNode) {
            this.nodeClick(currentNode.data, currentNode);
          }
        });
      } else {
        this.$notify({
          type: "error",
          title: "错误",
          message: res.data.msg
        });
      }
    });
  },
  methods: {
    // eslint-disable-next-line
    nodeClick(data, node) {
      this.$set(this.$data, "currentNodeData", data);
      this.visible = false;
      this.$emit("input", this.currentNodeData.group_id);
      this.$emit("update:group_id", this.currentNodeData.group_id);
      this.$emit("update:parentid", node.parent.data.group_id || 0);
    },
    checkEmpty() {
      if (this.$refs.tree2) {
        var { childNodes } = this.$refs.tree2.root;
        this.filterEmpty =
          !childNodes ||
          childNodes.length === 0 ||
          childNodes.every(({ visible }) => !visible);
      } else {
        this.filterEmpty = false;
      }
    },
    // eslint-disable-next-line
    append({ node, nodeData }) {
      const newChild = {
        group_id: this.addId++,
        group_name: "",
        children: [],
        status: 0, //0编辑状态 1正常状态
        isAdd: true //是否为临时新增的元素，临时node首次添加后，直接点击取消将删除节点
      };
      if (!nodeData.children) {
        this.$set(nodeData, "children", []);
      }
      nodeData.children.push(newChild);
    },
    // eslint-disable-next-line
    edit({ node, nodeData, newNodeData }, next) {
      updateGroup({
        group_id: newNodeData.group_id,
        group_name: newNodeData.group_name,
        parent_id: node.parent.data.group_id || 0
      }).then(res => {
        if (res.data.code == 0) {
          nodeData.group_name = newNodeData.group_name;
          next(true);
        } else {
          this.$notify({
            type: "error",
            title: "错误",
            message: res.data.msg
          });
        }
      });
    },
    // eslint-disable-next-line
    add({ node, nodeData, newNodeData }, next) {
      addGroup({
        parent_id: node.parent.data.group_id,
        group_name: newNodeData.group_name,
        parent_level: node.parent.data.level
      }).then(res => {
        if (res.data.code == 0) {
          nodeData.group_name = newNodeData.group_name;
          nodeData.group_id = res.data.data[0].group_id;
          delete nodeData.isAdd;
          delete nodeData.status;
          next(true);
        } else {
          this.$notify({
            type: "error",
            title: "错误",
            message: res.data.msg
          });
        }
      });
    },
    // eslint-disable-next-line
    remove({ node, nodeData, newNodeData }) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.group_id === nodeData.group_id);
      if (newNodeData.isAdd) {
        children.splice(index, 1);
        return false;
      }
      delGroup({
        group_id: nodeData.group_id,
        level: node.parent.data.level || 0
      }).then(res => {
        if (this.currentNodeData == nodeData) {
          this.currentNodeData = null;
        }
        if (res.data.code == 0) {
          children.splice(index, 1);
        } else {
          this.$notify({
            type: "error",
            title: "错误",
            message: res.data.msg
          });
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.group_name.indexOf(value) !== -1;
    }
  }
};
</script>