import { Cloud } from "laf-client-sdk"; // 引入laf

// 创建cloud对象
export const cloud = new Cloud({
  baseUrl: "https://x85clg.laf.dev", // 这里的pcsw70需要换成自己的APPID
  getAccessToken: () => '', // 这里暂时用不到先为空
});