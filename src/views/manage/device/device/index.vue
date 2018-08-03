<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="添加时间">
              <el-date-picker value-format="yyyyMMdd" v-model="value6" type="daterange" align="right" unlink-panels range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端ID">
              <el-input v-model="tableQuery.device_no" placeholder="终端ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SIM ID">
              <el-input v-model="tableQuery.sim_id" placeholder="SIM ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端类型">
              <select-devicetype style="width: 100%;" v-model="tableQuery.device_type"></select-devicetype>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端厂商">
              <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.company_name" :fetch-suggestions="querySearch"
                placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
              </el-autocomplete>
              <!-- <select-company v-model="tableQuery.company_id" style="width:100%;"></select-company> -->
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="分配用户">
              <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.real_name" :fetch-suggestions="querySearch"
                placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" size="small" @click="addFrom">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
        <router-link :to="{name:'device-binding'}" style="margin-left: 15px;">
          <el-button type="primary" size="small">
            <i class="el-icon-upload el-icon--right"></i> 设备绑定管理
          </el-button>
        </router-link>
        <el-dropdown>
          <el-button size="small" style="margin-left: 15px;" type="primary">
            批量上传
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="padding:2px 15px;">
              <el-upload action="medium " accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                            application/vnd.ms-excel " :show-file-list="false " :http-request="uploadFunc " class="o-el-upload--text">
                <!-- <i class="el-icon-upload el-icon--right "></i> 点击上传 -->
                <el-button size="small" icon="el-icon-upload2" type="primary" style="display: block;width:100%;">点击上传</el-button>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item style="padding:2px 15px;">
              <a href="/static/设备导入模板.xls" download target="_blank" type="primary " class="el-button el-button--small el-button--primary"
                style=" display: block;">
                <i class="el-icon-download"></i> 模版下载
              </a>

            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">

        <el-table-column prop="time" label="添加时间" :formatter="(row)=>{return this.$utils.formatDate(row.time)}"></el-table-column>
        <el-table-column prop="device_type" label="终端类型" :formatter="(row)=>{return this.$dict.get_device_type(row.device_type)}">
        </el-table-column>
        <el-table-column prop="company_name" label="终端厂商" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="device_no" label="终端ID"></el-table-column>
        <!-- <el-table-column prop="device_no" label="设备序列号" :formatter="$utils.baseFormatter"> </el-table-column> -->
        <!-- <el-table-column prop="company_id" label="设备厂家Id"></el-table-column> -->
        <el-table-column prop="sim_id" label="SIM ID" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="protocol_type" label="协议类型" :formatter="(row)=>{return this.$dict.get_protocol_type(row.protocol_type)}">
        </el-table-column>
        <el-table-column prop="real_name" label="分配用户" :formatter="$utils.baseFormatter">
        </el-table-column>
        <!-- <el-table-column prop="install_date" label="安装日期"></el-table-column> -->
        <!-- <el-table-column prop="camera_num" label="摄像头数量" :formatter="$utils.baseFormatter"></el-table-column> -->
        <!-- <el-table-column prop="save_media" label="存储介质" :formatter="(row)=>{return this.$dict.get_save_media(row.save_media)}"></el-table-column> -->
        <el-table-column prop="state" label="状态" :formatter="(row)=>{return this.$dict.get_state(row.state)}"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="updateForm(scope)" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" @click="delRow(scope)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]"
          :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
  import selectDevicetype from "@/components/select-devicetype.vue";
  import selectProtocoltype from "@/components/select-protocoltype.vue";
  import selectCompany from "@/components/select-company.vue"
  import device_add from "./add.vue";
  import device_update from "./update.vue";
  import { getDeviceList, delDevice, getDeviceCompanyAll, getUserAll } from "@/api/index.js";
  export default {
    created() {
      this.getTable();
      this.keyupdown();
    },
    data() {
      return {
        isCollapse: false,
        tableQuery: {
          device_type: "",
          device_id: "",
          device_no: "",
          company_name: "",
          company_id: "",
          real_name: "",
          sim_id: "",
          startDate: "",
          endDate: "",
          size: 10,
          page: 1
        },
        simss: [],
        simjj: [],
        simee: {},
        simhh: {},
        tableData: {
          total: 0,
          data: []
        },
        tableLoading: true,
        addKey: 0,
        userdetailShow: false,
        restaurants: [],
        state1: '',
        state2: '',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value6: '',
        value7: ''
      };
    },
    mounted() {
      this.restaurants = this.loadAll();
    },
    methods: {

      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        console.log(results)
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        getDeviceCompanyAll().then(res => {
          if (res.data.code == 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].real_name !== "") {
                this.simss.push({ value: res.data.data[i].company_name, address: res.data.data[i].company_id })
              }
            }
          }
        })
        getUserAll().then(res => {
          if (res.data.code == 0) {
            for (var i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].real_name !== "") {
                this.simjj.push({ value: res.data.data[i].real_name, address: res.data.data[i].user_id })
              }
            }
          }
        })
        return this.simss, this.simjj
      },
      handleSelect(item) {
        this.simee = { value: item.value, address: item.address }
        this.simhh = { value: item.value, address: item.address }
        console.log(this.simhh)
        this.getTable()
      },
      formatter(row) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column["property"];
        return row[property] === value;
      },
      handleSizeChange(val) {
        this.tableQuery.page = 1;
        this.tableQuery.limit = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.tableQuery.page = val;
        this.getTable();
      },
      delRow(scope) {//删除
        this.$confirm('确认删除？')
          .then(() => {
            delDevice({ id: scope.row.device_id }).then((res) => {
              if (res.data.code == 0) {
                this.$message.success(res.data.msg);
                this.getTable();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          })
          .catch(() => { });
      },
      addFrom() {//添加
        var vNode = this.$createElement(device_add, {
          key: this.addKey++,
          on: {
            success: () => {
              this.getTable();
              this.$msgbox.close();
            },
            error: function () {
            }
          }
        });
        this.$msgbox({
          showConfirmButton: false,//是否显示确定按钮	
          customClass: "admin-message-form",
          title: "添加设备",
          closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
          closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
          message: vNode
        })
      },
      updateForm(scope) {//编辑
        var vNode = this.$createElement(device_update, {
          key: this.addKey++,
          props: {
            device_id: scope.row.device_id
          },
          on: {
            success: () => {
              this.getTable();
              this.$msgbox.close();
            },
            error: function () {
            }
          }
        });
        this.$msgbox({
          showConfirmButton: false,//是否显示确定按钮	
          customClass: "admin-message-form",
          title: "编辑设备",
          closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
          closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
          message: vNode
        })
      },
      getTable() {//获取列表
        this.tableLoading = true;
        if (this.value6) {
          this.tableQuery.startDate = this.value6[0]
          this.tableQuery.endDate = this.value6[1]
        }
        if (this.simee.address) {
          this.tableQuery.company_id = this.simee.address
        }
        if (this.tableQuery.company_name == "") {
          this.tableQuery.company_id = ""
        }
        if (this.simhh.address) {
          this.tableQuery.user_id = this.simee.address
        }
        if (this.tableQuery.real_name == "") {
          this.tableQuery.user_id = ""
        }
        var query = Object.assign({}, this.tableQuery);
        getDeviceList(query)

          .then(res => {
            if (res.data.code == 0) {
              this.$set(this.$data, "tableData", res.data);
            } else {
              this.$set(this.$data, "tableData", []);
              this.$message.error(res.data.msg);
            }
            this.tableLoading = false;
          })
          .catch(() => { });
      },
      //上传
      uploadFunc(uploadObj) {
        var formData = new FormData();
        formData.append("ff", uploadObj.file);
        this.$ajax.post("/public/UploadExcel", formData, {
          params: { table: 1 }
        }).then((res) => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
              duration: 5000
            });
            this.getTable();
          } else {
            this.$notify.error({
              title: '导入失败',
              message: res.data.msg
            });
            // this.$message.error(res.data.msg);
          }

        }).catch((err, a) => {
          console.log(a)
          this.$message.error("接口错误，错误码：" + err.response.status)
        })
      },
      uploadSuccess() { },
      uploadError() {
        alert(1);
      },
      uploadProgress() { },
      //回车事件
      keyupdown() {
        document.onkeydown = e => {
          console.log(e)
          let _key = window.event.keyCode;

          if (_key === 13) {
            this.getTable()
          }
        }
      }

    },
    components: { selectDevicetype, selectProtocoltype, device_add, device_update, selectCompany },
  };
</script>