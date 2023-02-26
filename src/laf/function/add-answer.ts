import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const data = ctx.body;
  data.qID = data._id;
  delete data._id;

  const res = await db.collection("answer").add(data);
  return res;
}
