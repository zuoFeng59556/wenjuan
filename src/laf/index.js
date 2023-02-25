import { Cloud } from "laf-client-sdk"; // 引入laf

// 创建cloud对象
export const cloud = new Cloud({
  baseUrl: "http://w6pjr0.preview.laf.run", // 这里的pcsw70需要换成自己的APPID
  getAccessToken: () => '', // 这里暂时用不到先为空
});