<script setup>
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";

// ===============================data===============================
const name = ref(""); // 问题名
const type = ref(""); // 问题类型
const showOption = ref(false); // 是否显示选项
const optionList = ref([{ name: "" }]); // 选项列表
const necessary = ref(false); // 是否必填
const selectType = ref(""); // 选中的问题类型
const options = [
  {
    value: "input",
    label: "输入框",
  },
  {
    value: "checkbox",
    label: "多选",
  },
  {
    value: "Radio",
    label: "单选",
  },
];

const emits = defineEmits(["ok", "cancel"]);
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

// ===============================watch===============================
watch(
  () => props.data,
  (val) => {
    if (val.questionName) {
      initData();
    } else {
      clearData();
    }
  },
  {
    immediate: true,
  }
);
// ===============================function===============================

// 初始化数据
function initData() {
  console.log("chufalo");
  name.value = props.data.questionName;
  type.value = props.data.type;
  selectType.value = props.data.type;
  necessary.value = props.data.necessary;
  if (props.data.type === "checkbox" || props.data.type === "Radio") {
    optionList.value = JSON.parse(JSON.stringify(props.data.answer));
    showOption.value = true;
  } else {
    optionList.value = [];
    showOption.value = false;
  }
}

// 清空数据
function clearData() {
  name.value = "";
  type.value = "";
  necessary.value = false;
  optionList.value = [{ name: "" }];
  selectType.value = "";
  showOption.value = false;
}

// 确定添加
function ok() {
  if (!check()) return;

  const obj = {};
  obj.questionName = name.value;
  obj.type = type.value;
  obj.necessary = necessary.value;
  if (obj.type === "checkbox" || obj.type === "Radio") {
    optionList.value.forEach((item) => {
      item.isOption = false;
    });
    obj.answer = optionList.value;
  }

  emits("ok", obj);

  clearData();
}

// 校验
function check() {
  if (!name.value) {
    ElMessage.error("请输入问题名");
    return false;
  }
  if (!type.value) {
    ElMessage.error("请选择问题类型");
    return false;
  }
  if (type.value === "checkbox" || type.value === "Radio") {
    if (!optionList.value[0]?.name) {
      ElMessage.error("至少提供一个选项");
      return false;
    }
  }
  return true;
}

// 取消
function cancel() {
  emits("cancel");

  // 如果是编辑状态，取消就恢复原来的数据
  if (props.data) {
    initData();
    return;
  }

  // 如果是新增状态，取消就清空数据
  clearData();
}

// 选择问题类型
function selectChange(val) {
  type.value = val;
  showOption.value = false;
  if (val === "checkbox" || val === "Radio") showOption.value = true;
}

// 添加选项
function addOption() {
  optionList.value.push({ name: "" });
}

// 删除选项
function delOption(index) {
  optionList.value.splice(index, 1);
}
</script>

<template>
  <div class="addModel">
    <div class="itemName">问题名字</div>
    <el-input class="input" v-model="name" placeholder="输入名字" />
    <div class="itemName">问题类型</div>
    <el-select v-model="selectType" @change="selectChange" placeholder="选择类型">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="optionList" v-for="(item, index) in optionList" v-show="showOption">
      <el-input v-model="optionList[index].name" placeholder="输入选项" />
      <img class="delImg" @click="delOption(index)" src="../static/delete.png" alt="" />
    </div>
    <div class="add-option" v-show="showOption" @click="addOption">+添加一个选项</div>

    <div>
      <el-checkbox v-model="necessary" label="是否为必填项" size="large" />
    </div>
    <el-button @click="cancel">取消</el-button>
    <el-button @click="ok" type="primary">确定</el-button>
  </div>
</template>

<style>
.itemName {
  font-size: 14px;
  font-weight: bold;
  color: #909399;
  margin: 5px 0 5px 0;
}
.add-option {
  margin: 10px 0 0 60%;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
}
.optionList {
  display: flex;
  margin: 10px 0 0 0;
}
.delImg {
  margin: 5px 0 0 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
