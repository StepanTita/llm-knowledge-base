import type {PineconeRecord} from "@pinecone-database/pinecone";
import type {TextMetadata} from "./types.ts";
import {env, Pipeline} from "@xenova/transformers";
import {v4 as uuidv4} from "uuid";

env.allowLocalModels = false;

class Embedder {
    private pipe: Pipeline | null = null;

    // Initialize the pipeline
    async init() {
        const {pipeline} = await import('@xenova/transformers');
        this.pipe = await pipeline('feature-extraction', 'Xenova/bert-base-cased', {revision: 'default'});
    }

    // Embed a single string
    async embed(text: string): Promise<PineconeRecord<TextMetadata>> {
        const result = this.pipe && (await this.pipe(text, {pooling: 'mean', normalize: true}));
        return {
            id: uuidv4(),
            metadata: {
                text: text,
            },
            values: Array.from(result.data),
        };
    }
}

const embedder = new Embedder();

export {embedder};