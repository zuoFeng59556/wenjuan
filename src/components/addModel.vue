<script setup>
import { ref, watch, reactive, watchEffect } from "vue";
import { ElMessage } from "element-plus";

// ===============================data===============================
const name = ref("");
const type = ref("");
const showOption = ref(false);
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
const optionList = ref([{ name: "" }]);
const necessary = ref(false);

const selectName = ref("");
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
    console.log("里面接收的", val);
    name.value = val.questionName;
    type.value = val.type;
    selectName.value = val.type;
    necessary.value = val.necessary;
    if (val.type === "checkbox" || val.type === "Radio") {
      optionList.value = JSON.parse(JSON.stringify(val.answer));
      showOption.value = true;
    } else {
      optionList.value = [];
      showOption.value = false;
    }
  },
  {
    immediate: true,
  }
);
// ===============================function===============================
function selectChange(val) {
  type.value = val;
  showOption.value = false;
  if (val === "checkbox" || val === "Radio") showOption.value = true;
}

function addOption() {
  console.log(props.data.answer);

  optionList.value.push({ name: "" });
  console.log(props.data.answer);
}

function delOption(index) {
  optionList.value.splice(index, 1);
}

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

  name.value = "";
  type.value = "";
  necessary.value = false;
  optionList.value = [{ name: "" }];
  selectName.value = "";
}

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

function cancel() {
  emits("cancel");
  if (props.data) {
    // 如果是编辑状态，取消就恢复原来的数据
    name.value = props.data.questionName;
    type.value = props.data.type;
    selectName.value = props.data.type;
    necessary.value = props.data.necessary;
    console.log("props.data", props.data.answer);
    if (props.data.type === "checkbox" || props.data.type === "Radio") {
      optionList.value = JSON.parse(JSON.stringify(props.data.answer));
      showOption.value = true;
    } else {
      optionList.value = [];
      showOption.value = false;
    }
    return;
  }

  // 清空数据
  name.value = "";
  type.value = "";
  necessary.value = false;
  optionList.value = [{ name: "" }];
  selectName.value = "";
}
</script>

<template>
  <div class="addModel">
    <div class="itemName">问题名字</div>
    <el-input class="input" v-model="name" placeholder="输入名字" />
    <div class="itemName">问题类型</div>
    <el-select v-model="selectName" @change="selectChange" placeholder="选择类型">
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
