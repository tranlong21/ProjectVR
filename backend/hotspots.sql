-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 06, 2025 lúc 05:49 PM
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
-- Cấu trúc bảng cho bảng `hotspots`
--

CREATE TABLE `hotspots` (
  `id` bigint(20) NOT NULL,
  `scene_id` bigint(20) NOT NULL,
  `model_id` bigint(20) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `yaw` float NOT NULL,
  `pitch` float NOT NULL,
  `target_scene_id` bigint(20) DEFAULT NULL,
  `title_vi` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `description_vi` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `x` float DEFAULT NULL,
  `y` float DEFAULT NULL,
  `z` float DEFAULT NULL,
  `camera_pos_x` float DEFAULT NULL,
  `camera_pos_y` float DEFAULT NULL,
  `camera_pos_z` float DEFAULT NULL,
  `camera_target_x` float DEFAULT NULL,
  `camera_target_y` float DEFAULT NULL,
  `camera_target_z` float DEFAULT NULL,
  `extra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extra`)),
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hotspots`
--

INSERT INTO `hotspots` (`id`, `scene_id`, `model_id`, `type`, `yaw`, `pitch`, `target_scene_id`, `title_vi`, `title_en`, `description_vi`, `description_en`, `icon`, `x`, `y`, `z`, `camera_pos_x`, `camera_pos_y`, `camera_pos_z`, `camera_target_x`, `camera_target_y`, `camera_target_z`, `extra`, `order_id`) VALUES
(1, 1, NULL, 'link_scene', 90, 0, 2, 'Đến Nhà Bếp', 'Go to Kitchen', 'Di chuyển đến khu vực nhà bếp', 'Move to the kitchen area', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, NULL, 'link_scene', 180, -10, 3, 'Đến Ban Công', 'Go to Balcony', 'Khám phá ban công với view biển', 'Explore the balcony with ocean view', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, NULL, 'info', -45, 5, NULL, 'Sofa Cao Cấp', 'Luxury Sofa', 'Sofa da Ý nhập khẩu', 'Imported Italian leather sofa', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 2, NULL, 'link_scene', -90, 0, 1, 'Quay lại Phòng Khách', 'Back to Living Room', 'Quay lại phòng khách', 'Return to living room', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 2, NULL, 'info', 0, -15, NULL, 'Bếp Thông Minh', 'Smart Kitchen', 'Hệ thống bếp thông minh tích hợp IoT', 'IoT-integrated smart kitchen system', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 3, NULL, 'link_scene', 0, 10, 1, 'Quay lại Phòng Khách', 'Back to Living Room', 'Quay lại phòng khách', 'Return to living room', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 3, NULL, 'info', 90, -20, NULL, 'View Biển', 'Ocean View', 'Tầm nhìn ra biển tuyệt đẹp', 'Stunning ocean view', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 4, NULL, 'link_scene', 120, 15, 5, 'Vào Hang Động', 'Enter the Cave', 'Khám phá bên trong hang động', 'Explore inside the cave', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 4, NULL, 'info', -60, 0, NULL, 'Vịnh Hạ Long', 'Ha Long Bay', 'Di sản thiên nhiên thế giới UNESCO', 'UNESCO World Natural Heritage', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 4, NULL, 'url', 180, -10, NULL, 'Tìm hiểu thêm', 'Learn More', 'https://whc.unesco.org/en/list/672/', 'https://whc.unesco.org/en/list/672/', 'link', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 5, NULL, 'link_scene', -120, -15, 4, 'Ra Boong Tàu', 'Exit to Deck', 'Quay lại boong tàu', 'Return to cruise deck', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 5, NULL, 'info', 45, 20, NULL, 'Thạch Nhũ', 'Stalactites', 'Thạch nhũ hình thành hàng nghìn năm', 'Stalactites formed over thousands of years', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 6, NULL, 'link_scene', 0, 10, 7, 'Vào Phòng Chính', 'Enter Main Chamber', 'Di chuyển vào phòng chính', 'Move to main chamber', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 6, NULL, 'info', -90, 0, NULL, 'Hang Lớn Nhất Thế Giới', 'World\'s Largest Cave', 'Sơn Đoòng - Hang động lớn nhất hành tinh', 'Son Doong - The world\'s largest cave', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 7, NULL, 'link_scene', 180, -10, 6, 'Quay lại Lối Vào', 'Back to Entrance', 'Quay lại lối vào', 'Return to entrance', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 7, NULL, 'link_scene', 90, -5, 8, 'Đến Sông Ngầm', 'Go to Underground River', 'Khám phá sông ngầm', 'Explore the underground river', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 7, NULL, 'info', 0, 35, NULL, 'Hệ Sinh Thái Hang', 'Cave Ecosystem', 'Hệ sinh thái độc đáo bên trong hang', 'Unique ecosystem inside the cave', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 8, NULL, 'link_scene', -90, 5, 7, 'Quay lại Phòng Chính', 'Back to Main Chamber', 'Quay lại phòng chính', 'Return to main chamber', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 8, NULL, 'info', 90, -15, NULL, 'Dòng Sông Ngầm', 'Underground Stream', 'Dòng sông ngầm chảy qua hang', 'Underground stream flowing through cave', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 9, NULL, 'link_scene', 0, 0, NULL, 'Vào Sân Trong', 'Enter Courtyard', 'Di chuyển vào sân trong', 'Move to the courtyard', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 9, NULL, 'info', -45, 10, NULL, 'Văn Miếu Quốc Tử Giám', 'Temple of Literature', 'Trường đại học đầu tiên của Việt Nam', 'Vietnam\'s first university', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 11, NULL, 'info', 0, 0, NULL, 'Biệt Thự Biển', 'ocen', 'ok đẹp', 'oks', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 11, NULL, 'link_scene', 0, -96, 2, '', '', '', '', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 16, NULL, 'link_scene', 0, 0, 5, '', '', '', '', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, 16, NULL, 'link_scene', 120, -95, 4, '', '', '', '', 'arrow', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scene_id` (`scene_id`),
  ADD KEY `target_scene_id` (`target_scene_id`),
  ADD KEY `fk_hotspot_model` (`model_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `hotspots`
--
ALTER TABLE `hotspots`
  ADD CONSTRAINT `fk_hotspot_model` FOREIGN KEY (`model_id`) REFERENCES `models_3d` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hotspots_ibfk_1` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hotspots_ibfk_2` FOREIGN KEY (`target_scene_id`) REFERENCES `scenes` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
