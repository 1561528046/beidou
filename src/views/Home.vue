<template>
  <div class="home">
    Hello!
    <admin-transfer @onLeft="onleft" :lists="list" :titles="['aaa','bbb']" @onRight="onright" style="width:100%;"></admin-transfer>
  </div>
</template>

<script>
  import adminTransfer from "@/components/transfer.vue"
  export default {
    name: 'home',
    data() {
      function makeList() {
        var arr = [];
        for (var i = 0; i < 100; i++) {
          arr.push({
            key: i,
            label: i,
            parent: i % 2 == 0 ? "left" : "right"
          })
        }
        return arr;
      }
      return {
        list: makeList()
      }
    },
    components: { adminTransfer },
    methods: {
      onleft(items, next) {
        console.log(items);
        setTimeout(() => {
          next(true);
        }, 1000)
      },
      onright(items, next) {
        console.log(items);
        setTimeout(() => {
          next(true);
        }, 1000)
      }
    }
  }
</script>