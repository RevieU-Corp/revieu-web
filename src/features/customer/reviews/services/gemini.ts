import { GoogleGenerativeAI } from "@google/generative-ai";
import { BusinessCategory } from "../types";

const genAI = new GoogleGenerativeAI('AIzaSyDCInZ57xrv6hpYu-oGqPfm0wa8zEHYYBM');

export interface AIAssistRequest {
    overallRating: number;
    detailedRatings?: {
        quality: number;
        environment: number;
        service: number;
    }
    businessCategory: BusinessCategory;
    currentText?: string;
    merchantName?: string;
}
export interface AIAssistResponse {
    suggestions: string[];
    fullReview?: string;
    error?: string;
}

//生成提示词
const generatePrompt = (request: AIAssistRequest): string => {
    const { overallRating, detailedRatings, businessCategory, currentText, merchantName } = request;

    let prompt = `You are a helpful assistant that helps users write authentic and detailed reviews.

Context:
- Business type: ${businessCategory}
- Overall rating: ${overallRating}/5 stars
- Business name: ${merchantName || 'this business'}`;

    if (detailedRatings) {
        prompt += `
- Quality rating: ${detailedRatings.quality}/5
- Environment rating: ${detailedRatings.environment}/5
- Service rating: ${detailedRatings.service}/5`;
    }

    if (currentText) {
        prompt += `
- Current review text: "${currentText}"

IMPORTANT: Please improve and expand on the current review text provided above. The user's text should be the primary focus - use it to understand what type of business or product they are actually reviewing, regardless of the business category setting.`;
    } else {
        prompt += `

Please generate original review suggestions based on the business type and ratings.`;
    }

    prompt += `

Please generate 3 different review suggestions that:
1. ${currentText ? 'Build upon and improve the current review text - focus on the actual subject matter mentioned in the user\'s text' : 'Match the given ratings authentically'}
2. Are specific and detailed (15-50 words each)
3. Sound natural and personal
4. ${currentText ? 'Stay true to the topic and sentiment expressed in the current text' : 'Include specific aspects like taste, atmosphere, service quality'}
5. Are appropriate for the rating level (${overallRating} stars)
6. ${currentText ? 'Enhance and expand the ideas from the current text while maintaining its core meaning' : 'Focus on the business category and ratings provided'}

Format your response as exactly 3 suggestions, one per line, without numbering or bullets.`;

    return prompt;
}
export const generateReviewSuggestions = async (request: AIAssistRequest): Promise<AIAssistResponse> => {
    try {
        const apiKey = 'AIzaSyDCInZ57xrv6hpYu-oGqPfm0wa8zEHYYBM';

        if (!apiKey || apiKey.trim() === '') {
            throw new Error('Gemini API key is not configured');
        }

        // 调用模型 - 使用最新的稳定模型 gemini-2.5-flash
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        // 生成提示词
        const prompt = generatePrompt(request);
        // 调用 AI生成评论
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        //解析响应 为建议数组

        const suggestions = text.split('\n').map((line: string) => line.trim())
            .filter((line: string) => line.length > 0).slice(0, 3);
        return {
            suggestions,
            fullReview: suggestions[0],
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);

        // 返回错误信息
        return {
            suggestions: [],
            error: error instanceof Error ? error.message : 'Failed to generate suggestions',
        };
    }
};
// 流式生成评论（用于实时显示）
export const generateReviewStream = async (
    request: AIAssistRequest,
    onChunk: (chunk: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: string) => void
): Promise<void> => {
    try {
        // 使用API密钥
        const apiKey = 'AIzaSyDCInZ57xrv6hpYu-oGqPfm0wa8zEHYYBM';
        if (!apiKey || apiKey.trim() === '') {
            throw new Error('Gemini API key is not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = generatePrompt(request);

        // 生成流式内容
        const result = await model.generateContentStream(prompt);
        let fullText = '';

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            onChunk(chunkText);
        }

        onComplete(fullText);

    } catch (error) {
        console.error('Gemini AI Stream Error:', error);
        onError(error instanceof Error ? error.message : 'Failed to generate review');
    }
};
// 验证API是否合法
export const validateGeminiAPI = async (): Promise<boolean> => {
    try {
        const apiKey = 'AIzaSyDCInZ57xrv6hpYu-oGqPfm0wa8zEHYYBM';
        if (!apiKey || apiKey.trim() === '') {
            return false;
        }
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Hello');
        await result.response;

        return true; // 添加这个返回语句
    } catch (error) {
        console.error('API validation failed:', error);
        return false;
    }
}