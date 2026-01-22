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
                        - Chủ đề: %s
                        - Đối tượng độc giả: %s
                        - Độ dài: từ %d đến %d từ
                        
                        QUY ĐỊNH NGÔN NGỮ (bắt buộc):
                        - Toàn bộ nội dung PHẢI viết bằng TIẾNG VIỆT
                        - TUYỆT ĐỐI KHÔNG sử dụng tiếng Trung, tiếng Anh hoặc bất kỳ ngôn ngữ nào khác
                        - Nội dung phải đạt mức 100%% TIẾNG VIỆT
                        - Nếu phát hiện từ hoặc câu không phải tiếng Việt, phải tự sửa trước khi kết thúc
                        
                        YÊU CẦU QUAN TRỌNG VỀ ĐỊNH DẠNG (bắt buộc tuân thủ):
                        - CHỈ trả về phần NỘI DUNG HIỂN THỊ (visual content)
                        - KHÔNG bao gồm <!DOCTYPE>, <html>, <head>, <body>
                        - KHÔNG dùng markdown
                        - KHÔNG dùng ``` hoặc ```html
                        - KHÔNG tạo tiêu đề chính (<h1>)
                        - Nội dung phải BẮT ĐẦU trực tiếp từ phần thân bài
                        
                        QUY ƯỚC CHUYỂN VISUAL → HTML:
                        - Tiêu đề mục lớn → <h2>
                        - Tiêu đề mục nhỏ → <h3>
                        - Đoạn văn → <p>
                        - Danh sách → <ul><li>
                        - Chữ nhấn mạnh → <strong>
                        
                        YÊU CẦU CHÈN ẢNH (placeholder):
                        - Ảnh CHỈ là placeholder dạng text: <ảnh>
                        - KHÔNG dùng thẻ <img>
                        - KHÔNG mô tả ảnh, KHÔNG ghi chú thích
                        
                        QUY TẮC XÁC ĐỊNH SỐ LƯỢNG ẢNH (AI phải tự suy luận):
                        - Dưới 400 từ → chèn CHÍNH XÁC 1 <ảnh>
                        - Từ 400 đến dưới 800 từ → chèn CHÍNH XÁC 2 <ảnh>
                        - Từ 800 từ trở lên → chèn CHÍNH XÁC 3 <ảnh>
                        - Trường hợp người dùng yêu cầu khoảng độ dài (ví dụ 700–1000 từ),
                          AI phải tự suy luận số lượng ảnh phù hợp theo quy tắc trên
                        - KHÔNG hỏi lại người dùng
                        - KHÔNG chèn thừa hoặc thiếu ảnh
                        
                        QUY TẮC VỊ TRÍ CHÈN ẢNH:
                        - Chỉ chèn <ảnh> tại vị trí hợp lý:
                          + Ngay sau thẻ <h2>, HOẶC
                          + Sau 1–2 đoạn <p> đầu tiên của một mục lớn
                        - KHÔNG chèn <ảnh> liên tiếp
                        - KHÔNG chèn <ảnh> bên trong <ul> hoặc <li>
                        - KHÔNG chèn <ảnh> ở đầu hoặc cuối toàn bài
                        
                        YÊU CẦU KIỂM TRA TRƯỚC KHI KẾT THÚC:
                        - Tự kiểm tra lại:
                          + Không có <h1>
                          + Số lượng <ảnh> đúng theo độ dài bài viết
                          + Nội dung 100%% TIẾNG VIỆT
                        
                        Chỉ trả về HTML theo toàn bộ quy ước trên.
                        KHÔNG thêm bất kỳ giải thích hay nội dung nào khác.
                """.formatted(
                request.getTopic(),
                audience,
                minWords,
                maxWords
        );


        return ollamaClient.generate(prompt);
    }
}
