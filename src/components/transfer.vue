<template>
    <div class="admin-transfer">
        <div class="left-transfer transfer-box">
            <div class="_header">
                <label>
                    <el-checkbox v-model="leftCheckAll">{{titles[0]||"列表1"}}</el-checkbox>
                </label>
            </div>
            <div class="_body">
                <div class="_search"></div>
                <div class="_list">
                    <el-checkbox-group v-model="leftChecked">
                        <el-checkbox v-for="item in list" :key="item.key" :label="item.key" v-if="item.parent == 'left'">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <div class="btns-transfer">
            <div class="_position">
                <el-button type="primary" icon="el-icon-arrow-right" @click="goRight" :disabled="!leftChecked.length"></el-button>
                <el-button type="primary" icon="el-icon-arrow-left" @click="goLeft" :disabled="!rightChecked.length"></el-button>
            </div>
        </div>
        <div class="right-transfer transfer-box">
            <div class="_header">
                <label>
                    <el-checkbox v-model="rightCheckAll">{{titles[1]||"列表2"}}</el-checkbox>
                </label>
            </div>
            <div class="_body">
                <div class="_search"></div>
                <div class="_list">
                    <el-checkbox-group v-model="rightChecked">
                        <el-checkbox v-for="item in list" :key="item.key" :label="item.key" v-if="item.parent == 'right'">{{item.label}}</el-checkbox>
                    </el-checkbox-group>

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
        height: 400px;
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
        border-radius: 4px;
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
        ._list {
            height: 300px;
            overflow: auto;

            label {
                display: block;
                height: 30px;
                line-height: 30px;
                padding-left: 15px;
                display: block;
            }
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
        }
        ._search {}
    }
</style>
<script>
    export default {
        data() {

            return {
                leftCheckAll: false,
                rightCheckAll: false,
                leftChecked: [],//已选key
                rightChecked: [],//已选key
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
            }
        },
        watch: {
            leftCheckAll: function (val) {
                var arr = [];
                if (val) {
                    this.list.filter((item) => {
                        if (item.parent == "left") {
                            arr.push(item.key);
                        }
                    });
                }
                this.$set(this.$data, "leftChecked", arr);
            },
            rightCheckAll: function (val) {
                var arr = [];
                if (val) {
                    this.list.filter((item) => {
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
            titles: Array
        },
        created() {

        },
        methods: {
            goLeft() {
                var arr = this.list.filter((item) => {
                    if (this.rightChecked.indexOf(item.key) != -1) {
                        //item.parent = "left";
                        return true;
                    } else {
                        return false;
                    }
                });
                var loader = this.$loading({
                    lock: true,
                    text: '加载中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.3)',
                    target: ".right-transfer"
                });
                this.$emit("onLeft", arr, (state) => {
                    if (state) {
                        arr.map((item) => {
                            item.parent = "left";
                        })
                        this.$set(this.$data, "rightChecked", []);
                        this.rightCheckAll = false
                    }
                    loader.close();
                });

            },
            goRight() {
                var arr = this.list.filter((item) => {
                    if (this.leftChecked.indexOf(item.key) != -1) {
                        //item.parent = "right";
                        return true;
                    } else {
                        return false;
                    }
                });
                var loader = this.$loading({
                    lock: true,
                    text: '加载中',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.3)',
                    target: ".left-transfer"
                });
                this.$emit("onRight", arr, (state) => {
                    if (state) {
                        arr.map((item) => {
                            item.parent = "right";
                        })
                        this.$set(this.$data, "leftChecked", []);
                        this.leftCheckAll = false
                    }
                    loader.close();
                });

            }

        }

    }
</script>