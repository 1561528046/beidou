<template>
  <div class="liveView">
    <ul>
      <li :style="{'border':border.borderOne}" @click="selected(1)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen1"></video-player>
      </li>
      <li :style="{'border':border.borderTwo}" @click="selected(2)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen2"></video-player>
      </li>
      <li :style="{'border':border.borderThree}" @click="selected(3)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen3"></video-player>
      </li>
      <li :style="{'border':border.borderFour}" @click="selected(4)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen4"></video-player>
      </li>
      <li :style="{'border':border.borderFive}" @click="selected(5)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen5"></video-player>
      </li>
      <li :style="{'border':border.borderSix}" @click="selected(6)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen6"></video-player>
      </li>
      <li :style="{'border':border.borderSeven}" @click="selected(7)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen7"></video-player>
      </li>
      <li :style="{'border':border.borderEight}" @click="selected(8)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen8"></video-player>
      </li>
      <li :style="{'border':border.borderNine}" @click="selected(9)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen9"></video-player>
      </li>
      <li :style="{'border':border.borderTen}" @click="selected(10)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen10"></video-player>
      </li>
      <li :style="{'border':border.borderEleven}" @click="selected(11)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen11"></video-player>
      </li>
      <li :style="{'border':border.borderTwelve}" @click="selected(12)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen12"></video-player>
      </li>
      <li :style="{'border':border.borderThirteen}" @click="selected(13)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen13"></video-player>
      </li>
      <li :style="{'border':border.borderFourteen}" @click="selected(14)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen14"></video-player>
      </li>
      <li :style="{'border':border.borderFifteen}" @click="selected(15)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen15"></video-player>
      </li>
      <li :style="{'border':border.borderSixteen}" @click="selected(16)">
        <video-player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions.screen16"></video-player>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "live",
  created() {
    var i = 1;
    var name = "screen";
    if (window.monitor.video.size) {
      window.monitor.video.forEach(res => {
        this.videoData.push(res);
        if (i > 16) {
          return;
        } else {
          name = name + i;
          this.playerOptions[name].sources[0].src = res;
          this.playerOptions[name].autoplay = true;
          i++;
          name = "screen";
        }
      });
      this.videoNum = i;
    }
  },
  data() {
    return {
      videoNum: 1, //记录播放到哪个屏
      videoData: [],
      border: {
        borderOne: "",
        borderTwo: "",
        borderThree: "",
        borderFour: "",
        borderFive: "",
        borderSix: "",
        borderSeven: "",
        borderEight: "",
        borderNine: "",
        borderTen: "",
        borderEleven: "",
        borderTwelve: "",
        borderThirteen: "",
        borderFourteen: "",
        borderFifteen: "",
        borderSixteen: ""
      },
      playerOptions: {
        screen1: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen2: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen3: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen4: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen5: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen6: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen7: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen8: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen9: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen10: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen11: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen12: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen13: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen14: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen15: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        },
        screen16: {
          overNative: true,
          autoplay: false,
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
              type: "rtmp/mp4",
              src: ""
            }
          ],
          poster: "",
          controlBar: {
            timeDivider: false, // 时间分割线
            durationDisplay: false, // 总时间
            progressControl: false // 进度条
            // customControlSpacer: true, // 未知
            // fullscreenToggle: true // 全屏
          }
        }
      }
    };
  },
  props: ["video", "videos"],
  watch: {
    video: {
      handler: function() {
        if (
          !this.videoData.includes(
            window.monitor.video.get(this.$props.video.src)
          )
        ) {
          this.videoData.push(window.monitor.video.get(this.$props.video.src));
          var name = "screen" + this.videoNum;
          this.videoNum = this.videoNum + 1;
          this.playerOptions[name].sources[0].src = window.monitor.video.get(
            this.$props.video.src
          );
          this.playerOptions[name].autoplay = true;
        }
      },
      deep: true
    },
    videos: {
      handler: function() {
        this.$props.videos.map(item => {
          this.videoData.push(window.monitor.video.get(this.$props.video.src));
          var name = "screen" + this.videoNum;
          this.videoNum = this.videoNum + 1;
          this.playerOptions[name].sources[0].src = window.monitor.video.get(
            item
          );
          this.playerOptions[name].autoplay = true;
        });
      },
      deep: true
    }
  },
  computed: {},
  methods: {
    selected(num) {
      this.videoNum = num;
      num = this.$dict.get_number(JSON.stringify(num));
      for (var key in this.border) {
        if (key.substr(6) == num) {
          this.border[key] = "solid 1px #3cf500";
        } else {
          this.border[key] = "";
        }
      }
    }
  }
};
</script>

<style scoped>
.liveView {
  position: relative;
}
.liveView ul {
  list-style: none;
  overflow: hidden;
  height: 580px;
}
.liveView ul li {
  border: 1px #fff solid;
  height: 141px;
  width: 24.7%;
  float: left;
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
