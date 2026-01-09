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
                
                YÊU CẦU CHÈN ẢNH (bắt buộc tuân thủ):
                - Toàn bài viết chèn từ 2 đến 4 ảnh, tùy theo độ dài
                - Ảnh chỉ được thể hiện bằng placeholder dạng text:
                  <ảnh 1>, <ảnh 2>, <ảnh 3>, <ảnh 4>
                - KHÔNG dùng thẻ <img>
                - KHÔNG mô tả ảnh, KHÔNG ghi chú thích
                - Chỉ chèn ảnh tại vị trí hợp lý:
                  + Ngay sau <h2>, hoặc
                  + Sau 1–2 đoạn <p> đầu tiên của một mục lớn
                - KHÔNG chèn ảnh liên tiếp
                - KHÔNG chèn ảnh bên trong <ul> hoặc <li>
                
                Ví dụ hợp lệ:
                <h2>Lợi ích của AI trong xây dựng</h2>
                <ảnh 1>
                <p>AI giúp tối ưu tiến độ...</p>
                
                Ví dụ KHÔNG hợp lệ:
                <p>AI giúp tối ưu tiến độ...</p>
                <img src="...">
                
                Chỉ trả về HTML theo toàn bộ quy ước trên.
                KHÔNG thêm bất kỳ giải thích hay nội dung nào khác.
                """.formatted(
                request.getTitle(),
                request.getTopic(),
                audience,
                minWords,
                maxWords
        );


        return ollamaClient.generate(prompt);
    }
}
