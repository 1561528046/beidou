<template>
  <div class="video-list">
    <el-row style="height:100%" :gutter="1">
      <el-col
        v-for="(playerOption,index) in playerOptions"
        :key="index"
        :span="getSpan()"
        :style="{height:getHeight()}"
        class="video-item"
        :class="{active:currentIndex==index}"
      >
        <div style="height:100%;position:relative;" @click="()=>{currentIndex = index}">
          <a href="javascript:;" class="video-close" @click="closeVideo(index)" v-show="playerOption.sources[0].src">
            <i class="el-icon-close"></i>
          </a>
          <video-player
            class="vjs-custom-skin"
            v-if="playerOption.sources[0].src"
            :options="playerOption"
            @click="()=>{currentIndex = index}"
          ></video-player>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  created() {
    this.makeVideoOptions();
  },
  data() {
    return {
      currentIndex: 0, //当前选中的屏幕
      playerOptions: []
    };
  },
  props: ["size", "srcs"],
  watch: {
    currentIndex: function() {
      this.$emit("changeCurrentIndex", this.currentIndex);
    },
    videos: {
      handler: function() {},
      deep: true
    },
    "$props.size": function(newVal) {
      if (this.currentIndex > newVal) {
        this.currentIndex = 0;
      }
      this.makeVideoOptions();
    }
  },
  computed: {},
  methods: {
    clearScreen() {
      this.playerOptions.map(item => {
        item.sources[0].src = "";
      });
    },
    closeVideo(index) {
      this.$set(this.playerOptions, index, this.getCleanOption());
    },
    setSources(src, type) {
      var currentOption = this.playerOptions[this.currentIndex];
      this.closeVideo(this.currentIndex);
      // type  1服务器  2终端（rtmp）
      currentOption.sources[0].src = src;
      if (type == 1) {
        delete currentOption.sources[0].type;
        currentOption.controlBar.progressControl = true;
      } else {
        currentOption.sources[0].type = "rtmp/mp4";
        currentOption.controlBar.progressControl = false;
      }

      this.$set(this.playerOptions, this.currentIndex, currentOption);
    },
    getHeight() {
      if (this.$props.size == 1) {
        return "100%";
      }
      if (this.$props.size == 6) {
        return "50%";
      }
      return (1 / Math.sqrt(this.$props.size)) * 100 + "%";
    },
    getSpan() {
      if (this.$props.size == 1) {
        return 24;
      }
      if (this.$props.size == 6) {
        return 8;
      }
      return 24 / Math.sqrt(this.$props.size);
    },
    makeVideoOptions() {
      var arr = [];
      var playingList = this.playerOptions.filter(item => {
        //过滤正在播放的视频列表
        return !!item.sources[0].src;
      });

      for (var i = 0; i < this.$props.size; i++) {
        if (playingList[i]) {
          arr.push(playingList[i]);
        } else {
          arr.push(this.getCleanOption());
        }
      }
      this.$set(this.$data, "playerOptions", arr);
    },
    getCleanOption() {
      return {
        overNative: true,
        autoplay: true,
        controls: true,
        aspectRatio: "16:8",
        techOrder: ["flash", "html5"],
        sourceOrder: true,
        notSupportedMessage: "暂无视频",
        flash: {
          hls: { withCredentials: false }
          // swf: isProduction
          //   ? "/vue-videojs-demo/static/media/video-js.swf"
          //   : "/static/media/video-js.swf"
        },
        html5: { hls: { withCredentials: false } },
        sources: [
          {
            src: ""
            // type: "rtmp/mp4",
            // src: "http://192.168.88.156:5000/key.flv"
            // src: "rtmp://60.10.139.122/live/livestream"
          }
        ],
        poster: "",
        controlBar: {
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: true // 进度条
          // customControlSpacer: true, // 未知
          // fullscreenToggle: true // 全屏
        }
      };
    }
  }
};
</script>
<style scoped lang="less">
.video-list {
  .video-close {
    z-index: 9999;
    display: block;
    text-align: center;
    line-height: 25px;
    width: 25px;
    height: 25px;
    position: absolute;
    right: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
  }
  .video-item {
    box-sizing: border-box;
    border: 1px solid #333;
    background: #000;
    &.active {
      border-color: #409eff;
    }
  }
}
</style>
