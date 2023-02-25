import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const res = await db.collection("questions").get();
  console.log(res);
  return res;
}
