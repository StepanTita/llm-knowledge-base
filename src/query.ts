import {embedder} from "@/src/embedder.ts";
import {Pinecone} from "@pinecone-database/pinecone";
import type {TextMetadata} from "./types.js";

const PINECONE_INDEX = 'history-knowledgebase';

export const query = async (query?: string, topK?: number) => {
    if (!query || !topK) return null;

    const apiKey = process.env['NEXT_PUBLIC_PINECONE_API_KEY'];
    const env = process.env['NEXT_PUBLIC_PINECONE_ENVIRONMENT'];

    const pinecone = new Pinecone({apiKey: apiKey || '', environment: env || ''});

    // Target the index
    const index = pinecone.index<TextMetadata>(PINECONE_INDEX);

    await embedder.init();

    // Embed the query
    const queryEmbedding = await embedder.embed(query);

    console.log(queryEmbedding.values);

    // Query the index using the query embedding
    const results = await index.query({
        vector: queryEmbedding.values.slice(0, 768),
        topK,
        includeMetadata: true,
        includeValues: false
    });

    return results.matches?.map((match) => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        request: match.metadata?.text,
        response: match.metadata?.response,
        score: match.score,
    }))
};