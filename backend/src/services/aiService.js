const getFallbackResponse = (message, context) => {
  // Simple rule-based fallback if no AI key is provided
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hint')) {
    return "Hint: Review the sender's address, check for urgent language, and inspect any links or IP addresses before making a decision.";
  }
  
  if (lowerMsg.includes('phishing')) {
    return "Phishing often involves spoofed domains and urgent language. Check the sender domain carefully.";
  }
  
  if (lowerMsg.includes('network') || lowerMsg.includes('alert')) {
    return "Network alerts indicate suspicious activity like multiple failed logins or unusual ports. Investigate the source IP.";
  }
  
  if (lowerMsg.includes('malware')) {
    return "Malware can hide in unexpected file extensions or missing digital signatures. Quarantine suspicious files.";
  }

  return "I am operating in fallback mode because no AI provider is configured. I can offer basic hints about phishing, network alerts, and malware.";
};

const generateAIResponse = async (message, context) => {
  if (!process.env.AI_API_KEY) {
    return getFallbackResponse(message, context);
  }

  try {
    // Example using OpenAI API
    const prompt = `
You are an educational cybersecurity AI assistant for the CyberShield platform.
You must NOT perform real attacks, write exploits, or help compromise systems.
Provide guidance and explanations for this simulated scenario.

Context:
Simulation Type: ${context.simulationType || 'None'}
Evidence/Mission ID: ${context.missionId || 'None'}

User Message:
${message}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error.response ? error.response.data : error.message);
    return getFallbackResponse(message, context); // Fallback on error
  }
};

module.exports = {
  generateAIResponse
};
