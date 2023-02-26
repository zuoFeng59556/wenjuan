import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const { id } = ctx.body;
  // const id = "63f98b3a4691970f3a447988"

  const question = await db
    .collection("questions")
    .where({ _id: id, delflag: "0" })
    .getOne();
  const answer = await db
    .collection("answer")
    .where({ qID: id, delflag: "0" })
    .get();

  const res = { question: {}, answer: [] };
  res.question = question.data;
  res.answer = answer.data;

  return res;
}
