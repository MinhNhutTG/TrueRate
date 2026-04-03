const { getGroq } = require("../config/grog.config");
const { quickSpamCheck } = require("../utils/validation-review.util"); // ← thêm ở đây (đầu file)

const moderateReview = async (req, res, next) => {
  console.log("flag1")
   const { content, rating } = req.body;  // ← đổi comment → content, bỏ title
  
  if (!content) return next(); 
  console.log("Received review:", { content, rating });
  if (!content) return next();

  const textToCheck = [content].filter(Boolean).join(" ");

  // ← Kiểm tra spam nhanh TRƯỚC khi gọi Groq API
  const quickCheck = quickSpamCheck(textToCheck);
  if (quickCheck.isSpam) {
    return res.status(400).json({
      success: false,
      message: quickCheck.reason,
      category: "spam",
    });
  }
  console.log("flag2")

  try {
    const chatCompletion = await getGroq().chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `Bạn là hệ thống kiểm duyệt nội dung review sản phẩm.
              Phân tích nội dung và trả về JSON với format:
              {
                "approved": true/false,
                "reason": "lý do nếu bị từ chối",
                "category": "spam|offensive|fake|clean"
              }
              Từ chối khi:
              - Nội dung tục tĩu, xúc phạm, kỳ thị
              - Spam (lặp ký tự, vô nghĩa, quảng cáo không liên quan)
              - Review giả mạo rõ ràng (toàn chữ hoa, ký tự lạ)
              - Ngôn ngữ thù ghét
              Chỉ trả về JSON, không giải thích thêm.`,
        },
        {
          role: "user",
          content: `Kiểm duyệt review sau: "${textToCheck}"`,
        },
      ],
      temperature: 0.1,
      max_tokens: 150,
    });

    const responseText = chatCompletion.choices[0]?.message?.content?.trim();
    console.log("Groq moderation response:", responseText);
   
    let modResult;
    try {
      modResult = JSON.parse(responseText);
    } catch {
      return next();
    }

    if (!modResult.approved) {
      return res.status(400).json({
        success: false,
        message: `Review bị từ chối: ${modResult.reason}`,
        category: modResult.category,
      });
    }

    req.reviewCategory = modResult.category;
    next();
  } catch (error) {
    console.error("Groq moderation error:", error.message);
    next();
  }
};

module.exports = { moderateReview };