<script setup>
import { ref } from "vue";
import addModel from "../../components/addModel.vue";

// ===============================data===============================
const showAddModel = ref(false);
const AData = ref([
  {
    title: "sealos 商务咨询",
    text:
      "sealos 是一个基于 kubernetes 内核的云操作系统，我们提供企业级产品与服务，欢迎咨询，填写下面表单我们将与您联系！",
    questions: [
      {
        questionName: "姓名",
        type: "input",
        answer: "王大锤",
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
            isOption: true,
          },
        ],
        necessary: true,
      },
    ],
  },
  {
    title: "sealos 商务咨询",
    text:
      "sealos 是一个基于 kubernetes 内核的云操作系统，我们提供企业级产品与服务，欢迎咨询，填写下面表单我们将与您联系！",
    questions: [
      {
        questionName: "姓名",
        type: "input",
        answer: "王小锤",
        necessary: true,
      },
      {
        questionName: "对 sealos 的需求是？",
        type: "checkbox",
        answer: [
          {
            name: "在公有云上使用 sealos",
            isOption: true,
          },
          {
            name: "希望私有化输出，私有化部署",
            isOption: false,
          },
        ],
        necessary: true,
      },
    ],
  },
]);

const QData = ref({
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
      ],
      necessary: true,
    },
  ],
});

// ===============================function===============================

function filterAnswer(answer, type) {
  if (type === "input") return answer;
  if (type === "checkbox") {
    const tempList = answer.filter((item) => {
      return item.isOption;
    });
    return tempList;
  }
}

function addQuestion() {
  showAddModel.value = true;
}

function ok(obj) {
  QData.value.questions.push(obj);
  showAddModel.value = false;
}

function cancel() {
  showAddModel.value = false;
}
</script>

<template>
  <div style="display: flex">
    <addModel v-show="showAddModel" @ok="ok" @cancel="cancel" />

    <div class="left">
      <div class="left-item">表单的名字</div>
      <div class="add-item">+添加一个表单</div>
    </div>

    <uni-table
      style="width: 80%; margin: 8% 0 0 5%"
      border
      stripe
      emptyText="暂无更多数据"
    >
      <!-- 表头行 -->
      <uni-tr>
        <uni-th v-for="item in QData.questions" align="center">
          {{ item.questionName }}
        </uni-th>
        <uni-th align="center">
          <img class="addImg" @click="addQuestion" src="../../static/add.png" alt="" />
        </uni-th>
      </uni-tr>
      <!-- 表格数据行 -->
      <uni-tr v-for="item in AData">
        <uni-td v-for="QItem in item.questions">
          <div v-if="QItem.type === 'input'">
            {{ filterAnswer(QItem.answer, QItem.type) }}
          </div>
          <div
            v-if="QItem.type === 'checkbox'"
            v-for="AItem in filterAnswer(QItem.answer, QItem.type)"
          >
            {{ AItem.name }}
          </div>
        </uni-td>
      </uni-tr>
    </uni-table>
  </div>
</template>

<style lang="less">
.left {
  width: 150px;
  height: 100vh;
  background-color: #fff;
  .left-item {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
  }
  .add-item {
    font-size: 13px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
    color: #909399;
  }
}
.addModel {
  position: absolute;
  left: 700px;
  top: 50px;
  z-index: 99;
  width: 336px;
  background: #fff;
  box-shadow: 5px 5px 10px #888888;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 4px;
}
.addImg {
  width: 34px;
  height: 34px;
  cursor: pointer;
}
</style>
