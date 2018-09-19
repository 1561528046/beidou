<template>
  <div class="monitor">
    <div id="container" style="width:100%;height:100%;"></div>
    <div class="vehicle-search shadow-box">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input placeholder="搜索车辆（车牌号、终端ID）" size="small" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4" class="_right">
          <i class="el-icon-more"></i>
        </el-col>
      </el-row>
    </div>

    <div class="vehicle-info-box shadow-box open">
      <div class="_header">
        <strong class="_title">冀R61333</strong>
        <small class="_text">服务到期日期：2019-3-1 </small>
        <i class="_close el-icon-circle-close-outline"></i>
      </div>
      <div class="_map">
        <a class="_map-btn">展开地图</a>
        <div class="_map-container"></div>
      </div>
      <div class="_body">
        <el-row>
          <el-col :span="24">
            定位时间：2018-05-05 13：22：36
          </el-col>
          <el-col :span="12">
            联系人：XXX
          </el-col>
          <el-col :span="12">
            联系方式： 13000000000
          </el-col>
          <el-col :span="12">
            时速：60/km
          </el-col>
          <el-col :span="12">
            今日里程：600/km
          </el-col>
          <el-col :span="24">
            地理位置：河北省廊坊市广阳区XXX300米
          </el-col>
        </el-row>
      </div>
      <div class="_footer">
        <i class="iconfont icon-idcard"></i>
        <i class="iconfont icon-boxplot-fill"></i>
        <i class="iconfont icon-sim"></i>
        <i class="iconfont icon-alert-fill"></i>
        <i class="iconfont icon-wifi"></i>
        <i class="iconfont icon-error-fill _error"></i>

      </div>
    </div>

    <div class="status-container shadow-box">
      <div class="_header">
        <span class="_global-status">平台车辆总数：
          <strong>100000 </strong>
        </span>
        <span class="_global-status _online">在线车辆：
          <strong>51651 </strong>
        </span>
        <span class="_global-status _alarm">报警车辆：
          <strong>16161 </strong>
        </span>
        <span class="_global-status _error">异常车辆：
          <strong>981196 </strong>
        </span>
        <span class="_global-status _offline">离线车辆：
          <strong>400</strong>
        </span>
        <el-button class="_open" icon="el-icon-arrow-right" size="mini">展开</el-button>
      </div>
      <div class="_body">
        <el-form :inline="true" size="mini" class="_search">
          <el-form-item label="用户名称">
            <el-input placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="_table">
          <el-table :data="tableData" size="small" style="width: 100%">
            <el-table-column prop="user_name" label="用户名称" width="180">
            </el-table-column>
            <el-table-column prop="total" label="车辆总数">
            </el-table-column>
            <el-table-column prop="online" label="在线车辆 ">
            </el-table-column>
            <el-table-column prop="alarm" label="报警车辆  ">
            </el-table-column>
            <el-table-column prop="error" label="异常车辆  ">
            </el-table-column>
            <el-table-column prop="offline" label="离线车辆 ">
            </el-table-column>
          </el-table>

        </div>
        <div class="_pager">
          <el-pagination background layout="prev, pager, next" :total="1000">
          </el-pagination>
        </div>
      </div>
    </div>

    <div class="details-container shadow-box">
      <div class="_header">
        <div class="_title">
          报警车辆
        </div>
        <div class="_text">
          新东方客运公司
        </div>
      </div>
      <div class="_body">
        <div class="group-container">
          <div class="group-name">子级分组1</div>
          <el-select placeholder="全部分组" size="mini" style="width:100%;">
            <el-option label="分组1" value="shanghai"></el-option>
            <el-option label="分组2" value="beijing"></el-option>
          </el-select>
          <el-table :data="tableData" size="small" style="width: 100%">
            <el-table-column prop="user_name" label="车牌号" width="180">
            </el-table-column>
            <el-table-column prop="total" label="报警总数">
            </el-table-column>
          </el-table>
        </div>

        <div class="group-container">
          <div class="group-name">子级分组1</div>
          <el-select placeholder="全部分组" size="mini" style="width:100%;">
            <el-option label="分组1" value="shanghai"></el-option>
            <el-option label="分组2" value="beijing"></el-option>
          </el-select>
          <el-table :data="tableData" size="small" style="width: 100%">
            <el-table-column prop="user_name" label="车牌号" width="180">
            </el-table-column>
            <el-table-column prop="total" label="报警总数">
            </el-table-column>
          </el-table>
        </div>

        <div class="group-container">
          <div class="group-name">子级分组1</div>
          <el-select placeholder="全部分组" size="mini" style="width:100%;">
            <el-option label="分组1" value="shanghai"></el-option>
            <el-option label="分组2" value="beijing"></el-option>
          </el-select>
          <el-table :data="tableData" size="small" style="width: 100%">
            <el-table-column prop="user_name" label="车牌号" width="180">
            </el-table-column>
            <el-table-column prop="total" label="报警总数">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>
