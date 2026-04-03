// config/grog.config.js
const Groq = require("groq-sdk");

let groqInstance = null;

const getGroq = () => {
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
};

module.exports = { getGroq };