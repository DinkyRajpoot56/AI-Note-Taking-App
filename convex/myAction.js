"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import {api} from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
        args.splitText,
        args.fileId,
      ["Hello world", "Bye bye", "What's this?"],
      [{ prop: 2 }, { prop: 1 }, { prop: 3 }],
       new GoogleGenerativeAIEmbeddings({
        apikey:'AIzaSyDov1XoL3YAuOd8MhuK8Z7Twzb37vQo4Kk',
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
}),
{ctx}

    );
    return 'Completed..'
  },
});
export const search = action({
  args: {
    query: v.string(),
    fileId:v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(new OpenAIEmbeddings(), { ctx });
    new GoogleGenerativeAIEmbeddings({
        apikey:'AIzaSyDov1XoL3YAuOd8MhuK8Z7Twzb37vQo4Kk',
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

    const resultOne = await (await vectorStore.similaritySearch(args.query, 1)).filter(q=>q.metadata.fileId==file.args);
    console.log(resultOne);
    return JSON.stringify(resultOne);
  },
});