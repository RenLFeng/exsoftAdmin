<template>
  <div>
    <a class="download-content" :href="href" download>
      <img v-if="src" class="tabel-img" :src="src" alt />
      <p style="color:#000">{{filename}}</p>
      <i class="iconfont iconxiazai download"></i>
    </a>
  </div>
</template>

<script>
export default {
  name: "",
  props: ["href", "src", "filename"],
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang='stylus' rel='stylesheet/stylus'></style>
