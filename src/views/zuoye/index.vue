<template>
  <div>
    <allZuoye v-if="state" @zuoyeSubmit="onzuoyeSubmit"/>
    <allSubmit v-if="!state" @zuoyeSubmit="onzuoyeSubmit" :id="id" />
  </div>
</template>

<script>
import allZuoye from "./allZuoye";
import allSubmit from "./allSubmit";
export default {
  name: "",
  components: {
    allZuoye,
    allSubmit
  },
  data() {
    return {
      state: true,
      id: ""
    };
  },
  created() {},
  methods: {
    onzuoyeSubmit(data) {
      this.state = data.state;
      this.id = data.row.id;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
