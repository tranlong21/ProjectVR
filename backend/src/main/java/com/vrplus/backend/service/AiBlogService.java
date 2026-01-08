package com.vrplus.backend.service;

import com.vrplus.backend.payload.request.AiGenerateBlogRequest;
import org.springframework.stereotype.Service;

@Service
public class AiBlogService {

    private final OllamaClient ollamaClient;

    public AiBlogService(OllamaClient ollamaClient) {
        this.ollamaClient = ollamaClient;
    }

    public String generateBlog(AiGenerateBlogRequest request) {

        int minWords = request.getMinWords() != null ? request.getMinWords() : 600;
        int maxWords = request.getMaxWords() != null ? request.getMaxWords() : 800;
        String audience = request.getAudience() != null
                ? request.getAudience()
                : "kỹ sư xây dựng, sinh viên kỹ thuật";
        boolean returnHtml = request.getReturnHtml() == null || request.getReturnHtml();

        String prompt = """
          Bạn là một chuyên gia trong lĩnh vực xây dựng và quản lý dự án.
                                      
          Hãy viết nội dung bài blog TIẾNG VIỆT với thông tin sau:
          - Tiêu đề: %s
          - Chủ đề: %s
          - Đối tượng độc giả: %s
          - Độ dài: từ %d đến %d từ
          
          Yêu cầu quan trọng về ĐỊNH DẠNG (bắt buộc tuân thủ):
          - CHỈ trả về phần NỘI DUNG HIỂN THỊ (visual content)
          - KHÔNG bao gồm <!DOCTYPE>, <html>, <head>, <body>
          - KHÔNG dùng markdown
          - KHÔNG dùng ``` hoặc ```html
          - Mỗi thành phần hiển thị phải được chuyển đúng sang thẻ HTML tương ứng
          
          Quy ước chuyển visual → HTML:
          - Tiêu đề chính → <h1>
          - Tiêu đề mục lớn → <h2>
          - Tiêu đề mục nhỏ → <h3>
          - Đoạn văn → <p>
          - Danh sách → <ul><li>
          - Chữ nhấn mạnh → <strong>
          
          Ví dụ:
          Nếu hiển thị là:
          Tiêu đề: Xin chào
          Thì kết quả phải là:
          <h1>Xin chào</h1>
          
          Chỉ trả về HTML theo quy ước trên, không thêm bất kỳ giải thích nào.
        """.formatted(
                request.getTitle(),
                request.getTopic(),
                audience,
                minWords,
                maxWords,
                returnHtml
                        ? "Trả về kết quả DƯỚI DẠNG HTML (sử dụng <h2>, <h3>, <p>, <ul>)"
                        : "Trả về kết quả DƯỚI DẠNG TEXT THUẦN"
        );

        return ollamaClient.generate(prompt);
    }
}
