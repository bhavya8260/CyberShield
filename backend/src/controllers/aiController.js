const { generateAIResponse } = require('../services/aiService');

// @desc    Chat with AI Assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      res.status(400);
      return next(new Error('Message is required'));
    }

    // Safety checks on context: ensure no sensitive data is passed
    const safeContext = {
      simulationType: context?.simulationType,
      missionId: context?.missionId,
      evidenceId: context?.evidenceId
    };

    const aiResponse = await generateAIResponse(message, safeContext);

    res.status(200).json({
      success: true,
      data: {
        reply: aiResponse
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithAI
};
