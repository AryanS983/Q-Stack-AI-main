const Question = require('../models/Question');
const Session = require('../models/Session');

//@desc Add additional question to an existing session
//@route POST /api/questions/add
//@access Private (Requires token)
const addQuestionsToSession = async (req, res) => {
    try {
        const { sessionId, questions } = req.body;

        if (!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        
        //create questions method 1
        
        // const questionDocs = await Promise.all(
        //     questions.map(async (q) => {
        //         const question = await Question.create({
        //             session: session._id,
        //             question: q.question,
        //             answer: q.answer,
        //             note: q.note,
        //         });
        //         return question._id;
        //     })
        // );
        // session.questions = session.questions.concat(questionDocs);
        // await session.save();
        
        
        //create questions method 2
        const createdQuestions = await Question.insertMany(
            questions.map((q) => ({
                session: session._id,
                question: q.question,
                answer: q.answer,
                note: q.note
        })))

        //Update session with new questions method 1
        // session.questions = session.questions.concat(newQuestions.map(q => q._id));
        // await session.save();
            

        //Update session with new questions method 2 using spread operator

        session.questions.push(...createdQuestions.map(q => q._id));
        await session.save();
            
        
        res.status(200).json({ success: true, message: 'Questions added to session successfully', createdQuestions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

//@desc Pin or unpin a question in a session
//@route POST /api/questions/:id/pin
//@access Private (Requires token)
const togglePinQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        question.isPinned = !question.isPinned; 
        await question.save();
        res.status(200).json({ success: true, message: 'Question pinned status updated successfully', question });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


//@desc update a note for a question
//@route POST /api/questions/:id/note
//@access Private (Requires token)
const updateQuestionNote = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        question.note = req.body.note || '';
        await question.save();
        res.status(200).json({ success: true, message: 'Question note updated successfully', question });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = { addQuestionsToSession, togglePinQuestion, updateQuestionNote };
