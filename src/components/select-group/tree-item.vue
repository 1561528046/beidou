<template>
  <div class="tree-node-item">
    <div class="_label">
      <template v-if="nodeData.status!=0">
        <i class="iconfont icon-folder-fill"></i> {{nodeData[props.label]}}</template>
      <div v-if="nodeData.status==0" @click.stop>
        <el-input v-model="nodeData[props.label]" :placeholder="$props.placeholder" size="mini" style="width:120px;margin-right:10px;" ref="labelInput"></el-input>
        <el-button icon="el-icon-check" type="primary" size="mini" @click="edit">确认</el-button>
        <el-button icon="el-icon-close" size="mini" @click="cancelEdit">取消</el-button>
      </div>
    </div>
    <div class="_tool" v-if="nodeData.status!=0" @click.stop>
      <i class="el-icon-circle-plus-outline" @click="append" v-if="useing.indexOf('add')!=-1"></i>
      <i class="el-icon-edit" @click="openEdit" v-if="useing.indexOf('edit')!=-1"></i>
      <i class="el-icon-delete" @click="remove" v-if="useing.indexOf('remove')!=-1"></i>
    </div>

  </div>
</template>
<style lang="less">
.el-tree-node__content {
  height: 35px;
}
.tree-node-item {
  display: flex;
  ._tool {
    display: none;
    margin-left: 20px;
    i {
      margin-right: 10px;
      font-size: 16px;
    }
  }
}
.el-tree-node__content {
  &:hover {
    ._tool {
      display: block;
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
      nodeData: JSON.parse(JSON.stringify(this.value))
    };
  },
  props: {
    props: {
      default: {
        label: "label",
        children: "children"
      }
    },
    useing: {
      //开启功能['add','remove','edit']
      type: [Array],
      default: function() {
        return [];
      }
    },
    placeholder: [String],
    value: {
      default: function() {
        return {};
      }
    },
    treeNode: {
      default: function() {
        return {};
      }
    }
  },
  methods: {
    append() {
      this.$emit("append", {
        node: this.treeNode,
        nodeData: this.$props.value
      });
    },
    openEdit() {
      this.$set(this.nodeData, "status", 0);
    },
    edit() {
      if (!this.nodeData[this.props.label]) {
        this.$message.error("必须输入名称！");
        return false;
      }
      var EVENT_TYPE = this.nodeData.isAdd ? "add" : "edit";
      this.$emit(
        EVENT_TYPE,
        {
          node: this.treeNode,
          nodeData: this.$props.value,
          newNodeData: this.nodeData
        },
        state => {
          if (state) {
            this.nodeData.status = 1;
            this.nodeData.isAdd = false;
            this.nodeDatagroup_name = this.$props.value.group_name;
            this.nodeData.group_id = this.$props.value.group_id;
          }
        }
      );
    },
    cancelEdit() {
      if (this.nodeData.isAdd) {
        this.remove();
      } else {
        this.$set(this.nodeData, "status", 1);
        this.$set(
          this.nodeData,
          this.props.label,
          this.$props.value[this.props.label]
        );
      }
    },
    remove() {
      this.$emit("remove", {
        node: this.treeNode,
        nodeData: this.$props.value,
        newNodeData: this.nodeData
      });
    }
  },
  watch: {}
};
</script>
<style>
.span_item:hover .span_icon {
  display: inline;
}
.span_icon {
  margin-left: 10px;
  display: none;
}
</style>