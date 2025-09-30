const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'config.env') });

const { OpenAI } = require('openai');

// Use OpenAI v5 client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_SECRET });

exports.summary = async (req, res) => {
  const { text } = req.body;

  try {
    // call the chat completions endpoint with the v5 SDK
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes text.' },
        { role: 'user', content: `Summarize the following text in a concise manner:\n\n${text}` },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    // response.choices[0].message.content contains the assistant reply
    const summary = (response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content)
      ? response.choices[0].message.content.trim()
      : '';

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Error summarizing text:', error);
    // Handle OpenAI rate/quota errors gracefully
    const status = error && (error.status || (error.error && error.error.status)) ? (error.status || error.error.status) : null;
    const code = error && (error.code || (error.error && error.error.code)) ? (error.code || error.error.code) : null;

    // If quota / rate limit, return 429 and optionally a fallback summary
    if (status === 429 || code === 'insufficient_quota' || code === 'rate_limit_exceeded') {
      // Optional simple fallback: return first 2 sentences if OPENAI_FALLBACK env is true
      if (process.env.OPENAI_FALLBACK === 'true') {
        const sentences = (text || '').split(/(?<=[.!?])\s+/).filter(Boolean);
        const fallback = sentences.slice(0, 2).join(' ') || (text || '').slice(0, 200);
        return res.status(200).json({ summary: fallback, fallback: true, message: 'OpenAI quota exceeded — returned fallback summary.' });
      }
      return res.status(429).json({ message: 'OpenAI quota exceeded or rate limit reached. Please check your plan/billing or try again later.' });
    }

    return res.status(500).json({ message: error.message || 'OpenAI request failed' });
  }
};
