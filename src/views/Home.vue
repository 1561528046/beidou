<template>
  <div class="home">
    {{$store.user}} Hello!

  </div>
</template>
<script>
export default {
  created() {
    // var list = [];
    // for (var i = 0; i < 200000; i++) {
    //   list.push({ license: "冀R" + i, lat: i, lng: i, time: i });
    // }
    // this.$set(this.$data, "list", Object.freeze(list));
  },
  data() {
    return {
      list: []
    };
  },
  components: {},
  methods: {}
};
</script>