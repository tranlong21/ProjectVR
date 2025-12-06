-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 06, 2025 lúc 01:19 PM
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
-- Cấu trúc bảng cho bảng `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) NOT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `content_vi` text DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title_vi`, `title_en`, `slug`, `thumbnail_url`, `content_vi`, `content_en`, `created_at`, `updated_at`) VALUES
(1, 'Tương lai của VR trong Bất động sản', 'The Future of VR in Real Estate', 'future-vr-real-estate', '/uploads/blog/1764597610961_sapa.jpg', 'Nội dung bài viết về VR...', 'Content about VR in Real Estate...\nVR', '2025-11-26 07:53:16', '2025-12-03 04:55:40'),
(3, 'Tương lai của VR trong Bất động sản', 'ok', 'ok', '/assets/images/vr_hero_banner.png', 'ok', 'ọk', '2025-12-03 04:56:06', '2025-12-03 04:56:06'),
(4, 'Biệt Thự Biển', 'ok', 'ok2', '/assets/images/vr_hero_banner.png', '33', '33', '2025-12-03 05:18:12', '2025-12-03 05:18:12');

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
(5, 'Công Nghiệp', 'Industrial', 'industrial'),
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
(1, 1, '/assets/images/virtual_showroom_project.png', 'Main View'),
(2, 2, '/assets/images/virtual_showroom_project.png', 'Main View'),
(3, 3, '/assets/images/tourism_360_tour.png', 'Main View'),
(4, 4, '/assets/images/tourism_360_tour.png', 'Main View'),
(5, 5, '/assets/images/vr_hero_banner.png', 'Main View'),
(6, 6, '/assets/images/vr_hero_banner.png', 'Main View'),
(7, 9, '/assets/images/team_collaboration.png', 'Main View'),
(8, 10, '/assets/images/team_collaboration.png', 'Main View'),
(9, 11, '/assets/images/ar_marketing_demo.png', 'Main View'),
(10, 12, '/assets/images/ar_marketing_demo.png', 'Main View'),
(16, 1, '/assets/images/vr_hero_banner.png', 'Detail View'),
(17, 2, '/assets/images/vr_hero_banner.png', 'Detail View'),
(18, 3, '/assets/images/vr_hero_banner.png', 'Detail View'),
(19, 4, '/assets/images/vr_hero_banner.png', 'Detail View'),
(20, 5, '/assets/images/vr_hero_banner.png', 'Detail View'),
(21, 6, '/assets/images/vr_hero_banner.png', 'Detail View'),
(22, 9, '/assets/images/vr_hero_banner.png', 'Detail View'),
(23, 10, '/assets/images/vr_hero_banner.png', 'Detail View'),
(24, 11, '/assets/images/vr_hero_banner.png', 'Detail View'),
(25, 12, '/assets/images/vr_hero_banner.png', 'Detail View');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hotspots`
--

CREATE TABLE `hotspots` (
  `id` bigint(20) NOT NULL,
  `scene_id` bigint(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `yaw` float NOT NULL,
  `pitch` float NOT NULL,
  `target_scene_id` bigint(20) DEFAULT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `description_vi` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hotspots`
--

