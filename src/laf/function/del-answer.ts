import cloud from "@lafjs/cloud";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const { index, id } = ctx.body;
  const { data } = await db.collection("answer").where({ qID: id }).get();
  data.forEach(async (item) => {
    const id = item._id;
    delete item._id;

    item.questions.splice(index, 1);
    const res = await db.collection("answer").where({ _id: id }).update(item);
    console.log(res);
  });
}
