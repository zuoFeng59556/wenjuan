<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Cloud } from "laf-client-sdk";

const data = ref({});

const cloud = new Cloud({
  baseUrl: "http://t9a12z.dev.laf.run", // 这里的pcsw70需要换成自己的APPID
  getAccessToken: () => "", // 这里暂时用不到先为空
});

getData();
async function getData() {
  const res = await cloud.invoke("get-qustion");
  console.log(res);
  data.value = res.data;
}

async function submit() {
  if (!check()) return;
  const res = await cloud.invoke("save-answer", data.value);
  if (res.ok) ElMessage.success("提交成功");
}

function check() {
  let isOK = true;

  data.value.questions.some((item, index) => {
    if (item.necessary && typeof item.answer === "string" && !item.answer) {
      isOK = false;
      ElMessage.error("请填写" + data.value.questions[index].questionName);
      return true;
    }

    if (item.necessary && typeof item.answer === "object") {
      let temp = true;
      item.answer.forEach((an) => {
        if (an.isOption) {
          temp = false;
        }
      });

      if (temp) {
        isOK = false;
        ElMessage.error("请选择" + data.value.questions[index].questionName);
        return true;
      }
    }
  });

  return isOK;
}
</script>

<template>
  <div class="content">
    <div class="title">{{ data.title }}</div>
    <div class="detail">{{ data.text }}</div>

    <div class="questionBox" v-for="(item, index) in data.questions">
      <div class="input" v-if="item.type === 'input'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span
          >{{ index + 1 + "." + item.questionName }}
        </div>
        <el-input v-model="item.answer" placeholder="请输入" />
      </div>

      <div class="checkbox" v-if="item.type === 'checkbox'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span>
          {{ index + 1 + "." + item.questionName }}
        </div>
        <div class="option" v-for="op in item.answer">
          <el-checkbox v-model="op.isOption" :label="op.name" size="large" />
        </div>
      </div>
    </div>

    <div class="button">
      <el-button type="primary" size="large" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<style scoped>
@media screen and (min-width: 760px) and (max-width: 5000px) {
  .content {
    box-sizing: border-box;
    margin: 30px auto;
    padding: 60px 30px 20px 30px;
    max-width: 760px;
    background-color: #fff;
  }
}

@media screen and (min-width: 0px) and (max-width: 760px) {
  .content {
    box-sizing: border-box;
    padding: 60px 30px 20px 30px;
    max-width: 760px;
    background-color: #fff;
  }
}
.title {
  text-align: center;
  color: #333;
  font-size: 22px;
  font-weight: 500;
}

.detail {
  margin: 20px 0 0 0;
  color: #666;
  font-size: 14px;
}
.input {
  margin: 20px 0 0 0;
}
.checkbox {
  margin: 20px 0 0 0;
}
.question {
  margin: 0 0 10px 0;
}
:deep().el-checkbox__label {
  word-break: normal;
  width: auto;
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
.button {
  display: flex;
  margin: 30px 0 0px 0;
  justify-content: center;
}
</style>