INSERT INTO `hotspots` (`id`, `scene_id`, `type`, `yaw`, `pitch`, `target_scene_id`, `title_vi`, `title_en`, `description_vi`, `description_en`, `icon`) VALUES
(1, 1, 'link_scene', 90, 0, 2, 'Đến Nhà Bếp', 'Go to Kitchen', 'Di chuyển đến khu vực nhà bếp', 'Move to the kitchen area', 'arrow'),
(2, 1, 'link_scene', 180, -10, 3, 'Đến Ban Công', 'Go to Balcony', 'Khám phá ban công với view biển', 'Explore the balcony with ocean view', 'arrow'),
(3, 1, 'info', -45, 5, NULL, 'Sofa Cao Cấp', 'Luxury Sofa', 'Sofa da Ý nhập khẩu', 'Imported Italian leather sofa', 'info'),
(4, 2, 'link_scene', -90, 0, 1, 'Quay lại Phòng Khách', 'Back to Living Room', 'Quay lại phòng khách', 'Return to living room', 'arrow'),
(5, 2, 'info', 0, -15, NULL, 'Bếp Thông Minh', 'Smart Kitchen', 'Hệ thống bếp thông minh tích hợp IoT', 'IoT-integrated smart kitchen system', 'info'),
(6, 3, 'link_scene', 0, 10, 1, 'Quay lại Phòng Khách', 'Back to Living Room', 'Quay lại phòng khách', 'Return to living room', 'arrow'),
(7, 3, 'info', 90, -20, NULL, 'View Biển', 'Ocean View', 'Tầm nhìn ra biển tuyệt đẹp', 'Stunning ocean view', 'info'),
(8, 4, 'link_scene', 120, 15, 5, 'Vào Hang Động', 'Enter the Cave', 'Khám phá bên trong hang động', 'Explore inside the cave', 'arrow'),
(9, 4, 'info', -60, 0, NULL, 'Vịnh Hạ Long', 'Ha Long Bay', 'Di sản thiên nhiên thế giới UNESCO', 'UNESCO World Natural Heritage', 'info'),
(10, 4, 'url', 180, -10, NULL, 'Tìm hiểu thêm', 'Learn More', 'https://whc.unesco.org/en/list/672/', 'https://whc.unesco.org/en/list/672/', 'link'),
(11, 5, 'link_scene', -120, -15, 4, 'Ra Boong Tàu', 'Exit to Deck', 'Quay lại boong tàu', 'Return to cruise deck', 'arrow'),
(12, 5, 'info', 45, 20, NULL, 'Thạch Nhũ', 'Stalactites', 'Thạch nhũ hình thành hàng nghìn năm', 'Stalactites formed over thousands of years', 'info'),
(13, 6, 'link_scene', 0, 10, 7, 'Vào Phòng Chính', 'Enter Main Chamber', 'Di chuyển vào phòng chính', 'Move to main chamber', 'arrow'),
(14, 6, 'info', -90, 0, NULL, 'Hang Lớn Nhất Thế Giới', 'World\'s Largest Cave', 'Sơn Đoòng - Hang động lớn nhất hành tinh', 'Son Doong - The world\'s largest cave', 'info'),
(15, 7, 'link_scene', 180, -10, 6, 'Quay lại Lối Vào', 'Back to Entrance', 'Quay lại lối vào', 'Return to entrance', 'arrow'),
(16, 7, 'link_scene', 90, -5, 8, 'Đến Sông Ngầm', 'Go to Underground River', 'Khám phá sông ngầm', 'Explore the underground river', 'arrow'),
(17, 7, 'info', 0, 35, NULL, 'Hệ Sinh Thái Hang', 'Cave Ecosystem', 'Hệ sinh thái độc đáo bên trong hang', 'Unique ecosystem inside the cave', 'info'),
(18, 8, 'link_scene', -90, 5, 7, 'Quay lại Phòng Chính', 'Back to Main Chamber', 'Quay lại phòng chính', 'Return to main chamber', 'arrow'),
(19, 8, 'info', 90, -15, NULL, 'Dòng Sông Ngầm', 'Underground Stream', 'Dòng sông ngầm chảy qua hang', 'Underground stream flowing through cave', 'info'),
(20, 9, 'link_scene', 0, 0, NULL, 'Vào Sân Trong', 'Enter Courtyard', 'Di chuyển vào sân trong', 'Move to the courtyard', 'arrow'),
(21, 9, 'info', -45, 10, NULL, 'Văn Miếu Quốc Tử Giám', 'Temple of Literature', 'Trường đại học đầu tiên của Việt Nam', 'Vietnam\'s first university', 'info'),
(25, 11, 'info', 0, 0, NULL, 'Biệt Thự Biển', 'ocen', 'ok đẹp', 'oks', 'arrow'),
(26, 11, 'link_scene', 0, -96, 2, '', '', '', '', 'arrow'),
(27, 16, 'link_scene', 0, 0, 5, '', '', '', '', 'arrow'),
(28, 16, 'link_scene', 120, -95, 4, '', '', '', '', 'arrow');

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
  `description_en` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `models_3d`
--

