import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const id = ctx.body.id;
  delete ctx.body.id;

  const data = ctx.body;
  const res = await db.collection("questions").where({ _id: id }).update(data);
  return res;
}
