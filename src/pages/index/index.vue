<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
// import { Cloud } from "laf-client-sdk";

// const data = ref({});

// const cloud = new Cloud({
//   baseUrl: "http://t9a12z.dev.laf.run",
//   getAccessToken: () => "",
// });

// getData();
// async function getData() {
//   const res = await cloud.invoke("get-qustion");
//   console.log(res);
//   data.value = res.data;
// }

// async function submit() {
//   if (!check()) return;
//   const res = await cloud.invoke("save-answer", data.value);
//   if (res.ok) ElMessage.success("提交成功");
// }

// function check() {
//   let isOK = true;

//   data.value.questions.some((item, index) => {
//     if (item.necessary && typeof item.answer === "string" && !item.answer) {
//       isOK = false;
//       ElMessage.error("请填写" + data.value.questions[index].questionName);
//       return true;
//     }

//     if (item.necessary && typeof item.answer === "object") {
//       let temp = true;
//       item.answer.forEach((an) => {
//         if (an.isOption) {
//           temp = false;
//         }
//       });

//       if (temp) {
//         isOK = false;
//         ElMessage.error("请选择" + data.value.questions[index].questionName);
//         return true;
//       }
//     }
//   });

//   return isOK;
// }

function submit() {}
const data = ref({
  title: "sealos 商务咨询",
  text:
    "sealos 是一个基于 kubernetes 内核的云操作系统，我们提供企业级产品与服务，欢迎咨询，填写下面表单我们将与您联系！",
  questions: [
    {
      questionName: "姓名",
      type: "input",
      answer: "",
      necessary: true,
    },
    {
      questionName: "公司名称和官网",
      type: "input",
      answer: "",
      necessary: true,
    },
    {
      questionName: "部门和职位",
      type: "input",
      answer: "",
      necessary: true,
    },
    {
      questionName: "手机",
      type: "input",
      answer: "",
      necessary: true,
    },
    {
      questionName: "邮箱",
      type: "input",
      answer: "",
      necessary: true,
    },
    {
      questionName: "对 sealos 的需求是？",
      type: "checkbox",
      answer: [
        {
          name: "在公有云上使用 sealos",
          isOption: false,
        },
        {
          name: "希望私有化输出，私有化部署",
          isOption: false,
        },
        {
          name: "希望定制化开发",
          isOption: false,
        },
        {
          name: "希望进一步了解产品",
          isOption: false,
        },
        {
          name: "其他",
          isOption: false,
        },
      ],
      necessary: true,
    },
    {
      questionName: "您最关心 sealos 的特性是？",
      type: "checkbox",
      answer: [
        {
          name: "简单，很轻一键即可到处运行, 对离线交付支持友好.",
          isOption: false,
        },
        {
          name: "开放，完全开源，不用厂商绑定.",
          isOption: false,
        },
        {
          name: "便宜，sealos 机房托管版本比公有云便宜 80% 以上",
          isOption: false,
        },
        {
          name: "丰富，很多集群镜像可以一键安装一键使用. ",
          isOption: false,
        },
        {
          name: "其他",
          isOption: false,
        },
      ],
      necessary: true,
    },
    {
      questionName: "其他想对我们说的？",
      type: "input",
      answer: "",
      necessary: false,
    },
  ],
});
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
