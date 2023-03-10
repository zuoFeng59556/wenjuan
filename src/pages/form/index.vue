<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { ElMessage } from "element-plus";
import { cloud } from "../../laf/index.js";

// ===============================data===============================
const data = ref({});
const id = ref("");

// ===============================methods===============================
onLoad((option) => {
  id.value = option.id;
  getData();
});

// 获取表单数据
async function getData() {
  const res = await cloud.invoke("get-data", { id: id.value });
  data.value = res.question;
  data.value.questions.forEach((item) => {
    // 给下拉框回显用
    item.selectValue = "";
  });
}

// 提交
async function submit() {
  if (!check()) return;

  data.value.questions.forEach((item) => {
    // 删除无用数据
    delete item.selectValue;
  });

  const res = await cloud.invoke("add-answer", data.value);
  if (res.ok) ElMessage.success("提交成功");
}

// 校验
function check() {
  let isOK = true;

  data.value.questions.some((item, index) => {
    if (item.necessary && typeof item.answer === "string" && !item.answer) {
      isOK = false;
      ElMessage.error("请填写" + data.value.questions[index].questionName);
      return true; // return true 会跳出循环
    }

    if (item.necessary && typeof item.answer === "object") {
      let temp = true; // 用来判断是否有选中的选项
      item.answer.forEach((an) => {
        if (an.isOption) {
          temp = false;
        }
      });

      if (temp) {
        isOK = false;
        ElMessage.error("请选择" + data.value.questions[index].questionName);
        return true; // return true 会跳出循环
      }
    }
  });

  return isOK;
}

function RadioChange(index, opIndex) {
  data.value.questions[index].answer.forEach((item, ItemIndex) => {
    if (ItemIndex === opIndex) {
      item.isOption = true;
    } else {
      item.isOption = false;
    }
  });
}

// 下拉框选中
function selectChange(index, opIndex) {
  data.value.questions[index].answer.forEach((item, ItemIndex) => {
    if (ItemIndex === opIndex) {
      item.isOption = true;
    } else {
      item.isOption = false;
    }
  });
}
</script>

<template>
  <div class="content">
    <div class="title">{{ data.title }}</div>
    <div class="detail">{{ data.text }}</div>

    <div class="questionBox" v-for="(item, index) in data.questions">
      <!-- 输入框 -->
      <div class="input" v-if="item.type === 'input'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span
          >{{ index + 1 + "." + item.questionName }}
        </div>
        <el-input v-model="item.answer" placeholder="请输入" />
      </div>

      <!-- 文本域 -->
      <div class="input" v-if="item.type === 'textarea'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span
          >{{ index + 1 + "." + item.questionName }}
        </div>
        <el-input v-model="item.answer" :rows="5" type="textarea" placeholder="请输入" />
      </div>

      <!-- 多选 -->
      <div class="checkbox" v-if="item.type === 'checkbox'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span>
          {{ index + 1 + "." + item.questionName }}
        </div>
        <div class="option" v-for="op in item.answer">
          <el-checkbox v-model="op.isOption" :label="op.name" size="large" />
        </div>
      </div>

      <!-- 单选 -->
      <div class="checkbox" v-if="item.type === 'radio'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span>
          {{ index + 1 + "." + item.questionName }}
        </div>
        <div class="option" v-for="(op, opIndex) in item.answer">
          <el-checkbox
            @change="RadioChange(index, opIndex)"
            v-model="op.isOption"
            :label="op.name"
            size="large"
          />
        </div>
      </div>

      <!-- 下拉框 -->
      <div class="checkbox" v-if="item.type === 'select'">
        <div class="question">
          <span v-if="item.necessary" style="color: #ff6d56">*</span>
          {{ index + 1 + "." + item.questionName }}
        </div>

        <el-select v-model="item.selectValue" placeholder="请选择">
          <el-option
            v-for="(op, opIndex) in item.answer"
            @click="selectChange(index, opIndex)"
            :key="op.name"
            :label="op.name"
            :value="op.name"
          />
        </el-select>

        <!-- <div class="option" v-for="op in item.answer">
          <el-checkbox v-model="op.isOption" :label="op.name" size="large" />
        </div> -->
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
