<script setup>
import { ref, watch } from "vue";
import { cloud } from "../laf/index.js";
import { Delete } from "@element-plus/icons-vue";

// ===============================data===============================
const list = ref([]); // 左侧菜单列表
const currentId = ref(""); // 当前选中的表单id
const emits = defineEmits(["changeId"]);

const dialogTableVisible = ref(false); // 新建表单弹窗
const questionName = ref(""); // 表单标题
const textarea = ref(""); // 表单简介

const props = defineProps({
  currentName: {
    type: String,
    default: "",
  },
});

// ===============================watch===============================
watch(
  () => props.currentName,
  (val) => {
    list.value.forEach((item) => {
      if (item._id === currentId.value) {
        item.title = val;
      }
    });
  }
);
// ===============================methods===============================
getList(false);

// 获取表单列表
async function getList(isEnd) {
  const res = await cloud.invoke("get-list");
  list.value = res.data;

  if (list.value.length > 0 && !isEnd) {
    currentId.value = list.value[0]._id;
    emits("changeId", list.value[0]._id);
  }

  if (list.value.length > 0 && isEnd) {
    currentId.value = list.value[list.value.length - 1]._id;
    emits("changeId", list.value[list.value.length - 1]._id);
  }
}

// 选中左侧菜单
function changeCurrentId(id) {
  currentId.value = id;
  emits("changeId", id);
}

// 新建表单
async function ok() {
  const obj = {
    title: questionName.value,
    text: textarea.value,
    questions: [],
  };

  const res = await cloud.invoke("add-list", obj);
  if (res.ok) {
    getList(true);
  }

  dialogTableVisible.value = false;
  questionName.value = "";
  textarea.value = "";
}

//
function cancel() {
  dialogTableVisible.value = false;
  questionName.value = "";
  textarea.value = "";
}

async function delQuestion() {
  await cloud.invoke("del-list", { id: currentId.value });
  getList(false);
}
</script>

<template>
  <div class="left">
    <div
      @click="changeCurrentId(item._id)"
      :class="[currentId === item._id ? 'left-item-active' : 'left-item']"
      v-for="item in list"
    >
      <span>
        {{ item.title }}
      </span>
      <el-popconfirm @confirm="delQuestion" title="确定删除此表单?">
        <template #reference>
          <el-button class="delButton" type="danger" :icon="Delete" size="small" circle />
        </template>
      </el-popconfirm>
    </div>
    <div class="add-item" @click="dialogTableVisible = true">+添加一个表单</div>

    <el-dialog v-model="dialogTableVisible" title="新建表单">
      <div class="title">标题</div>
      <el-input v-model="questionName" placeholder="请输入标题" />
      <div class="text">简介</div>
      <el-input v-model="textarea" :rows="2" type="textarea" placeholder="请输入简介" />
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less">
.left {
  min-width: 180px;
  height: 100vh;
  background-color: #fff;
  .nameText {
    width: 200px;
  }
  .left-item {
    text-align: center;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    .delButton {
      float: right;
      margin-top: 10px;
    }
  }
  .left-item:hover {
    background-color: #f5f5f5;
  }
  .left-item-active {
    text-align: center;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    color: #409eff;
    .delButton {
      float: right;
      margin-top: 10px;
    }
  }
  .add-item {
    text-align: center;
    font-size: 13px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    font-weight: bold;
    color: #909399;
  }

  .title {
    margin: 0 0 10px 0;
  }
  .text {
    margin: 10px 0 10px 0;
  }
  .dialog-footer {
    margin: 10px 0 0 0;
  }
}
</style>