<style lang="less">
@pirmary: #409eff;
@success: #67c23a;
@warning: #e6a23c;
@danger: #f56c6c;
@info: #909399;
@t1: #303133;
@t2: #606266;
@t3: #909399;
@t4: #c0c4cc;
@b1: #dcdfe6;
@b2: #e4e7ed;
@b3: #ebeef5;
@b4: #f2f6fc;

.details-container {
  width: 17%;
  position: absolute;
  z-index: 11;
  right: 20px;
  top: 20px;
  bottom: 20px;
  background: #fff;
  ._header {
    height: 60px;
    padding: 15px;
    line-height: 1.5;
    ._text {
      font-size: 12px;
      color: @t3;
    }
  }
  ._body {
    padding: 15px;
    box-sizing: border-box;
    overflow: auto;
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
    left: 0;
  }
  .group-container {
    margin-bottom: 15px;
    .group-name {
      padding-bottom: 10px;
    }
  }
}
.status-container {
  width: 60%;
  position: absolute;
  z-index: 11;
  left: 390px;
  top: 20px;
  background: #fff;
  ._header {
    position: relative;
    height: 50px;
    box-sizing: border-box;
    padding: 0 15px;
    line-height: 50px;
    border-bottom: 1px solid @b3;
    font-size: 14px;
    ._open {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translate(0, -50%);
    }
    ._global-status {
      padding-right: 2em;
    }
    ._online strong {
      color: @success;
    }
    ._alarm strong {
      color: @danger;
    }
    ._error strong {
      color: @warning;
    }
    ._offline strong {
      color: @t3;
    }
  }
  ._body {
    ._search {
      padding: 15px 0 15px 15px;
      border-bottom: 1px solid @b3;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    ._pager {
      padding: 10px;
      text-align: center;
    }
  }
}
.monitor {
  height: 100%;
  position: relative;
  color: @t1;
}
.shadow-box {
  box-shadow: 2px 2px 5px #ddd;
  border-radius: 5px;
}
.vehicle-search {
  position: absolute;
  width: 350px;
  background: #fff;
  z-index: 10;
  left: 20px;
  top: 20px;
  padding: 10px;
  box-sizing: border-box;
  height: 50px;
  ._right {
    text-align: center;
    i {
      font-size: 30px;
      cursor: pointer;
    }
  }
}
.vehicle-info-box {
  font-size: 14px;
  position: absolute;
  width: 350px;
  background: #fff;
  z-index: 10;
  left: 20px;
  top: 120px;
  &.open {
    height: 400px;
    ._map {
      height: 50%;
      background: #999;
    }
  }
  ._header {
    box-sizing: border-box;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 15px;
    position: relative;
    height: 40px;
    line-height: 40px;
    ._title {
      padding-right: 1em;
      font-size: 16px;
    }
    ._text {
      font-size: 12px;
      color: #999;
    }
    ._close {
      right: 15px;
      top: 50%;
      transform: translate3d(0, -50%, 0);
      font-size: 20px;
      position: absolute;
    }
  }
  ._map {
    position: relative;
    min-height: 25px;
    ._map-btn {
      position: absolute;
      bottom: 0;
      font-size: 12px;
      width: 100px;
      left: 50%;
      margin-left: -50px;
      border: 1px solid #f0f0f0;
      border-top: 0;
      text-align: center;
      height: 25px;
      line-height: 25px;
      background: #fff;
    }
    ._map-container {
      height: 100%;
      width: 100%;
    }
  }
  ._body {
    height: 30%;
    box-sizing: border-box;
    padding: 15px;
    line-height: 1.8;
  }
  ._footer {
    height: 30px;
    padding-top: 10px;
    box-sizing: border-box;
    border-top: 1px solid #f0f0f0;
    ._error {
      position: absolute;
      right: 15px;
      color: #ff8d00;
    }
    i {
      font-size: 25px;
      display: inline-block;
      width: 40px;
      cursor: pointer;
      text-align: center;
    }
  }
}
</style>
<script>
/*eslint-disable*/
import initMap from "@/utils/map.js";
export default {
  data() {
    return {
      maps: [],
      tableData: [
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        },
        {
          user_name: "王小虎",
          total: 616161,
          error: 16161,
          online: 1234,
          offline: 1255,
          alarm: 2616
        }
      ]
    };
  },
  created() {
    initMap(() => {
      this.$nextTick(() => {
        var map = new AMap.Map("container", {
          viewMode: "3D",
          pitch: 55,
          rotation: -45
        });
      });
    });
  },
  destroyed() {
    this.maps.map(map => {
      console.log(map.destroy);
    });
  }
};
</script>
