<template>
    <div style=" display:inline-block;width:100%;overflow:auto; height:1000px;" class="select-group-cotainer">
        <div class="_filter">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText">
            </el-input>
        </div>
        <div class="_tree">
            <el-tree :data="list" no-key="id" :expand-on-click-node="false" :props="defaultProps" :filter-node-method="filterNode" ref="tree2">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    {{node.id}}
                    <span v-if="!node.adding">{{ node.label }}</span>
                    <el-input placeholder="请输入内容" v-model="input5" class="input-with-select" v-if="node.adding">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <span>
                        <el-button type="text" size="mini" @click="() => append(data)">
                            Append
                        </el-button>
                        <el-button type="text" size="mini" @click="() => remove(node, data)">
                            Delete
                        </el-button>
                    </span>
                </span>
            </el-tree>

        </div>
    </div>
</template>
<style lang="less">
.select-group-cotainer {
  position: relative;
  z-index: 2;
  ._tree {
    position: absolute;
    width: 100%;
    height: 300px;
    overflow: auto;
  }
}
</style>
<script>
// import { getUserAll, getUser } from "@/api/index.js";
export default {
  name: "select-user",
  data() {
    return {
      console: console.log,
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      addId: 999,
      addingId: "",
      list: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ]
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  methods: {
    append(data) {
      console.log(this.$refs.tree2);
      const newChild = {
        id: this.addId++,
        label: "testtest",
        children: []
      };
      console.log(newChild.$treeNodeId);
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>