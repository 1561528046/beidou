<template>
  <div class="liveView">
    <ul>
      <li>
        <video-player
          class="vjs-custom-skin"
          ref="videoPlayer"
          :options="playerOptions"
          @pause="onPlayerPause()"
          @play="onPlayerPlay()"
        ></video-player>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  created() {
    if (window.monitor.video.size) {
      window.monitor.video.forEach(res => {
        this.playerOptions.sources[0].src = res;
        this.playerOptions.autoplay = true;
      });
    }
  },
  data() {
    return {
      videoSrc: "",
      initialized: false,
      currentTech: "",
      streams: {
        rtmp: "",
        hls: ""
      },
      playerOptions: {
        overNative: true,
        autoplay: true,
        controls: true,
        fluid: true,
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
            type: "rtmp/mp4",
            src: ""
          }
          // {
          //   withCredentials: false,
          //   type: "application/x-mpegURL",
          //   src: "http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8"
          // }
        ],
        poster: ""
        // controlBar: {
        //   timeDivider: false, // 时间分割线
        //   durationDisplay: false, // 总时间
        //   progressControl: false, // 进度条
        //   customControlSpacer: false, // 未知
        //   fullscreenToggle: false // 全屏
        // }
      }
    };
  },
  props: ["video", "videos"],
  watch: {
    video: {
      handler: function() {
        this.$set(this.$data, "videoSrc", this.$props.video.src);
        this.playerOptions.sources[0].src = window.monitor.video.get(
          this.$props.video.src
        );
        this.playerOptions.autoplay = true;
      },
      deep: true
    },
    videos: {
      handler: function() {
        this.$props.videos.map(item => {
          this.playerOptions.sources[0].src = window.monitor.video.get(item);
          this.playerOptions.autoplay = true;
        });
      },
      deep: true
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },
  methods: {
    // 暂停
    onPlayerPause() {
      // var data = {};
      // data = {
      //   MessageID: "x9202",
      //   SimID: this.videoSrc.substr(0, 12),
      //   Channel: this.videoSrc.substr(12),
      //   PlaybackControl: "1",
      //   Multiple: "0",
      //   PlaybackPosition: ""
      // };
      // this.$instruction.send(JSON.stringify(data));
    },
    //播放
    onPlayerPlay() {
      // var data = {};
      // data = {
      //   MessageID: "x9202",
      //   SimID: this.videoSrc.substr(0, 12),
      //   Channel: this.videoSrc.substr(12),
      //   PlaybackControl: "0",
      //   Multiple: "0",
      //   PlaybackPosition: ""
      // };
      // this.$instruction.send(JSON.stringify(data));
    }
  }
};
</script>

<style scoped>
.liveView ul {
  list-style: none;
  height: 580px;
}
.liveView ul li {
  height: 580px;
}
.selectWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 30px;
  margin: 20px;
  vertical-align: baseline;
}

.inputWrapper {
  width: 500px;
  margin: 0 auto;
}

.buttonWrapper {
  text-align: center;
}
</style>
