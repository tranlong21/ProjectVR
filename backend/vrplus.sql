-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 28, 2025 lúc 02:32 PM
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
(1, 'Tương lai của VR trong Bất động sản', 'The Future of VR in Real Estate', 'future-vr-real-estate', '/assets/images/virtual_showroom_project.png', 'Nội dung bài viết về VR...', 'Content about VR in Real Estate...', '2025-11-26 07:53:16', '2025-11-26 07:53:16'),
(2, 'Biệt Thự Biển 2', '2', 'ocean', '/assets/images/vr_hero_banner.png', 'vi', 'en', '2025-11-26 19:27:01', '2025-11-26 19:27:01');

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
(25, 11, 'info', 0, 0, NULL, 'Biệt Thự Biển', 'ocen', 'ok', 'oks', 'arrow');

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
(2, 6, 'Main Model', NULL, NULL, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DragonAttenuation/glTF-Binary/DragonAttenuation.glb', '/assets/images/vr_hero_banner.png', '2025-11-26 07:53:16', NULL, NULL, NULL, NULL),
(3, 7, 'Main Model', NULL, NULL, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf', '/assets/images/vr_education_training.png', '2025-11-26 07:53:16', NULL, NULL, NULL, NULL),
(4, 8, 'Main Model', NULL, NULL, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf', '/assets/images/vr_education_training.png', '2025-11-26 07:53:16', NULL, NULL, NULL, NULL),
(5, 9, 'Main Model', NULL, NULL, 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf', '/assets/images/team_collaboration.png', '2025-11-26 07:53:16', NULL, NULL, NULL, NULL),
(10, 4, 'pro 2', 'GLB', '/uploads/models3d/94dc70ca-96ec-4ee7-a13d-76ac9a346754.glb', '/uploads/models3d/94dc70ca-96ec-4ee7-a13d-76ac9a346754.glb', NULL, '2025-11-27 03:20:50', NULL, 'ok', NULL, NULL),
(19, 2, 'pro 2', 'URL', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/BoomBox/glTF/BoomBox.gltf', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/BoomBox/glTF/BoomBox.gltf', NULL, '2025-11-28 09:07:26', NULL, 'ok', NULL, NULL),
(20, 1, 'ThapHuce', 'GLB', '/uploads/models3d/ff57c8c0-6a72-49ac-b57b-e1eb6f1d87e7.glb', '/uploads/models3d/ff57c8c0-6a72-49ac-b57b-e1eb6f1d87e7.glb', NULL, '2025-11-28 09:12:54', NULL, 'dep', NULL, NULL);

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
(1, 'Ocean Villa', 'Biệt Thự Biển', 'Ocean Villa', 1, 'Da Nang', 'Luxury villa with ocean view.', '', 'Biệt thự sang trọng sát biển với thiết kế hiện đại.', 'Luxury oceanfront villa with modern design.', NULL, '/uploads/projects/thumbnails/2d84b77b-5f94-4bc2-bc89-03f8f6b86661.jpg', 1, 1, 1, 1, '2025-11-26 07:53:15', '2025-11-28 01:47:33'),
(2, 'Luxury Apartment', 'Căn Hộ Cao Cấp', 'Luxury Apartment', 1, 'Hanoi', 'City center apartment.', '', 'Căn hộ trung tâm thành phố.', 'City center apartment.', NULL, '/assets/images/virtual_showroom_project.png', 1, 0, 1, 1, '2025-11-26 07:53:15', '2025-11-26 20:09:13'),
(3, 'Ha Long Bay', 'Vịnh Hạ Long', 'Ha Long Bay', 2, 'Quang Ninh', 'Experience the wonder of nature.', NULL, 'Khám phá kỳ quan thiên nhiên thế giới qua VR.', 'Explore the world natural wonder via VR.', NULL, '/assets/images/tourism_360_tour.png', 1, 1, 0, 1, '2025-11-26 07:53:15', '2025-11-26 07:53:15'),
(4, 'Son Doong Cave', 'Hang Sơn Đoòng', 'Son Doong Cave', 2, 'Quang Binh', 'Largest cave in the world.', NULL, 'Hang động lớn nhất thế giới.', 'Largest cave in the world.', NULL, '/assets/images/tourism_360_tour.png', 1, 1, 1, 1, '2025-11-26 07:53:15', '2025-11-26 19:24:52'),
(5, 'Hue Citadel', 'Hoàng Thành Huế', 'Hue Citadel', 3, 'Hue', 'Historical heritage site.', NULL, 'Di tích lịch sử cố đô Huế.', 'Historical heritage of the ancient capital Hue.', NULL, '/assets/images/vr_hero_banner.png', 1, 0, 0, 1, '2025-11-26 07:53:15', '2025-11-26 07:53:15'),
(6, 'Temple of Literature', 'Văn Miếu', 'Temple of Literature', 3, 'Hanoi', 'First university of Vietnam.', NULL, 'Trường đại học đầu tiên của Việt Nam.', 'First university of Vietnam.', NULL, '/assets/images/vr_hero_banner.png', 0, 1, 1, 1, '2025-11-26 07:53:16', '2025-11-26 07:53:16'),
(7, 'Virtual Lab', 'Phòng Thí Nghiệm Ảo', 'Virtual Lab', 4, 'Hanoi', 'Interactive science models.', NULL, 'Mô hình khoa học tương tác cho học sinh.', 'Interactive science models for students.', NULL, '/assets/images/vr_education_training.png', 1, 0, 1, 0, '2025-11-26 07:53:16', '2025-11-26 07:53:16'),
(8, 'Anatomy Class', 'Lớp Giải Phẫu', 'Anatomy Class', 4, 'Online', '3D Human body models.', '', 'Mô hình cơ thể người 3D.', '3D Human body models.', NULL, '/assets/images/vr_education_training.png', 1, 0, 1, 0, '2025-11-26 07:53:16', '2025-11-27 09:20:57'),
(9, 'Smart Factory', 'Nhà Máy Thông Minh', 'Smart Factory', 5, 'Binh Duong', 'Automated production line.', NULL, 'Dây chuyền sản xuất tự động hóa.', 'Automated production line.', NULL, '/assets/images/team_collaboration.png', 0, 1, 1, 1, '2025-11-26 07:53:16', '2025-11-26 07:53:16'),
(10, 'Solar Farm', 'Trang Trại Điện Mặt Trời', 'Solar Farm', 5, 'Ninh Thuan', 'Renewable energy.', NULL, 'Năng lượng tái tạo.', 'Renewable energy.', NULL, '/assets/images/team_collaboration.png', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-11-26 07:53:16'),
(11, 'Tech Hub', 'Trung Tâm Công Nghệ', 'Tech Hub', 6, 'Saigon', 'Modern workspace.', NULL, 'Không gian làm việc hiện đại.', 'Modern workspace.', NULL, '/assets/images/ar_marketing_demo.png', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-11-26 07:53:16'),
(12, 'Data Center', 'Trung Tâm Dữ Liệu', 'Data Center', 6, 'Singapore', 'Secure server farm.', NULL, 'Hệ thống máy chủ bảo mật.', 'Secure server farm.', NULL, '/assets/images/ar_marketing_demo.png', 0, 0, 0, 1, '2025-11-26 07:53:16', '2025-11-26 07:53:16');

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
(1, 1, 'Living Room', 'Phòng Khách', 'Living Room', '/assets/images/virtual_showroom_project.png', 0, 0, 0),
(2, 1, 'Kitchen', 'Nhà Bếp', 'Kitchen', '/assets/images/virtual_showroom_project.png', 1, 90, 0),
(3, 1, 'Balcony', 'Ban Công', 'Balcony', '/assets/images/virtual_showroom_project.png', 2, 180, -10),
(4, 3, 'Cruise Deck', 'Boong Tàu', 'Cruise Deck', '/assets/images/tourism_360_tour.png', 0, 0, 0),
(5, 3, 'Cave Interior', 'Bên Trong Hang', 'Cave Interior', '/assets/images/tourism_360_tour.png', 1, 45, 5),
(6, 4, 'Entrance', 'Lối Vào', 'Entrance', '/assets/images/tourism_360_tour.png', 0, 0, 0),
(7, 4, 'Main Chamber', 'Phòng Chính', 'Main Chamber', '/assets/images/tourism_360_tour.png', 1, 0, 10),
(8, 4, 'Underground River', 'Sông Ngầm', 'Underground River', '/assets/images/tourism_360_tour.png', 2, 90, -5),
(9, 6, 'Main Gate', 'Cổng Chính', 'Main Gate', '/assets/images/vr_hero_banner.png', 0, 0, 0),
(11, 1, 'pro 2', 'Biệt Thự Biển', 'ocean', '/api/files/b9334b38-c7f3-46fd-a410-a18545f4ecba_1.jpg', 3, 0, 0),
(12, 10, 'Trần Văn Long', 'Biệt Thự Biển', 'Ocean Villa', '/api/files/71b892d5-bf2f-4779-819d-3198424dd026_NuThanTudo.jpg', 0, 0, 0),
(13, 11, 'Trần Văn Long', 'Biệt Thự Biển', 'ocean', '/api/files/7d1106b1-3d04-4689-ba84-0d4105928106_HaLong.jpg', 0, 0, 0),
(14, 9, 'Trần Văn Long', 'Căn Hộ Cao Cấp', 'Luxury Apartment', '/api/files/433d9aac-155f-46e5-8073-f08e0e715cd5_NhaTho.jpg', 0, 0, 0);

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
(4, 'LongPe21', 'longpe21@gmail.com', '$2a$10$v.1rQvCvDC5Kqa7KFm.vauf5PZU.8uPLP/QtU2iqqxJvUZxkJZg5O', 'ROLE_USER', 'ACTIVE', '2025-11-26 19:39:24');

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `models_3d`
--
ALTER TABLE `models_3d`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `scenes`
--
ALTER TABLE `scenes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
