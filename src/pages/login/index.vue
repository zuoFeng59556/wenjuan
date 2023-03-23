<template>
  <div>
    <!-- 登陆表单 -->
    <el-form ref="loginFormRef" label-width="80px" class="login-form">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="username" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="password" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";
import { cloud } from "../../laf/index";
import { union } from "lodash";

const loginFormRef = ref(null);
const username = ref("");
const password = ref("");

async function login() {
  if (username.value === "" || password.value === "") {
    return ElMessage.error("用户名或密码不能为空");
  }

  const res = await cloud.invoke("login", {
    username: username.value,
    password: password.value,
  });

  if (!res.ok) {
    return ElMessage.error("账号或密码错误");
  }

  uni.navigateTo({
    url: "/pages/index/laf",
  });
}
</script>

<style scoped>
.login-form {
  width: 400px;
  margin: 100px auto;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-form .el-button {
  width: 100%;
}
</style>
