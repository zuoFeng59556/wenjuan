<script setup>
import { ref } from "vue";
import addModel from "../../components/addModel.vue";
import menuList from "../../components/menuList.vue";
import { cloud } from "../../laf/index.js";

// ===============================data===============================
const QData = ref({}); // 问题列表
const AData = ref([]); // 答案列表
const showAddModel = ref(false); // 添加问题弹窗
const dialogTableVisible = ref(false); // 编辑表单弹窗
const tempTitle = ref(""); // 编辑表单标题
const tempText = ref(""); // 编辑表单简介
const addModelData = ref({}); // 添加和编辑问题 弹窗数据
const currentEditIndex = ref(); // 当前编辑的问题索引
const addModelTitle = ref("添加问题"); // 添加问题弹窗标题

// ===============================methods===============================

// 获取表单数据
async function getDataById(id) {
  const res = await cloud.invoke("get-data", { id });
  QData.value = res.question;
  QData.value.id = QData.value._id;
  delete QData.value._id;

  AData.value = res.answer;
  AData.value.forEach((item) => {
    item.id = item._id;
    delete item._id;
  });
}

// 过滤答案
function filterAnswer(answer, type) {
  if (type === "input") return answer;
  if (type === "checkbox") {
    const tempList = answer.filter((item) => {
      return item.isOption;
    });
    return tempList;
  }
}

// 打开添加问题面板
function addQuestion() {
  addModelTitle.value = "添加问题";
  showAddModel.value = true;
  addModelData.value = {};
}

// 添加问题
async function okAddQuestion(obj) {
  if (addModelTitle.value === "添加问题") {
    QData.value.questions.push(obj);
  } else {
    QData.value.questions[currentEditIndex.value] = obj;
  }
  showAddModel.value = false;
  await cloud.invoke("edit-question", QData.value);
  getDataById(QData.value.id);
}

// 取消添加问题
function cancelAddQuestion() {
  showAddModel.value = false;
}

// 打开编辑表单面板
function edit() {
  dialogTableVisible.value = true;
  tempTitle.value = QData.value.title;
  tempText.value = QData.value.text;
}

// 取消编辑表单
function cancelEdit() {
  dialogTableVisible.value = false;
  tempTitle.value = "";
  tempText.value = "";
}

// 编辑表单提交
async function okEdit() {
  QData.value.title = tempTitle.value;
  QData.value.text = tempText.value;

  await cloud.invoke("edit-question", QData.value);
  getDataById(QData.value.id);

  dialogTableVisible.value = false;
  tempTitle.value = "";
  tempText.value = "";
}

// 编辑问题
function editQuestion(index) {
  currentEditIndex.value = index;
  addModelData.value = QData.value.questions[index];

  addModelTitle.value = "编辑问题";
  showAddModel.value = true;
}

// 删除问题 以及 答案
async function delQuestion(index) {
  console.log(AData.value);
  QData.value.questions.splice(index, 1);
  await cloud.invoke("edit-question", QData.value);

  AData.value.forEach((item) => {
    item.questions.splice(index, 1);
  });
  await cloud.invoke("del-answer", { index, id: QData.value.id });
}

function preview() {
  uni.navigateTo({
    url: "/pages/form/index?id=" + QData.value.id,
  });
}
</script>

<template>
  <div style="display: flex">
    <menuList @changeId="getDataById" :current-name="QData.title" />

    <div class="tableBox">
      <div class="titleBox">
        <div class="title">{{ QData.title }}</div>
        <el-button class="editButton" @click="edit" type="primary" round size="small"
          >编辑</el-button
        >

        <el-button class="editButton" @click="preview" type="success" round size="small"
          >预览</el-button
        >
      </div>
      <div class="text">{{ QData.text }}</div>

      <uni-table style="width: 100%" border stripe emptyText="暂无更多数据">
        <!-- 表头行 -->
        <uni-tr>
          <uni-th
            v-for="(item, index) in QData.questions"
            align="center"
            style="cursor: pointer"
          >
            <div>{{ item.questionName }}</div>
            <div style="padding: 0 0 0 30px">
              <div
                style="font-size: 12px; font-weight: 500; color: #409eff"
                @click="editQuestion(index)"
              >
                编辑
              </div>
              <el-popconfirm @confirm="delQuestion(index)" title="确定删除此问题?">
                <template #reference>
                  <div style="font-size: 12px; font-weight: 500; color: #f56c6c">
                    删除
                  </div>
                </template>
              </el-popconfirm>
            </div>
          </uni-th>

          <uni-th align="center">
            <el-button @click="addQuestion" type="primary" round size="small"
              >+添加</el-button
            >
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

    <!--  编辑表单名字和简介 -->
    <el-dialog v-model="dialogTableVisible" title="编辑">
      <div class="dialog-title">标题</div>
      <el-input v-model="tempTitle" placeholder="请输入标题" />
      <div class="dialog-text">简介</div>
      <el-input v-model="tempText" :rows="2" type="textarea" placeholder="请输入简介" />
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="okEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="20%" v-model="showAddModel" :title="addModelTitle">
      <addModel
        v-show="showAddModel"
        @ok="okAddQuestion"
        @cancel="cancelAddQuestion"
        :data="addModelData"
      />
    </el-dialog>
  </div>
</template>

<style lang="less">
.tableBox {
  width: 80%;
  margin: 5% 0 0 5%;
  .titleBox {
    display: flex;
    justify-content: center;
    .title {
      text-align: center;
      color: #333;
      font-size: 22px;
      font-weight: 500;
    }
    .editButton {
      margin-left: 20px;
    }
  }
  .text {
    margin: 20px 0 20px 0;
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}

.dialog-title {
  margin: 0 0 10px 0;
}
.dialog-text {
  margin: 10px 0 10px 0;
}
.dialog-footer {
  margin: 10px 0 0 0;
}
</style>
