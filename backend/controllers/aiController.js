const {GoogleGenAI} = require('@google/genai');
const {  questionAnswerPrompt,conceptExplainPrompt } = require('../utils/prompts');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


//@desc Generate interview questions and answers using Gemini
//@route POST /api/ai/generate-questions
//@access Private (Requires token)
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: prompt,
        });
        const reqText = response.text;
        const cleanedText = reqText
        .replace(/^```json\s*/, "")  //remove starting ```json
        .replace(/```$/, "")     //removes ending ```
        .trim();   //remove extra spaces

        //Now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate Questions', error: error.message });
    }
}


//@desc Explans an Interview Question
//@route POST /api/ai/generate-explanation
//@access Private (Requires token)
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const prompt = conceptExplainPrompt(question);
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: prompt,
        })
        const reqText = response.text;
        const cleanedText = reqText
        .replace(/^```json\s*/, "")  //remove starting ```json
        .replace(/```$/, "")     //removes ending ```
        .trim();   //remove extra spaces

        //Now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate Explanation', error: error.message });
    }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation };