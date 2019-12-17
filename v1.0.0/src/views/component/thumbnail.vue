<template>
  <div class="my-thumbnail">
    <el-row :gutter="20">
      <div v-for="(v,i) in items" :key="i" class="item">
        <el-col :lg="6" :md="8" :sm="8" :xs="12" class="item-col" @click.native="onclick(v)">
          <div class="item-warp">
            <img class="item-img" :src="v.avatar" alt="..."  :onerror="$defaultImg('banke')"/>
            <div class="caption">
              <h3 class="calss-type fontsize-md ellipsis">{{v.name}}</h3>
              <p class="teacher-name fontsize-md">教师:{{v.teacherName}}</p>
              <p class="members fontsize-sm color-9">成员人数:{{v.membernum}} 人</p>
            </div>
          </div>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    items: {
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },

  methods: {
    onclick(v) {
      console.log(v);
      this.$router.push({ name: "ClassStatistics", params: { classInfo: v } });
      //  this.$router.push({ path: "/ClassStatistics", query: { classInfo: v} });
      this.$store.commit("SET_CLASS_ID", v.id);
    }
  }
};
</script>

<style lang='scss' scoped>
.my-thumbnail {
  padding: 20px 0;
  .item {
    text-align: left;
    .item-col {
      height: 430px;
      .item-warp {
        width: 100%;
        height: 100%;
        border: 1px solid #c7c5c5;
        box-shadow: 0 3px 8px #c7c5c5;
        .item-img {
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 304px;
        }
      }
      .caption {
        * {
          margin: 10px 0;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
<style scoped>
@media screen and (max-width: 500px) {
  
  .item-col {
    width: 100%;
  }
}
</style>
