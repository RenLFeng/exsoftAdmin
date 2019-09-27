<template>
  <div>
    <allBanke v-if="state" @bankeUser="onBankeUser"/>
    <bankeUser v-if="!state" @bankeUser="onBankeUser" :id="id" />
  </div>
</template>
<script>
import allBanke from "./allBanke";
import bankeUser from "./bankeUser";
export default {
  name: "",
  components: {
    allBanke,
    bankeUser
  },
  data() {
    return {
      state:true,
      id:'',
    };
  },
  created() {},
  methods: {
    onBankeUser(data){
      this.state=data.state
      this.id=data.row.userid
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
