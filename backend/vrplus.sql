-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th1 08, 2026 lúc 02:16 PM
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
(11, 'VR Plus – Giải pháp Trải nghiệm Không gian Số cho Bất động sản & Du lịch', 'VR Plus – Giải pháp Trải nghiệm Không gian Số cho Bất động sản & Du lịch', 'vr-plus-giai-phap-trai-nghiem-khong-gian-so-cho-bat-dong-san-du-lich', '/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png', '<h1>VR Plus – Giải pháp Trải nghiệm Không gian Số cho Bất động sản &amp; Du lịch.</h1><div><br></div>Trong bối cảnh chuyển đổi số diễn ra mạnh mẽ, <strong data-start=\"522\" data-end=\"533\">VR Plus</strong> mang đến một cách tiếp cận hoàn toàn mới trong việc <strong data-start=\"586\" data-end=\"612\">trải nghiệm không gian</strong>. Thay vì chỉ xem hình ảnh tĩnh hay bản vẽ 2D, người dùng có thể <strong data-start=\"677\" data-end=\"732\">tham quan không gian 360°, mô hình 3D và thực tế ảo</strong> một cách trực quan, sinh động và chân thực.<div><br></div><div><img src=\"http://localhost:8096/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png\"></div><div><br></div><h2>VR Plus là gì?</h2><div><br></div><div><p data-start=\"1022\" data-end=\"1160\">VR Plus là nền tảng ứng dụng <strong data-start=\"1051\" data-end=\"1093\">công nghệ Thực tế ảo (Virtual Reality)</strong> nhằm tái hiện không gian thực dưới dạng số hóa. Người dùng có thể:</p>\nTham quan dự án bất động sản từ xa<br>Trải nghiệm khu nghỉ dưỡng, khách sạn, resort<br>Xem mô hình 3D công trình, nội thất, showroom<br><ul data-start=\"1161\" data-end=\"1350\">\n<li data-start=\"1294\" data-end=\"1350\">\n<ul data-start=\"1432\" data-end=\"1555\">\n</ul></li></ul><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><p data-start=\"1296\" data-end=\"1350\" style=\"display: inline !important;\">Tương tác với các điểm nóng (hotspot) trong không gian<br><br></p><p data-start=\"1389\" data-end=\"1431\"><strong data-start=\"1389\" data-end=\"1431\">Những công nghệ nổi bật trong VR Plus:</strong></p><p data-start=\"1296\" data-end=\"1350\"></p><li>Tour 360° Panorama</li><li>Mô hình 3D tương tác</li><li>Bản đồ định vị không gian</li><li>Trải nghiệm đa nền tảng (Web, Mobile, VR Headset)<br><br></li></ul><h2><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><li>Lợi ích của VR Plus đối với Bất động sản<br><br>Đối với lĩnh vực bất động sản, VR Plus giúp <strong data-start=\"1711\" data-end=\"1760\">rút ngắn khoảng cách giữa khách hàng và dự án</strong>. Khách hàng có thể xem chi tiết từng căn hộ, từng không gian, ngay cả khi dự án chưa hoàn thiện ngoài thực tế.<br><br></li></ul></h2><h3 data-start=\"1878\" data-end=\"1903\"><strong data-start=\"1882\" data-end=\"1903\">Trích dẫn (Quote)</strong></h3><h2><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><li>\n<blockquote data-start=\"1904\" data-end=\"2017\">\n<p data-start=\"1906\" data-end=\"2017\">“VR Plus không chỉ là công nghệ, mà là cách kể câu chuyện về không gian một cách trực quan và thuyết phục hơn.”<br><br></p><h2>Ứng dụng thực tế của VR Plus<br><br></h2><p></p></blockquote></li></ul></h2><h3 data-start=\"2088\" data-end=\"2129\"><strong data-start=\"2092\" data-end=\"2129\">Danh sách đánh số (Numbered List)</strong></h3><h2><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><li><blockquote data-start=\"1904\" data-end=\"2017\"></blockquote></li></ul></h2><h2>\n<span style=\"font-size: inherit; font-weight: inherit;\">Giới thiệu dự án bất động sản cao cấp</span><br><span style=\"font-size: inherit; font-weight: inherit;\">Trưng bày showroom nội thất</span><br><span style=\"font-size: inherit; font-weight: inherit;\">Quảng bá điểm đến du lịch – resort – khách sạn</span><br><span style=\"font-size: inherit; font-weight: inherit;\">Đào tạo, mô phỏng công trình xây dựng<br><br></span><img src=\"http://localhost:8096/uploads/blog/content/1886d505-e355-4a09-acb9-48c8051baa3f.png\"></h2><h2><strong data-start=\"2413\" data-end=\"2462\">VR Plus – Xu hướng tất yếu của trải nghiệm số</strong></h2><ol data-start=\"2130\" data-end=\"2300\">\n</ol></div>', '<h1>VR Plus – Giải pháp Trải nghiệm Không gian Số cho Bất động sản &amp; Du lịch.</h1><div><br></div>Trong bối cảnh chuyển đổi số diễn ra mạnh mẽ, <strong data-start=\"522\" data-end=\"533\">VR Plus</strong> mang đến một cách tiếp cận hoàn toàn mới trong việc <strong data-start=\"586\" data-end=\"612\">trải nghiệm không gian</strong>. Thay vì chỉ xem hình ảnh tĩnh hay bản vẽ 2D, người dùng có thể <strong data-start=\"677\" data-end=\"732\">tham quan không gian 360°, mô hình 3D và thực tế ảo</strong> một cách trực quan, sinh động và chân thực.<div><br></div><div><img src=\"http://localhost:8096/uploads/blog/content/74edf3a8-cd8d-40a5-9a1d-3e1ea61bfdf0.png\"></div><div><br></div><h2>VR Plus là gì?</h2><div><br></div><div><p data-start=\"1022\" data-end=\"1160\">VR Plus là nền tảng ứng dụng <strong data-start=\"1051\" data-end=\"1093\">công nghệ Thực tế ảo (Virtual Reality)</strong> nhằm tái hiện không gian thực dưới dạng số hóa. Người dùng có thể:</p>\nTham quan dự án bất động sản từ xa<br>Trải nghiệm khu nghỉ dưỡng, khách sạn, resort<br>Xem mô hình 3D công trình, nội thất, showroom<br><ul data-start=\"1161\" data-end=\"1350\">\n<li data-start=\"1294\" data-end=\"1350\">\n<ul data-start=\"1432\" data-end=\"1555\">\n</ul></li></ul><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><p data-start=\"1296\" data-end=\"1350\" style=\"display: inline !important;\">Tương tác với các điểm nóng (hotspot) trong không gian<br><br></p><p data-start=\"1389\" data-end=\"1431\"><strong data-start=\"1389\" data-end=\"1431\">Những công nghệ nổi bật trong VR Plus:</strong></p><p data-start=\"1296\" data-end=\"1350\"></p><li>Tour 360° Panorama</li><li>Mô hình 3D tương tác</li><li>Bản đồ định vị không gian</li><li>Trải nghiệm đa nền tảng (Web, Mobile, VR Headset)<br><br></li></ul><h2><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><li>Lợi ích của VR Plus đối với Bất động sản<br><br>Đối với lĩnh vực bất động sản, VR Plus giúp <strong data-start=\"1711\" data-end=\"1760\">rút ngắn khoảng cách giữa khách hàng và dự án</strong>. Khách hàng có thể xem chi tiết từng căn hộ, từng không gian, ngay cả khi dự án chưa hoàn thiện ngoài thực tế.<br><br></li></ul></h2><h3 data-start=\"1878\" data-end=\"1903\"><strong data-start=\"1882\" data-end=\"1903\">Trích dẫn (Quote)</strong></h3><h2><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><li>\n<blockquote data-start=\"1904\" data-end=\"2017\">\n<p data-start=\"1906\" data-end=\"2017\">“VR Plus không chỉ là công nghệ, mà là cách kể câu chuyện về không gian một cách trực quan và thuyết phục hơn.”<br><br></p><h2>Ứng dụng thực tế của VR Plus<br><br></h2><p></p></blockquote></li></ul></h2><h3 data-start=\"2088\" data-end=\"2129\"><strong data-start=\"2092\" data-end=\"2129\">Danh sách đánh số (Numbered List)</strong></h3><h2><ul data-start=\"1161\" data-end=\"1350\" style=\"display: inline !important;\"><li><blockquote data-start=\"1904\" data-end=\"2017\"></blockquote></li></ul></h2><h2>\n<span style=\"font-size: inherit; font-weight: inherit;\">Giới thiệu dự án bất động sản cao cấp</span><br><span style=\"font-size: inherit; font-weight: inherit;\">Trưng bày showroom nội thất</span><br><span style=\"font-size: inherit; font-weight: inherit;\">Quảng bá điểm đến du lịch – resort – khách sạn</span><br><span style=\"font-size: inherit; font-weight: inherit;\">Đào tạo, mô phỏng công trình xây dựng<br><br></span><img src=\"http://localhost:8096/uploads/blog/content/1886d505-e355-4a09-acb9-48c8051baa3f.png\"></h2><h2><strong data-start=\"2413\" data-end=\"2462\">VR Plus – Xu hướng tất yếu của trải nghiệm số</strong></h2><ol data-start=\"2130\" data-end=\"2300\">\n</ol></div>', '2026-01-07 19:57:15', '2026-01-08 01:02:25');

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
(4, 4, '/assets/images/tourism_360_tour.png', 'Main View'),
(6, 6, '/assets/images/vr_hero_banner.png', 'Main View'),
(7, 9, '/assets/images/team_collaboration.png', 'Main View'),
(8, 10, '/assets/images/team_collaboration.png', 'Main View'),
(9, 11, '/assets/images/ar_marketing_demo.png', 'Main View'),
(10, 12, '/assets/images/ar_marketing_demo.png', 'Main View'),
(16, 1, '/uploads/gallery/538d1665-9762-4f10-a6e1-b7993cb1707b_da-lat.jpg', 'Detail View'),
(17, 2, '/assets/images/vr_hero_banner.png', 'Detail View'),
(18, 3, '/assets/images/vr_hero_banner.png', 'Detail View'),
(19, 4, '/assets/images/vr_hero_banner.png', 'Detail View'),
(21, 6, '/assets/images/vr_hero_banner.png', 'Detail View'),
(22, 9, '/assets/images/vr_hero_banner.png', 'Detail View'),
(23, 10, '/assets/images/vr_hero_banner.png', 'Detail View'),
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
(50, 11, NULL, 'info', 14.36, -27.53, NULL, 'Biệt Thự Biển', 'Ocean Villa', 'ok', 'ok', 'info', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(52, 11, NULL, 'link_scene', 120.9, -10.78, 1, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(53, 11, NULL, 'url', -50.04, -32.52, NULL, 'Biệt Thự Biển', 'Ocean Villa', 'https://virtual-tour.huce.edu.vn/', 'https://virtual-tour.huce.edu.vn/', 'link', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(54, 11, NULL, 'url', 98.46, -40.24, NULL, '', '', 'https://virtual-tour.huce.edu.vn/', 'https://virtual-tour.huce.edu.vn/', 'link', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(55, 11, NULL, 'link_scene', -141.55, 1.2, 2, '', '', '', '', 'arrow_up', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(56, 1, NULL, 'link_scene', 49.7, -1.38, 11, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(57, 1, NULL, 'link_scene', -61.84, -0.39, 2, '', '', '', '', 'arrow_left', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(58, 1, NULL, 'info', -30.86, 2.76, NULL, 'Biệt Thự Biển', 'Ocean Villa', 'oko', 'oko', 'info', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(59, 2, NULL, 'link_scene', 133.78, -0.98, 3, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(60, 3, NULL, 'link_scene', -150.72, 14.8, 11, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(61, 2, NULL, 'info', -57.3, -1.29, NULL, 'Biệt Thự Biển', 'Ocean Villa', 'Tòa H2', 'Building H2', 'info', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(69, 2, NULL, 'link_scene', 105.67, 3.77, 1, '', '', '', '', 'arrow_right', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0),
(72, 11, NULL, 'link_scene', 110.21, 4.25, 2, '', '', '', '', 'arrow_up', 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, 0);

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
(65, 1, 'd', NULL, NULL, '/uploads/models/web/7851a4c5-548b-47a9-bc45-1a1f12c79398_LangBacHo.glb', NULL, '2025-12-17 16:19:41', NULL, NULL, 'd', 'đ', '/uploads/models/raw/7851a4c5-548b-47a9-bc45-1a1f12c79398_LangBacHo.glb', 'READY_FOR_WEB', '/uploads/models/web/7851a4c5-548b-47a9-bc45-1a1f12c79398_LangBacHo.glb'),
(69, 2, 'Trần Văn Long', NULL, NULL, '/uploads/models/web/a4d164c2-fccf-4385-8424-8374974b9d4a_thapHUCE.glb', NULL, '2026-01-08 03:06:05', NULL, NULL, 'f', 'f', '/uploads/models/raw/a4d164c2-fccf-4385-8424-8374974b9d4a_thapHUCE.glb', 'READY_FOR_WEB', '/uploads/models/web/a4d164c2-fccf-4385-8424-8374974b9d4a_thapHUCE.glb');

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
(1, 'Ocean Villa 3', 'Biệt Thự Biển 3', 'Ocean Villa3 ', 2, 'Da Nang', 'Luxury villa with ocean view.', '', 'Biệt thự sang trọng sát biển với thiết kế hiện đại.', 'Luxury oceanfront villa with modern design.', NULL, '/uploads/projects/thumbnails/10ab9150-6b7f-42f5-9332-94c5206f3902.jpg', 1, 1, 1, 1, '2025-11-26 07:53:15', '2025-12-17 09:03:27'),
(2, 'Luxury Apartment', 'Căn Hộ Cao Cấp', 'Luxury Apartment', 1, 'Hanoi', 'City center apartment.', '', 'Căn hộ trung tâm thành phố.', 'City center apartment.', NULL, '/uploads/projects/thumbnails/4c24e5fd-a47d-4bf8-a52a-740f744d6a45.jpg', 1, 0, 1, 1, '2025-11-26 07:53:15', '2025-12-16 19:46:50'),
(3, 'Ha Long Bay', 'Vịnh Hạ Long', 'Ha Long Bay', 2, 'Quang Ninh', 'Experience the wonder of nature.', '', 'Khám phá kỳ quan thiên nhiên thế giới qua VR.', 'Explore the world natural wonder via VR.', NULL, '/uploads/projects/thumbnails/84de075b-20ea-4117-a7dd-0a56eb4959dd.jpg', 1, 1, 0, 1, '2025-11-26 07:53:15', '2025-12-01 05:50:00'),
(4, 'Son Doong Cave', 'Hang Sơn Đoòng', 'Son Doong Cave', 2, 'Quang Binh', 'Largest cave in the world.', '', 'Hang động lớn nhất thế giới.', 'Largest cave in the world.', NULL, '/uploads/projects/thumbnails/1524a6a2-0b5b-463c-b298-d4d6dda64856.jpg', 1, 1, 1, 1, '2025-11-26 07:53:15', '2025-12-01 05:50:08'),
(5, 'Hue Citadel', 'Hoàng Thành Huế', 'Hue Citadel', 3, 'Hue', 'Historical heritage site.', '', 'Di tích lịch sử cố đô Huế.', 'Historical heritage of the ancient capital Hue.', NULL, '/uploads/projects/thumbnails/876ee528-832b-4ff6-b472-e2f61b5181b8.jpg', 0, 0, 0, 1, '2025-11-26 07:53:15', '2025-12-13 08:01:36'),
(6, 'Temple of Literature', 'Văn Miếu', 'Temple of Literature', 3, 'Hanoi', 'First university of Vietnam.', '', 'Trường đại học đầu tiên của Việt Nam.', 'First university of Vietnam.', NULL, '/uploads/projects/thumbnails/dc7dc489-9f81-445a-9555-f924a65634e3.png', 0, 1, 1, 1, '2025-11-26 07:53:16', '2025-12-01 05:50:42'),
(7, 'Virtual Lab', 'Phòng Thí Nghiệm Ảo', 'Virtual Lab', 4, 'Hanoi', 'Interactive science models.', '', 'Mô hình khoa học tương tác cho học sinh.', 'Interactive science models for students.', NULL, '/uploads/projects/thumbnails/b0cd909d-b21b-4dcc-abfb-9671677eb5d3.png', 1, 0, 0, 0, '2025-11-26 07:53:16', '2025-12-13 08:10:52'),
(8, 'Anatomy Class', 'Lớp Giải Phẫu', 'Anatomy Class', 4, 'Online', '3D Human body models.', '', 'Mô hình cơ thể người 3D.', '3D Human body models.', NULL, '/uploads/projects/thumbnails/fb5dd283-9953-4320-bfcc-d449f947871e.png', 1, 0, 0, 0, '2025-11-26 07:53:16', '2025-12-10 06:26:28'),
(9, 'Smart Factory', 'Nhà Máy Thông Minh', 'Smart Factory', 5, 'Binh Duong', 'Automated production line.', '', 'Dây chuyền sản xuất tự động hóa.', 'Automated production line.', NULL, '/uploads/projects/thumbnails/ff69bce2-9eda-4a54-b151-25056cda5adc.jpg', 0, 1, 0, 1, '2025-11-26 07:53:16', '2025-12-04 19:56:56'),
(10, 'Solar Farm', 'Trang Trại Điện Mặt Trời', 'Solar Farm', 5, 'Ninh Thuan', 'Renewable energy.', '', 'Năng lượng tái tạo.', 'Renewable energy.', NULL, '/uploads/projects/thumbnails/808c7ee8-08a0-44c4-a65c-cfe1474a5ca5.jpg', 0, 1, 1, 1, '2025-11-26 07:53:16', '2025-12-09 08:21:15'),
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
(1, 1, 'Living Room', 'Phòng Khách 1', 'Living Room 1', '/uploads/scenes/8d12751d-aaaa-4059-92d7-f14a2afef6ef_1.jpg', 0, 0, 0),
(2, 1, 'Kitchen', 'Nhà Bếp', 'Kitchen', '/uploads/scenes/cfe2af2a-1479-4e2f-8322-3586018fac75_HaLong.jpg', 1, 90, 0),
(3, 1, 'Balcony', 'Ban Công', 'Balcony', '/uploads/scenes/33fa5ac6-7081-476f-96ff-9cc8df5c3467_NhaTho.jpg', 2, 180, -10),
(5, 3, 'Cave Interior', 'Bên Trong Hang', 'Cave Interior', '/api/files/8cca4888-73d7-418a-95c2-019763283e7b_DongThienCung.jpg', 1, 45, 5),
(6, 4, 'Entrance', 'Lối Vào', 'Entrance', '/assets/images/tourism_360_tour.png', 0, 0, 0),
(7, 4, 'Main Chamber', 'Phòng Chính', 'Main Chamber', '/assets/images/tourism_360_tour.png', 1, 0, 10),
(8, 4, 'Underground River', 'Sông Ngầm', 'Underground River', '/assets/images/tourism_360_tour.png', 2, 90, -5),
(9, 6, 'Main Gate', 'Cổng Chính', 'Main Gate', '/assets/images/vr_hero_banner.png', 0, 0, 0),
(11, 1, 'Nữ thần tự do', 'Nữ thần tự do', 'Nu than tu do', '/uploads/scenes/b8dff400-dfbd-417d-97e9-dde0088f9b2d_NuThanTudo.jpg', 3, 0, 0),
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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT cho bảng `models_3d`
--
ALTER TABLE `models_3d`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT cho bảng `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `scenes`
--
ALTER TABLE `scenes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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
