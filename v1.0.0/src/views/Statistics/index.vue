<template>
  <div class="Statistics">
    <div class="Statistics-tit"></div>
    <div class="Statistics-content">
      <div class="content">
        <div v-for="(item,index) in listData" :key="index">
          <div class="title">
            <p class="clearfix">
              <span class="teacher fontsize-lg float-left">{{item.account}}的班课</span>
              <span class="color-9 fontsize-sm float-right">{{item.list.length}} 个班课</span>
            </p>
          </div>
          <Thumbnail :items="item.list" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Thumbnail from "../component/thumbnail";
export default {
  name: "",
  components: {
    Thumbnail
  },
  data() {
    return {
      listData: [],
    };
  },
  mounted() {
    this.getAllUser({});
  },
  methods: {
    getAllUser(data) {
      this.$http
        .post("/api/admin/bankequery", data)
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.data.data.length) {
              this.listData = res.data.data.users;
              console.log(res);
              for (let v = 0; v < this.listData.length; v++) {
                this.listData[v].list = [];
                for (let i = 0; i < res.data.data.data.length; i++) {
                  if (this.listData[v].id == res.data.data.data[i].userid) {
                    res.data.data.data[i].teacherName=this.listData[v].account
                    this.listData[v].list.push(res.data.data.data[i]);
                    
                  }
                }
              }
              // this.listData[0].list=this.listData[0].list.splice(0,2);
              // this.listData[1].list=[]
              console.log("userquery", this.listData);
              this.$message({
                type: "success",
                message: "加载成功"
              });
            } else {
              this.$message({
                type: "info",
                message: "暂无数据"
              });
            }
          }
        })
        .catch(res => {
          console.log("res");
          this.$message({
            type: "error",
            message: "error"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.Statistics {
  padding: 20px;
  .Statistics-content {
    .content {
      >div{
       
      }
      .title {
        height: 35px;
        line-height: 35px;
        .teacher {
          float: left;
        }
      }
      .my-thumbnail {
        margin-top: 10px;
        padding: 15px 0;
        border-top: 1px solid #e5e5e5;
      }
    }
  }
}
</style>