INSERT INTO `models_3d` (`id`, `project_id`, `name`, `format`, `file_url`, `model_url`, `preview_image_url`, `created_at`, `category`, `description`, `description_vi`, `description_en`) VALUES
(3, 7, 'Main Model', NULL, NULL, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf', '/assets/images/vr_education_training.png', '2025-11-26 07:53:16', NULL, NULL, NULL, NULL),
(4, 8, 'Main Model', NULL, NULL, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf', '/assets/images/vr_education_training.png', '2025-11-26 07:53:16', NULL, NULL, NULL, NULL),
(10, 4, 'pro 2', 'GLB', '/uploads/models3d/94dc70ca-96ec-4ee7-a13d-76ac9a346754.glb', '/uploads/models3d/94dc70ca-96ec-4ee7-a13d-76ac9a346754.glb', NULL, '2025-11-27 03:20:50', NULL, 'ok', NULL, NULL),
(19, 2, 'pro 2', 'URL', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/BoomBox/glTF/BoomBox.gltf', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/BoomBox/glTF/BoomBox.gltf', NULL, '2025-11-28 09:07:26', NULL, 'ok', NULL, NULL),
(21, 1, 'Thap', 'GLB', '/uploads/models3d/b275705f-b8ad-45a5-983d-ba9261d82e76.glb', '/uploads/models3d/b275705f-b8ad-45a5-983d-ba9261d82e76.glb', NULL, '2025-12-01 14:58:25', NULL, NULL, 'Mô hình 3D mô phỏng một quảng trường trung tâm với cấu trúc kim tự tháp bằng thép đặt phía trên hệ thống đài phun nước nhiều tầng. Các bệ tròn được bố trí theo dạng bậc thang, tạo cảm giác không gian mở và hiện đại. Bề mặt nước phản chiếu ánh sáng, kết hợp cùng khung thép hình học phía trên mang lại vẻ đẹp tinh tế và cân bằng. Đây là thiết kế kiến trúc mang tính biểu tượng, phù hợp cho các không gian cảnh quan, công viên hoặc điểm nhấn đô thị', 'This 3D model represents a modern public square featuring a multi-tiered fountain platform topped with a geometric steel pyramid structure. The circular terraces create a stepped layout that enhances spatial depth and openness. The reflective water surfaces combined with the lightweight steel frame add a sense of elegance and architectural balance. This iconic structure is suitable for urban landmarks, landscape installations, or contemporary outdoor spaces.'),
(22, 6, 'Main Model', 'GLB', '/uploads/models3d/f453ab00-9990-47df-9bb3-f40a21c8dd63.glb', '/uploads/models3d/f453ab00-9990-47df-9bb3-f40a21c8dd63.glb', NULL, '2025-12-03 16:08:23', NULL, NULL, 'ok', 'ok');

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
(1, 'Ocean Villa', 'Biệt Thự Biển', 'Ocean Villa', 1, 'Da Nang', 'Luxury villa with ocean view.', '', 'Biệt thự sang trọng sát biển với thiết kế hiện đại.', 'Luxury oceanfront villa with modern design.', NULL, '/uploads/projects/thumbnails/5b2e2262-469f-403b-9a05-7d90f739e76d.jpg', 1, 1, 1, 1, '2025-11-26 07:53:15', '2025-12-03 08:23:43'),
(2, 'Luxury Apartment', 'Căn Hộ Cao Cấp', 'Luxury Apartment', 1, 'Hanoi', 'City center apartment.', '', 'Căn hộ trung tâm thành phố.', 'City center apartment.', NULL, '/uploads/projects/thumbnails/4c24e5fd-a47d-4bf8-a52a-740f744d6a45.jpg', 1, 0, 1, 1, '2025-11-26 07:53:15', '2025-12-01 05:47:17'),
(3, 'Ha Long Bay', 'Vịnh Hạ Long', 'Ha Long Bay', 2, 'Quang Ninh', 'Experience the wonder of nature.', '', 'Khám phá kỳ quan thiên nhiên thế giới qua VR.', 'Explore the world natural wonder via VR.', NULL, '/uploads/projects/thumbnails/84de075b-20ea-4117-a7dd-0a56eb4959dd.jpg', 1, 1, 0, 1, '2025-11-26 07:53:15', '2025-12-01 05:50:00'),
(4, 'Son Doong Cave', 'Hang Sơn Đoòng', 'Son Doong Cave', 2, 'Quang Binh', 'Largest cave in the world.', '', 'Hang động lớn nhất thế giới.', 'Largest cave in the world.', NULL, '/uploads/projects/thumbnails/1524a6a2-0b5b-463c-b298-d4d6dda64856.jpg', 1, 1, 1, 1, '2025-11-26 07:53:15', '2025-12-01 05:50:08'),
(5, 'Hue Citadel', 'Hoàng Thành Huế', 'Hue Citadel', 3, 'Hue', 'Historical heritage site.', '', 'Di tích lịch sử cố đô Huế.', 'Historical heritage of the ancient capital Hue.', NULL, '/uploads/projects/thumbnails/876ee528-832b-4ff6-b472-e2f61b5181b8.jpg', 1, 0, 0, 1, '2025-11-26 07:53:15', '2025-12-01 05:50:15'),
(6, 'Temple of Literature', 'Văn Miếu', 'Temple of Literature', 3, 'Hanoi', 'First university of Vietnam.', '', 'Trường đại học đầu tiên của Việt Nam.', 'First university of Vietnam.', NULL, '/uploads/projects/thumbnails/dc7dc489-9f81-445a-9555-f924a65634e3.png', 0, 1, 1, 1, '2025-11-26 07:53:16', '2025-12-01 05:50:42'),
(7, 'Virtual Lab', 'Phòng Thí Nghiệm Ảo', 'Virtual Lab', 4, 'Hanoi', 'Interactive science models.', '', 'Mô hình khoa học tương tác cho học sinh.', 'Interactive science models for students.', NULL, '/uploads/projects/thumbnails/b0cd909d-b21b-4dcc-abfb-9671677eb5d3.png', 1, 0, 1, 0, '2025-11-26 07:53:16', '2025-12-01 05:50:49'),
(8, 'Anatomy Class', 'Lớp Giải Phẫu', 'Anatomy Class', 4, 'Online', '3D Human body models.', '', 'Mô hình cơ thể người 3D.', '3D Human body models.', NULL, '/uploads/projects/thumbnails/fb5dd283-9953-4320-bfcc-d449f947871e.png', 1, 0, 1, 0, '2025-11-26 07:53:16', '2025-12-01 05:50:58'),
(9, 'Smart Factory', 'Nhà Máy Thông Minh', 'Smart Factory', 5, 'Binh Duong', 'Automated production line.', '', 'Dây chuyền sản xuất tự động hóa.', 'Automated production line.', NULL, '/uploads/projects/thumbnails/ff69bce2-9eda-4a54-b151-25056cda5adc.jpg', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-12-04 19:56:56'),
(10, 'Solar Farm', 'Trang Trại Điện Mặt Trời', 'Solar Farm', 5, 'Ninh Thuan', 'Renewable energy.', '', 'Năng lượng tái tạo.', 'Renewable energy.', NULL, '/uploads/projects/thumbnails/808c7ee8-08a0-44c4-a65c-cfe1474a5ca5.jpg', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-12-01 05:51:17'),
(11, 'Tech Hub', 'Trung Tâm Công Nghệ', 'Tech Hub', 6, 'Saigon', 'Modern workspace.', '', 'Không gian làm việc hiện đại.', 'Modern workspace.', NULL, '/uploads/projects/thumbnails/23b25237-5d03-40b8-ab67-93af0de04f1b.jpg', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-12-01 05:51:24'),
(12, 'Data Center', 'Trung Tâm Dữ Liệu', 'Data Center', 6, 'Singapore', 'Secure server farm.', '', 'Hệ thống máy chủ bảo mật.', 'Secure server farm.', NULL, '/uploads/projects/thumbnails/476b15b2-5fbc-4b9c-83de-fe40fe67e1cd.jpg', 0, 0, 0, 1, '2025-11-26 07:53:16', '2025-12-01 05:51:30');

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
(1, 1, 'Living Room', 'Phòng Khách 1', 'Living Room 1', '/api/files/7e6141dd-7559-42e9-92a2-229ea9147665_NhaTho.jpg', 0, 0, 0),
(2, 1, 'Kitchen', 'Nhà Bếp', 'Kitchen', '/api/files/74205906-fdcb-40e0-bad3-cb5c08802f60_from-tree.jpg', 1, 90, 0),
(3, 1, 'Balcony', 'Ban Công', 'Balcony', '/api/files/0f9a2477-dd4f-4ad8-a07d-2c9667e48a3c_GiuaLongVinh.jpg', 2, 180, -10),
(4, 3, 'Cruise Deck', 'Boong Tàu', 'Cruise Deck', '/api/files/f4de8de9-6c5f-47de-93f1-18de0479c9e6_HangLuon.jpg', 0, 0, 0),
(5, 3, 'Cave Interior', 'Bên Trong Hang', 'Cave Interior', '/api/files/8cca4888-73d7-418a-95c2-019763283e7b_DongThienCung.jpg', 1, 45, 5),
(6, 4, 'Entrance', 'Lối Vào', 'Entrance', '/assets/images/tourism_360_tour.png', 0, 0, 0),
(7, 4, 'Main Chamber', 'Phòng Chính', 'Main Chamber', '/assets/images/tourism_360_tour.png', 1, 0, 10),
(8, 4, 'Underground River', 'Sông Ngầm', 'Underground River', '/assets/images/tourism_360_tour.png', 2, 90, -5),
(9, 6, 'Main Gate', 'Cổng Chính', 'Main Gate', '/assets/images/vr_hero_banner.png', 0, 0, 0),
(11, 1, 'pro 2', 'Biệt Thự Biển', 'ocean', '/api/files/a17dbce0-325a-440f-81b3-f01cf42e84cd_NuThanTudo.jpg', 3, 0, 0),
(12, 10, 'Trần Văn Long', 'Biệt Thự Biển', 'Ocean Villa', '/api/files/71b892d5-bf2f-4779-819d-3198424dd026_NuThanTudo.jpg', 0, 0, 0),
(13, 11, 'Trần Văn Long', 'Biệt Thự Biển', 'ocean', '/api/files/7d1106b1-3d04-4689-ba84-0d4105928106_HaLong.jpg', 0, 0, 0),
(14, 9, 'Trần Văn Long', 'Căn Hộ Cao Cấp', 'Luxury Apartment', '/api/files/433d9aac-155f-46e5-8073-f08e0e715cd5_NhaTho.jpg', 0, 0, 0),
(16, 3, 'Giữa Lòng Vịnh', 'Vịnh Hạ Long', 'Hạ Long Bay', '/api/files/7d448d58-13d0-425b-a09c-868df02b9cda_GiuaLongVinh.jpg', 2, 0, 0);

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
(1, 'admin', 'admin@vrplus.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcLRch.GZ3XO', 'ROLE_ADMIN', 'ACTIVE', '2025-11-26 07:53:15'),
(2, 'user', 'user@vrplus.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcLRch.GZ3XO', 'ROLE_USER', 'DELETED', '2025-11-26 07:53:15'),
(3, 'LongPe', 'binhnhi210203@gmail.com', '$2a$10$XinhH4PCBH0JFcCICCcPTeOvtcEEsAGP78IXXpfA6Ju.T0XOhZZ/C', 'ROLE_ADMIN', 'ACTIVE', '2025-11-26 19:22:10'),
(4, 'LongPe21', 'longpe21@gmail.com', '$2a$10$v.1rQvCvDC5Kqa7KFm.vauf5PZU.8uPLP/QtU2iqqxJvUZxkJZg5O', 'ROLE_USER', 'ACTIVE', '2025-11-26 19:39:24'),
(5, 'long', 'long@gmail.com', '$2a$10$Vt66J4STVZvFObPEQiokQe/nDsaKczwRabN9i6A0QHj0dYhSCFdju', 'ROLE_USER', 'ACTIVE', '2025-12-03 02:49:00');

--
-- Chỉ mục cho các bảng đã đổ
--

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
  ADD KEY `target_scene_id` (`target_scene_id`);

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
-- AUTO_INCREMENT cho bảng `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `models_3d`
--
ALTER TABLE `models_3d`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `scenes`
--
ALTER TABLE `scenes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
