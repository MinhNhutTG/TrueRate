// utils/validation-review.util.js — thêm vào file hiện có

const SPAM_PATTERNS = [
  /(.)\1{4,}/,           // lặp ký tự: aaaaa
  /^[^a-zA-ZÀ-ỹ0-9]+$/, // toàn ký tự đặc biệt
];

const quickSpamCheck = (text) => {
  if (!text || text.trim().length < 5) {
    return { isSpam: true, reason: "Nội dung quá ngắn" };
  }
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      return { isSpam: true, reason: "Phát hiện spam pattern" };
    }
  }
  return { isSpam: false };
};

module.exports = { quickSpamCheck };