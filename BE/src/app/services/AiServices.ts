import { PrismaClient } from "@prisma/client";
import { createGeminiChain } from "../../utils/langchainClient";

const prisma = new PrismaClient();
const chain = createGeminiChain();

// Cache for product search results
const searchCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get base URL from environment variable or use default
const BASE_URL = "http://localhost:3000";

const AiServices = {
  chat: async (message: string) => {
    try {
      const cleanMessage = message.trim().toLowerCase();
      const keywords = cleanMessage.split(/\s+/).filter((kw) => kw.length > 1);

      const limitedKeywords = keywords.slice(0, 5);

      const cacheKey = limitedKeywords.join("_");
      const cachedResult = searchCache.get(cacheKey);
      if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
        return { reply: cachedResult.reply };
      }

      const products = await prisma.products.findMany({
        where: {
          AND: [
            {
              OR: limitedKeywords.map((kw) => ({
                OR: [
                  { productName: { contains: kw } },
                  { productDes: { contains: kw } },
                ],
              })),
            },
            { status: "active" },
          ],
        },
        include: {
          Categories: true,
          Shop: true,
        },
        take: 5,
      });

      let input = "";

      if (products.length > 0) {
        const productContext = products
          .map((p, i) => {
            const productLink = `${BASE_URL}/productdetail/${p.productId}`;
            return `${i + 1}. [${p.productName}](${productLink})\n${
              p.productDes
            }\nGiá: ${p.price}đ\nDanh mục: ${
              p.Categories.categoryName
            }\nCửa hàng: ${p.Shop.shopName}`;
          })
          .join("\n\n");

        input = `Bạn là trợ lý thương mại điện tử chuyên nghiệp. Dưới đây là danh sách sản phẩm phù hợp:\n\n${productContext}\n\nCâu hỏi của người dùng: "${message}"\n\nHãy trả lời một cách thân thiện, chuyên nghiệp và hữu ích. Nếu có sản phẩm phù hợp, hãy giới thiệu chi tiết về sản phẩm đó và nhắc người dùng có thể click vào tên sản phẩm để xem thêm thông tin chi tiết.`;
      } else {
        input = `Bạn là trợ lý thương mại điện tử chuyên nghiệp. Câu hỏi của người dùng: "${message}". Hãy trả lời một cách thân thiện và hữu ích, giải thích rằng hiện tại chưa có sản phẩm phù hợp và đề xuất một số sản phẩm tương tự hoặc hướng dẫn người dùng tìm kiếm khác.`;
      }

      const reply = await chain.invoke({ input });

      searchCache.set(cacheKey, {
        reply,
        timestamp: Date.now(),
      });

      return { reply };
    } catch (error) {
      console.error("Error in AI chat service:", error);
      return {
        reply:
          "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.",
      };
    }
  },
};

export default AiServices;
