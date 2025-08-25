const Session = require("../models/Session");
const Question = require("../models/Question");

//@desc Create a new session and linked questions
//@route POST /api/sessions/create
//@access Private (Requires token)
const createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description, questions } =
      req.body;
    const userId = req.user._id; //protect middleware will set req.user

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
          note: q.note,
        })
        return question._id;
      })
    );

    session.questions = questionDocs
    await session.save()


    res.status(201).json({
      success: true,
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

//@desc Get all sessions with populated questions
//@route GET /api/sessions/my-sessions
//@access Private (Requires token)
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).sort({
      createdAt: -1,
    }).populate('questions');
    res.status(200).json(sessions);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};


//@desc Get session by id with populated questions
//@route GET /api/sessions/:id
//@access Private (Requires token)
const getSessionByID = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate({
        path: 'questions',
        options: { sort: {isPinned: -1, createdAt: -1} }
    });
    if(!session){
        return res.status(404).json({success: false, message: 'Session not found'})
    }

    res.status(200).json(session);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};


//@desc Delete session by id
//@route DELETE /api/sessions/:id
//@access Private (Requires token)
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if(!session){
        return res.status(404).json({success: false, message: 'Session not found'})
    }
    if(session.user.toString() !== req.user.id){
        return res.status(401).json({success: false, message: 'Unauthorized'})
    }

    await Question.deleteMany({session: session._id})

    await session.deleteOne();
    res.status(200).json({success: true, message: 'Session deleted successfully'})
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createSession,
  getSessionByID,
  getMySessions,
  deleteSession,
};
