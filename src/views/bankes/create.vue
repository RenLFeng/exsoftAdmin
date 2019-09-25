<template>
  <div>
    <!-- /// -->
    <!-- <el-dialog :title="openFormStateText" :visible.sync="dialogFormVisible"> -->
      <el-form
        :rules="rules"
        ref="dataForm"
        :model="rowData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="ID:" prop="account">
          <el-input v-model="rowData.account" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="rowData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="role">
          <el-select v-model="rowData.role" placeholder="请选择">
            <el-option v-for="v in roleType" :key="v.role" :label="v.label" :value="v.role"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input placeholder="请输入密码" v-model="rowData.password" show-password></el-input>
          <!-- <el-date-picker v-model="rowData.password" type="datetime" placeholder="Please pick a date" /> -->
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {roleType } from '@/common.js';
export default {
  name: "",
  props: {
    rowData: {
      default() {
        return {
          account: "",
          name: "",
          role: "",
          password: ""
        };
      }
    }
  },
  data() {
    return {
           roleType: roleType,
       rules: {
        account: [{ required: true, message: "请输入账户名", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        role: [
          { required: true, message: "请至少选择一个角色", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
    };
  },

  methods: {}
};
</script>

<style lang='stylus' rel='stylesheet/stylus'></style>
