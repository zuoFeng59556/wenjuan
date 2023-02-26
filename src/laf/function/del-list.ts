import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const { id } = ctx.body;
  const res = await db
    .collection("questions")
    .where({ _id: id })
    .update({ delflag: "1" });
  return res;
}
