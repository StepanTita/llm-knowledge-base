import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
    dangerouslyAllowBrowser: true,
});

function generateReplyGPT(context: string, prompt: string) {
    return openai.beta.chat.completions.stream({
        model: 'gpt-3.5-turbo-16k',
        messages: [{
            role: 'user',
            content: `This is a context that you need to use to provide your answer: ${context}.\nQuestion: ${prompt}`
        }],
        stream: true,
    });
}

export default generateReplyGPT;