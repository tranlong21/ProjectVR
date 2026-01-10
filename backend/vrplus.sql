-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 09, 2026 lúc 10:02 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `vrplus`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blog_images`
--

CREATE TABLE `blog_images` (
  `id` bigint(20) NOT NULL,
  `url` varchar(255) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `usage_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blog_images`
--

INSERT INTO `blog_images` (`id`, `url`, `alt_text`, `created_at`, `usage_type`) VALUES
(1, '/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png', 'bg1.png', '2026-01-08 02:41:43', 'CONTENT'),
(2, '/uploads/blog/content/1886d505-e355-4a09-acb9-48c8051baa3f.png', 'bg3.png', '2026-01-08 02:56:51', 'CONTENT');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) NOT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `content_vi` mediumtext DEFAULT NULL,
  `content_en` mediumtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title_vi`, `title_en`, `slug`, `thumbnail_url`, `content_vi`, `content_en`, `created_at`, `updated_at`) VALUES
(14, 'VR Plus là gì? 7 ứng dụng thực tế giúp doanh nghiệp giảm chi phí và tăng trải nghiệm', 'VR Plus là gì? 7 ứng dụng thực tế giúp doanh nghiệp giảm chi phí và tăng trải nghiệm', 'vr-plus-la-gi-7-ung-dung-thuc-te-giup-doanh-nghiep-giam-chi-phi-va-tang-trai-nghiem', '/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png', '<h1>VR Plus là gì? 7 ứng dụng thực tế giúp doanh nghiệp giảm chi phí và tăng trải nghiệm</h1>\n<p><strong>VR Plus</strong> là một công nghệ tiên tiến sử dụngReality (VR) để tạo ra môi trường tương tác chân thật, bao gồm tour 360°, mô hình 3D và bản đồ. Công nghệ này không chỉ mang lại trải nghiệm độc đáo cho người dùng mà còn hỗ trợ doanh nghiệp giảm chi phí và nâng cao hiệu quả hoạt động.</p>\n<h2><span style=\"color: rgb(215, 40, 40);\">Giá trị thực tế của VR Plus</span></h2>\n<p><strong>VR Plus</strong> giúp doanh nghiệp:</p>\n<ul>\n<li>Hạn chế chi phí đi lại và tiếp xúc vật lý</li>\n<li>Nâng cao trải nghiệm khách hàng thông qua mô hình tương tác 3D</li>\n<li>Tăng cường khả năng thuyết trình và đào tạo nhân viên</li>\n<li>Giảm thời gian xây dựng dự án nhờ mô phỏng trước</li>\n</ul>\n<h2>Ứng dụng theo ngành của VR Plus</h2>\n<p><strong>VR Plus</strong> có nhiều ứng dụng trong các lĩnh vực khác nhau, bao gồm:</p>\n<ul>\n<li><strong>Bất động sản:</strong> Giới thiệu dự án qua mô hình 3D, tăng độ hấp dẫn cho khách hàng</li>\n<li><strong>Giáo dục:</strong> Tạo môi trường học tập tương tác, giúp hiểu các khái niệm phức tạp dễ dàng hơn</li>\n<li><strong>Du lịch:</strong> Xây dựng tour du lịch ảo, giới thiệu địa điểm mới mà không cần di chuyển</li>\n<li><strong>Nhà máy:</strong> Mô phỏng quy trình sản xuất trước khi xây dựng thực tế, giảm chi phí và rủi ro</li>\n</ul>\n<h2><img src=\"http://localhost:8096/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png\"></h2><h2>Quy trình triển khai VR Plus</h2>\n<p>Để triển khai <strong>VR Plus</strong>, doanh nghiệp cần tuân theo quy trình sau:</p>\n<ol>\n<li>Nắm bắt yêu cầu của dự án và xác định mục tiêu sử dụng công nghệ</li>\n<li>Lựa chọn nền tảng VR phù hợp cho dự án</li>\n<li>Sử dụng dữ liệu hiện có hoặc chuẩn bị dữ liệu mới để tạo mô hình 3D</li>\n<li>Thiết kế giao diện người dùng và trải nghiệm tương tác</li>\n<li>Kiểm thử và điều chỉnh cho đến khi hoàn thiện</li>\n</ol>\n<h2>Các bước chuẩn bị dữ liệu</h2>\n<p>Bạn cần thực hiện các bước sau để chuẩn bị dữ liệu:</p>\n<ul>\n<li>Lên kế hoạch chi tiết về nội dung cần mô phỏng trong VR</li>\n<li>Nhận tập tin hình ảnh, video hoặc bản đồ liên quan đến dự án</li>\n<li>Thực hiện quét 3D nếu cần thiết để tạo mô hình chính xác</li>\n<li>Hợp nhất các tài nguyên thành một bộ dữ liệu thống nhất</li>\n</ul>', '<h1>VR Plus là gì? 7 ứng dụng thực tế giúp doanh nghiệp giảm chi phí và tăng trải nghiệm</h1>\n<p><strong>VR Plus</strong> là một công nghệ tiên tiến sử dụngReality (VR) để tạo ra môi trường tương tác chân thật, bao gồm tour 360°, mô hình 3D và bản đồ. Công nghệ này không chỉ mang lại trải nghiệm độc đáo cho người dùng mà còn hỗ trợ doanh nghiệp giảm chi phí và nâng cao hiệu quả hoạt động.</p>\n<h2><span style=\"color: rgb(215, 40, 40);\">Giá trị thực tế của VR Plus</span></h2>\n<p><strong>VR Plus</strong> giúp doanh nghiệp:</p>\n<ul>\n<li>Hạn chế chi phí đi lại và tiếp xúc vật lý</li>\n<li>Nâng cao trải nghiệm khách hàng thông qua mô hình tương tác 3D</li>\n<li>Tăng cường khả năng thuyết trình và đào tạo nhân viên</li>\n<li>Giảm thời gian xây dựng dự án nhờ mô phỏng trước</li>\n</ul>\n<h2>Ứng dụng theo ngành của VR Plus</h2>\n<p><strong>VR Plus</strong> có nhiều ứng dụng trong các lĩnh vực khác nhau, bao gồm:</p>\n<ul>\n<li><strong>Bất động sản:</strong> Giới thiệu dự án qua mô hình 3D, tăng độ hấp dẫn cho khách hàng</li>\n<li><strong>Giáo dục:</strong> Tạo môi trường học tập tương tác, giúp hiểu các khái niệm phức tạp dễ dàng hơn</li>\n<li><strong>Du lịch:</strong> Xây dựng tour du lịch ảo, giới thiệu địa điểm mới mà không cần di chuyển</li>\n<li><strong>Nhà máy:</strong> Mô phỏng quy trình sản xuất trước khi xây dựng thực tế, giảm chi phí và rủi ro</li>\n</ul>\n<h2><img src=\"http://localhost:8096/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png\"></h2><h2>Quy trình triển khai VR Plus</h2>\n<p>Để triển khai <strong>VR Plus</strong>, doanh nghiệp cần tuân theo quy trình sau:</p>\n<ol>\n<li>Nắm bắt yêu cầu của dự án và xác định mục tiêu sử dụng công nghệ</li>\n<li>Lựa chọn nền tảng VR phù hợp cho dự án</li>\n<li>Sử dụng dữ liệu hiện có hoặc chuẩn bị dữ liệu mới để tạo mô hình 3D</li>\n<li>Thiết kế giao diện người dùng và trải nghiệm tương tác</li>\n<li>Kiểm thử và điều chỉnh cho đến khi hoàn thiện</li>\n</ol>\n<h2>Các bước chuẩn bị dữ liệu</h2>\n<p>Bạn cần thực hiện các bước sau để chuẩn bị dữ liệu:</p>\n<ul>\n<li>Lên kế hoạch chi tiết về nội dung cần mô phỏng trong VR</li>\n<li>Nhận tập tin hình ảnh, video hoặc bản đồ liên quan đến dự án</li>\n<li>Thực hiện quét 3D nếu cần thiết để tạo mô hình chính xác</li>\n<li>Hợp nhất các tài nguyên thành một bộ dữ liệu thống nhất</li>\n</ul>', '2026-01-08 10:35:47', '2026-01-08 10:36:46');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `name_vi` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `name_vi`, `name_en`, `slug`) VALUES
(1, 'Bất Động Sản', 'Real Estate', 'real-estate'),
(2, 'Du Lịch', 'Tourism', 'tourism'),
(3, 'Văn Hóa', 'Culture', 'culture'),
(4, 'Giáo Dục', 'Education', 'education'),
(5, 'Di Tích Lịch Sử', 'Historical Sites', 'historical_sites'),
(6, 'Công Nghệ', 'Technology', 'technology');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` bigint(20) NOT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `caption` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `project_id`, `url`, `caption`) VALUES
(2, 2, '/assets/images/virtual_showroom_project.png', 'Main View'),
(3, 3, '/assets/images/tourism_360_tour.png', 'Main View'),
(6, 6, '/assets/images/vr_hero_banner.png', 'Main View'),
(9, 11, '/assets/images/ar_marketing_demo.png', 'Main View'),
(10, 12, '/assets/images/ar_marketing_demo.png', 'Main View'),
(17, 2, '/assets/images/vr_hero_banner.png', 'Detail View'),
(18, 3, '/assets/images/vr_hero_banner.png', 'Detail View'),
(21, 6, '/assets/images/vr_hero_banner.png', 'Detail View'),
(24, 11, '/assets/images/vr_hero_banner.png', 'Detail View'),
(25, 12, '/assets/images/vr_hero_banner.png', 'Detail View'),
(29, 5, '/api/files/624fc1cc-4d92-4378-9c7a-85db541c3522_hue.jpg', 'ok');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotspots`
--

