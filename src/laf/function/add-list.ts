import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const data = ctx.body;
  data.delflag = "0";
  const res = await db.collection("questions").add(data);
  return res;
}