CREATE TABLE `hotspots` (
  `id` bigint(20) NOT NULL,
  `scene_id` bigint(20) DEFAULT NULL,
  `model_id` bigint(20) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `yaw` float NOT NULL DEFAULT 0,
  `pitch` float NOT NULL DEFAULT 0,
  `target_scene_id` bigint(20) DEFAULT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `description_vi` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `x` float DEFAULT 0,
  `y` float DEFAULT 0,
  `z` float DEFAULT 0,
  `camera_pos_x` float DEFAULT 0,
  `camera_pos_y` float DEFAULT 0,
  `camera_pos_z` float DEFAULT 0,
  `camera_target_x` float DEFAULT 0,
  `camera_target_y` float DEFAULT 0,
  `camera_target_z` float DEFAULT 0,
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra`)),
  `order_id` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hotspots`
--

INSERT INTO `hotspots` (`id`, `scene_id`, `model_id`, `type`, `yaw`, `pitch`, `target_scene_id`, `title_vi`, `title_en`, `description_vi`, `description_en`, `icon`, `x`, `y`, `z`, `camera_pos_x`, `camera_pos_y`, `camera_pos_z`, `camera_target_x`, `camera_target_y`, `camera_target_z`, `extra`, `order_id`) VALUES
(81, 22, NULL, 'link_scene', -162.48, 17.22, 23, '', '', '', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(82, 22, NULL, 'link_scene', 141.51, 18.96, 27, '', '', '', '', 'arrow_up', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(83, 23, NULL, 'info', 73.43, -6.46, NULL, 'Vòm thạch nhũ Thiên Cung', 'Thien Cung Stalactite Dome', 'Khu vực này nổi bật với hệ thống thạch nhũ hình vòm đồ sộ, được hình thành qua hàng triệu năm kiến tạo địa chất.\nÁnh sáng tự nhiên phản chiếu lên các lớp đá vôi tạo nên khung cảnh huyền ảo, đúng với tên gọi “Thiên Cung” – cung điện giữa lòng núi đá.', 'This area features a magnificent dome of stalactites formed over millions of years through geological processes.\nNatural light reflecting on the limestone layers creates a magical atmosphere, living up to the name “Thien Cung” – the Heavenly Palace inside the mountain.', 'info', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(84, 23, NULL, 'link_scene', 88.01, -18.64, 24, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(85, 23, NULL, 'link_scene', 104.27, -42.7, 25, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(86, 24, NULL, 'link_scene', 26.45, 21.09, 22, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(87, 24, NULL, 'link_scene', -82.31, -0.06, 26, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(88, 24, NULL, 'link_scene', 166.43, 14.43, 28, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(89, 22, NULL, 'link_scene', 63.41, 15.28, 30, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(90, 25, NULL, 'link_scene', 81.91, -1.23, 28, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(91, 25, NULL, 'link_scene', -118.09, -16.21, 29, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(92, 25, NULL, 'link_scene', -170.44, 12.09, 24, '', '', '', '', 'arrow_up', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(93, 26, NULL, 'link_scene', 48.83, -5.12, 22, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(94, 26, NULL, 'link_scene', -118.73, -3.06, 27, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(95, 27, NULL, 'link_scene', -111.85, 11.16, 28, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(96, 28, NULL, 'link_scene', 103.73, 21.03, 22, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(97, 29, NULL, 'link_scene', -15.52, 17.13, 24, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(98, 30, NULL, 'link_scene', -67.39, 16.88, 27, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(99, 30, NULL, 'link_scene', 108.19, 6.87, 22, '', '', '', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(100, NULL, 70, 'model', 0, 0, NULL, 'Đỉnh tháp', 'Tower top', NULL, NULL, NULL, 0.0630554, 6.08017, -0.0215917, 11.9208, 6.76455, -10.4337, 0, 1, 0, NULL, 1),
(101, NULL, 70, 'model', 0, 0, NULL, 'Toàn cảnh', 'Overview', NULL, NULL, NULL, -0.377422, -5.68113, 12.9227, -3.75031, 2.75718, 29.3474, 0, 1, 0, NULL, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `models_3d`
--

CREATE TABLE `models_3d` (
  `id` bigint(20) NOT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `format` varchar(50) DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `model_url` varchar(255) DEFAULT NULL,
  `preview_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `description_vi` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `raw_file_path` varchar(255) DEFAULT NULL,
  `status` enum('RAW_UPLOADED','PROCESSING','READY_FOR_WEB','FAILED') DEFAULT NULL,
  `web_file_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `models_3d`
--

INSERT INTO `models_3d` (`id`, `project_id`, `name`, `format`, `file_url`, `model_url`, `preview_image_url`, `created_at`, `category`, `description`, `description_vi`, `description_en`, `raw_file_path`, `status`, `web_file_path`) VALUES
(69, 2, 'Trần Văn Long', NULL, NULL, '/uploads/models/web/a4d164c2-fccf-4385-8424-8374974b9d4a_thapHUCE.glb', NULL, '2026-01-08 03:06:05', NULL, NULL, 'f', 'f', '/uploads/models/raw/a4d164c2-fccf-4385-8424-8374974b9d4a_thapHUCE.glb', 'READY_FOR_WEB', '/uploads/models/web/a4d164c2-fccf-4385-8424-8374974b9d4a_thapHUCE.glb'),
(70, 16, 'Tháp nước HUCE', NULL, NULL, '/uploads/models/web/5a10b713-56d8-4953-8787-1c3ccafa7443_thapHUCE.glb', NULL, '2026-01-09 03:15:59', NULL, NULL, 'Tháp nước HUCE là công trình kiến trúc – cảnh quan tiêu biểu trong khuôn viên Trường Đại học Xây dựng Hà Nội, được thiết kế theo hình khối kim tự tháp không gian kết hợp đài phun nước nghệ thuật. Công trình tạo điểm nhấn thị giác nổi bật và gắn liền với đời sống học tập, sinh hoạt của sinh viên HUCE.\r\n\r\nMô hình 3D này được xây dựng nhằm phục vụ mục đích học tập, trình diễn không gian kiến trúc và ứng dụng trong các hệ thống trực quan hóa, thực tế ảo (VR).', 'The HUCE Water Tower is a representative architectural and landscape landmark on the campus of Hanoi University of Civil Engineering, designed with a pyramid-shaped spatial structure combined with an artistic fountain system. It serves as a visual focal point and a familiar symbol of student life at HUCE.\r\n\r\nThis 3D model is created for educational purposes, architectural visualization, and virtual reality (VR) presentations.', '/uploads/models/raw/5a10b713-56d8-4953-8787-1c3ccafa7443_thapHUCE.glb', 'READY_FOR_WEB', '/uploads/models/web/5a10b713-56d8-4953-8787-1c3ccafa7443_thapHUCE.glb');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `detailed_description` text DEFAULT NULL,
  `description_vi` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `ai_description` text DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `has360` tinyint(1) DEFAULT 0,
  `has3d` tinyint(1) DEFAULT 0,
  `has_gallery` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `projects`
--

INSERT INTO `projects` (`id`, `title`, `title_vi`, `title_en`, `category_id`, `location`, `short_description`, `detailed_description`, `description_vi`, `description_en`, `ai_description`, `thumbnail_url`, `featured`, `has360`, `has3d`, `has_gallery`, `created_at`, `updated_at`) VALUES
(2, 'Luxury Apartment', 'Căn Hộ Cao Cấp', 'Luxury Apartment', 1, 'Hanoi', 'City center apartment.', '', 'Căn hộ trung tâm thành phố.', 'City center apartment.', NULL, '/uploads/projects/thumbnails/4c24e5fd-a47d-4bf8-a52a-740f744d6a45.jpg', 1, 0, 1, 1, '2025-11-26 07:53:15', '2025-12-16 19:46:50'),
(3, 'Ha Long Bay', 'Vịnh Hạ Long', 'Ha Long Bay', 2, 'Quang Ninh', 'Trải nghiệm Vịnh Hạ Long dưới góc nhìn 360°, nơi thiên nhiên hùng vĩ được tái hiện sống động trong không gian thực tế ảo.', '', 'Vịnh Hạ Long là một trong những kỳ quan thiên nhiên nổi bật nhất của Việt Nam và thế giới, được UNESCO công nhận là Di sản Thiên nhiên Thế giới. Dự án Vịnh Hạ Long VR mang đến một cách tiếp cận hoàn toàn mới: khám phá vẻ đẹp của vịnh thông qua không gian 360° tương tác, cho phép người xem “đứng giữa cảnh thật” thay vì chỉ quan sát qua hình ảnh tĩnh.\nThông qua công nghệ thực tế ảo, người dùng có thể:\n- Quan sát toàn cảnh núi đá vôi, mặt nước và bầu trời từ nhiều góc nhìn khác nhau\n- Di chuyển giữa các điểm nổi bật như hang động, làng chài, bãi biển và khu vực trung tâm vịnh\n- Tương tác với các điểm thông tin (Hotspot) để tìm hiểu thêm về cảnh quan, địa chất và giá trị văn hóa\nDự án không chỉ phục vụ mục đích tham quan trực tuyến, mà còn hướng đến giáo dục – du lịch số – quảng bá di sản, giúp người xem tiếp cận Vịnh Hạ Long một cách trực quan, sinh động và bền vững hơn trong thời đại số.', 'Ha Long Bay is one of Vietnam’s most iconic natural wonders, recognized by UNESCO as a World Natural Heritage Site. The Ha Long Bay VR Project offers a new way to explore this landscape through an immersive 360° virtual experience, allowing viewers to feel present within the scenery rather than simply observing static images.\n- Through virtual reality technology, users can:\n- Explore panoramic views of limestone mountains, water surfaces, and sky\n- Navigate between key locations such as caves, floating villages, beaches, and central bay areas\nInteract with information hotspots to learn about natural formations, geology, and cultural values\nThis project is designed not only for virtual tourism, but also for education, digital heritage preservation, and experiential storytelling, bringing Ha Long Bay closer to audiences in a modern and engaging format.', NULL, '/uploads/projects/thumbnails/84de075b-20ea-4117-a7dd-0a56eb4959dd.jpg', 1, 1, 0, 1, '2025-11-26 07:53:15', '2026-01-08 19:57:13'),
(5, 'Hue Citadel', 'Hoàng Thành Huế', 'Hue Citadel', 3, 'Hue', 'Historical heritage site.', '', 'Di tích lịch sử cố đô Huế.', 'Historical heritage of the ancient capital Hue.', NULL, '/uploads/projects/thumbnails/876ee528-832b-4ff6-b472-e2f61b5181b8.jpg', 0, 0, 0, 1, '2025-11-26 07:53:15', '2025-12-13 08:01:36'),
(6, 'Temple of Literature', 'Văn Miếu', 'Temple of Literature', 3, 'Hanoi', 'First university of Vietnam.', '', 'Trường đại học đầu tiên của Việt Nam.', 'First university of Vietnam.', NULL, '/uploads/projects/thumbnails/dc7dc489-9f81-445a-9555-f924a65634e3.png', 0, 1, 1, 1, '2025-11-26 07:53:16', '2025-12-01 05:50:42'),
(7, 'Virtual Lab', 'Phòng Thí Nghiệm Ảo', 'Virtual Lab', 4, 'Hanoi', 'Interactive science models.', '', 'Mô hình khoa học tương tác cho học sinh.', 'Interactive science models for students.', NULL, '/uploads/projects/thumbnails/b0cd909d-b21b-4dcc-abfb-9671677eb5d3.png', 1, 0, 0, 0, '2025-11-26 07:53:16', '2025-12-13 08:10:52'),
(8, 'Anatomy Class', 'Lớp Giải Phẫu', 'Anatomy Class', 4, 'Online', '3D Human body models.', '', 'Mô hình cơ thể người 3D.', '3D Human body models.', NULL, '/uploads/projects/thumbnails/fb5dd283-9953-4320-bfcc-d449f947871e.png', 1, 0, 0, 0, '2025-11-26 07:53:16', '2025-12-10 06:26:28'),
(11, 'Tech Hub', 'Trung Tâm Công Nghệ', 'Tech Hub', 6, 'Saigon', 'Modern workspace.', '', 'Không gian làm việc hiện đại.', 'Modern workspace.', NULL, '/uploads/projects/thumbnails/23b25237-5d03-40b8-ab67-93af0de04f1b.jpg', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-12-01 05:51:24'),
(12, 'Data Center', 'Trung Tâm Dữ Liệu', 'Data Center', 6, 'Singapore', 'Secure server farm.', '', 'Hệ thống máy chủ bảo mật.', 'Secure server farm.', NULL, '/uploads/projects/thumbnails/476b15b2-5fbc-4b9c-83de-fe40fe67e1cd.jpg', 0, 0, 0, 1, '2025-11-26 07:53:16', '2025-12-01 05:51:30'),
(16, 'Đại học Xây dựng Hà Nội', 'Đại học Xây dựng Hà Nội', 'Hanoi University of Civil Engineering', 4, 'Hanoi', 'Trải nghiệm không gian học tập và khuôn viên Đại học Xây dựng Hà Nội thông qua tour thực tế ảo 360°, phục vụ giáo dục, tuyển sinh và truyền thông số.', '', 'Dự án thực tế ảo Đại học Xây dựng Hà Nội tái hiện chân thực khuôn viên và không gian học tập của nhà trường thông qua công nghệ VR 360°.\n\nNgười xem có thể tham quan các khu vực tiêu biểu như giảng đường, phòng thí nghiệm, thư viện và các khu chức năng, mang lại cảm giác trực quan như đang hiện diện tại trường.\n\nHệ thống điểm tương tác cho phép di chuyển giữa các khu vực và tiếp cận thông tin về cơ sở vật chất, môi trường đào tạo và định hướng phát triển của nhà trường.\n\nDự án hướng tới mục tiêu hỗ trợ tuyển sinh, quảng bá hình ảnh, phục vụ đào tạo và thúc đẩy chuyển đổi số trong lĩnh vực giáo dục đại học.', 'The Hanoi University of Civil Engineering Virtual Reality project recreates the university’s campus and learning spaces through immersive 360-degree VR technology.\n\nVisitors can explore lecture halls, laboratories, libraries, and key facilities, gaining a realistic view of the academic environment.\n\nThe project supports student recruitment, institutional communication, education, and digital transformation in higher education.', NULL, '/uploads/projects/thumbnails/92f7e5ff-935e-4e51-af46-3b4a9960cb73.jpg', 1, 0, 0, 0, '2026-01-08 20:03:04', '2026-01-08 20:25:33'),
(17, 'Lăng Chủ tịch Hồ Chí Minh', 'Lăng Chủ tịch Hồ Chí Minh', 'Ho Chi Minh Mausoleum', 5, 'Hanoi', 'Trải nghiệm không gian Lăng Chủ tịch Hồ Chí Minh qua tour thực tế ảo 360°, giúp người xem tìm hiểu giá trị lịch sử, văn hóa và tinh thần dân tộc một cách trang nghiêm và trực quan.\n', '', 'Lăng Chủ tịch Hồ Chí Minh là một trong những di tích lịch sử – văn hóa đặc biệt quan trọng của Việt Nam, gắn liền với cuộc đời và sự nghiệp của Chủ tịch Hồ Chí Minh, vị lãnh tụ vĩ đại của dân tộc.\n\nDự án thực tế ảo Lăng Chủ tịch Hồ Chí Minh tái hiện không gian khu vực Lăng và Quảng trường Ba Đình thông qua công nghệ VR 360°, cho phép người xem tham quan và cảm nhận không gian lịch sử theo cách trực quan, chân thực nhưng vẫn giữ được sự trang nghiêm cần thiết.\n\nThông qua hệ thống điểm tương tác, người xem có thể tìm hiểu về kiến trúc công trình, ý nghĩa lịch sử của từng khu vực, cũng như vai trò của Lăng Chủ tịch Hồ Chí Minh trong đời sống tinh thần và văn hóa của nhân dân Việt Nam.\n\nDự án hướng tới mục tiêu giáo dục truyền thống, lan tỏa giá trị lịch sử, phục vụ học tập, nghiên cứu và góp phần bảo tồn, quảng bá di tích lịch sử trong thời đại chuyển đổi số.', 'The Ho Chi Minh Mausoleum is one of Vietnam’s most significant historical and cultural landmarks, closely associated with the life and legacy of President Ho Chi Minh, the nation’s great leader.\n\nThe Ho Chi Minh Mausoleum Virtual Reality project recreates the mausoleum area and Ba Dinh Square through immersive 360-degree VR technology, allowing visitors to explore the historical space in a respectful and realistic manner.\n\nThrough interactive points, users can learn about the architecture, historical significance of each area, and the role of the mausoleum in Vietnam’s cultural and spiritual life.\n\nThis project aims to support historical education, cultural preservation, academic research, and the promotion of national heritage in the digital era.', NULL, '/uploads/projects/thumbnails/47e16838-fd79-4cd9-a0fc-3b22a2643651.jpg', 1, 0, 0, 0, '2026-01-08 20:07:38', '2026-01-08 20:25:40');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `scenes`
--

CREATE TABLE `scenes` (
  `id` bigint(20) NOT NULL,
  `project_id` bigint(20) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `panorama_url` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 0,
  `initial_yaw` float DEFAULT 0,
  `initial_pitch` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `scenes`
--

INSERT INTO `scenes` (`id`, `project_id`, `name`, `title_vi`, `title_en`, `panorama_url`, `order_index`, `initial_yaw`, `initial_pitch`) VALUES
(9, 6, 'Main Gate', 'Cổng Chính', 'Main Gate', '/assets/images/vr_hero_banner.png', 0, 0, 0),
(13, 11, 'Trần Văn Long', 'Biệt Thự Biển', 'ocean', '/api/files/7d1106b1-3d04-4689-ba84-0d4105928106_HaLong.jpg', 0, 0, 0),
(22, 3, 'In the Heart of Ha Long Bay', 'Giữa Lòng Vịnh', 'In the Heart of Ha Long Bay', '/uploads/scenes/8354dde5-ec05-451d-96ad-e4fe7624b289_GiuaLongVinh.jpg', 0, 0, 0),
(23, 3, 'Thien Cung Cave', 'Động Thiên Cung', 'Thien Cung Cave', '/uploads/scenes/f44f62e6-985a-4829-982f-ede7cd1302e5_DongThienCung.jpg', 1, 0, 0),
(24, 3, 'Cua Van Floating Fishing Village', 'Làng chài Cửa Vạn', 'Cua Van Floating Fishing Village', '/uploads/scenes/93431a4a-ee02-43dc-b7c1-f658af34f07d_LangChaiCuaVan.jpg', 2, 0, 0),
(25, 3, 'Luon Cave', 'Hang Luồn', 'Luon Cave', '/uploads/scenes/5aac3903-a355-4663-bd8e-269c3b299884_HangLuon.jpg', 3, 0, 0),
(26, 3, 'Fighting Cocks Islet (Symbol of Ha Long Bay)', 'Hòn Trống Mái (Biểu tượng của Hạ Long)', 'Fighting Cocks Islet (Symbol of Ha Long Bay)', '/uploads/scenes/a4315236-538d-4019-8f3d-b1a82b8699ce_HonTrongMai.jpg', 4, 0, 0),
(27, 3, 'Titop Island', 'Đảo Ti Tốp', 'Titop Island', '/uploads/scenes/f0383e79-bd91-4669-987b-e2769a38fdad_DaoTiTop.jpg', 5, 0, 0),
(28, 3, 'Đảo Soi Sim', 'Đảo Soi Sim', 'Đảo Soi Sim', '/uploads/scenes/edebb529-40f3-483f-bea4-5093a2069d6d_DaoSoiSim.jpg', 6, 0, 0),
(29, 3, 'Virgin Cave – Drum Cave', 'Hang Trinh Nữ - Hang Trống', 'Virgin Cave – Drum Cave', '/uploads/scenes/36e904b6-0be0-4632-b558-6c57ce3fcb7a_HangTrinhNu.jpg', 7, 0, 0),
(30, 3, 'Queen Cable Car', 'Cáp treo Nữ Hoàng', 'Queen Cable Car', '/uploads/scenes/1aaddcd8-e006-4cde-9f54-cf68b6a198d1_CapTreoNuHoang.jpg', 8, 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('ROLE_USER','ROLE_ADMIN') NOT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `status`, `created_at`) VALUES
(3, 'LongPe', 'binhnhi210203@gmail.com', '$2a$10$XinhH4PCBH0JFcCICCcPTeOvtcEEsAGP78IXXpfA6Ju.T0XOhZZ/C', 'ROLE_ADMIN', 'ACTIVE', '2025-11-26 19:22:10'),
(5, 'long', 'long@gmail.com', '$2a$10$Vt66J4STVZvFObPEQiokQe/nDsaKczwRabN9i6A0QHj0dYhSCFdju', 'ROLE_USER', 'ACTIVE', '2025-12-03 02:49:00');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `blog_images`
--
ALTER TABLE `blog_images`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Chỉ mục cho bảng `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Chỉ mục cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scene_id` (`scene_id`),
  ADD KEY `target_scene_id` (`target_scene_id`),
  ADD KEY `fk_hotspot_model` (`model_id`);

--
-- Chỉ mục cho bảng `models_3d`
--
ALTER TABLE `models_3d`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Chỉ mục cho bảng `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Chỉ mục cho bảng `scenes`
--
ALTER TABLE `scenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `blog_images`
--
ALTER TABLE `blog_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT cho bảng `models_3d`
--
ALTER TABLE `models_3d`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT cho bảng `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `scenes`
--
ALTER TABLE `scenes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  ADD CONSTRAINT `fk_hotspot_model` FOREIGN KEY (`model_id`) REFERENCES `models_3d` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hotspots_ibfk_1` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hotspots_ibfk_2` FOREIGN KEY (`target_scene_id`) REFERENCES `scenes` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `models_3d`
--
ALTER TABLE `models_3d`
  ADD CONSTRAINT `models_3d_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `scenes`
--
ALTER TABLE `scenes`
  ADD CONSTRAINT `scenes_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
