-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2026 at 09:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jewelry`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `items`, `created_at`) VALUES
(46, 4, '[{\"item_id\":5,\"quantity\":11,\"price\":2500},{\"item_id\":4,\"quantity\":6,\"price\":320},{\"item_id\":6,\"quantity\":2,\"price\":12000},{\"item_id\":8,\"quantity\":1,\"price\":400}]', '2025-12-28 18:56:22');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(4, 'Bracelets'),
(2, 'Earrings'),
(3, 'Necklaces'),
(1, 'Rings');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `created_at`) VALUES
(1, 'jjj', 'raneenchehadi@gmail.com', '71987654', 'Custom Design Inquiry', 'gfdcde', '2025-12-27 15:41:50'),
(2, 'raneen', 'raneenchehadi@gmail.com', 'jjjjj', 'Product Question', 'hhhhhhh', '2025-12-27 15:46:14'),
(3, 'raneen', 'raneenchehadi@gmail.com', '76534232667', 'Product Question', 'hii', '2026-01-02 19:31:53');

-- --------------------------------------------------------

--
-- Table structure for table `jewelry_items`
--

CREATE TABLE `jewelry_items` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jewelry_items`
--

INSERT INTO `jewelry_items` (`id`, `name`, `description`, `price`, `image_url`, `stock`, `category_id`, `created_at`) VALUES
(1, 'Diamond Ring', '18K white gold with 1ct diamond', 1200.00, 'diamond.jpg', -1, 1, '2025-12-25 22:59:40'),
(2, 'Emerald Ring', 'Classic 14K gold chain', 850.00, 'emerald.jpg', -2, 1, '2025-12-25 22:59:40'),
(3, 'Ruby Ring', 'Freshwater ruby studs', 1500.00, 'ruby.jpg', -4, 1, '2025-12-25 22:59:40'),
(4, 'Pearl Earrings', 'Blue sapphire & silver', 320.00, 'pearl.jpg', 9, 2, '2025-12-25 22:59:40'),
(5, 'Hoop Earrings', 'Hoop earrings', 2500.00, 'hoop.jpg', 5, 2, '2025-12-25 22:59:40'),
(6, 'Tiffany Earrings', 'Tiffany-style luxury earrings', 12000.00, 'tiffany.jpg', 10, 2, '2025-12-25 22:59:40'),
(7, 'Emerald Necklace', 'Green emerald pendant necklace', 14000.00, 'emeraldnecklace.jpg', 8, 3, '2025-12-25 22:59:40'),
(8, 'Gemstone Heart Necklace', 'Gemstone heart pendant', 400.00, 'gemstoneheart.jpg', 9, 3, '2025-12-25 22:59:40'),
(9, 'Aquamarine and Diamond Necklace', 'Aquamarine and diamond necklace', 1200.00, 'aquamarine.jpg', 9, 3, '2025-12-25 22:59:40');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `email`, `created_at`, `is_active`) VALUES
(1, 'raneen.shehadi@gmail.com', '2026-01-01 22:44:54', 1),
(2, 'h.sh@gmail.com', '2026-01-02 01:06:06', 1),
(3, 'nour.m@gmail.com', '2026-01-02 15:33:08', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` enum('cod','card') DEFAULT 'cod',
  `location` enum('showroom','delivery') DEFAULT 'showroom',
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `created_at`, `payment_method`, `location`, `full_name`, `phone`, `address`, `city`, `postal_code`) VALUES
(1, 2, 850.00, 'pending', '2025-12-27 00:13:03', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(2, 2, 3200.00, 'pending', '2025-12-27 00:25:45', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(3, 2, 2350.00, 'pending', '2025-12-27 00:26:33', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(4, 2, 1200.00, 'pending', '2025-12-27 00:30:45', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(5, 4, 3750.00, 'pending', '2025-12-27 12:05:28', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(6, 4, 1200.00, 'pending', '2025-12-27 12:24:00', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(7, 4, 1200.00, 'pending', '2025-12-27 12:32:52', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(8, 4, 2670.00, 'pending', '2025-12-27 13:05:36', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(9, 4, 16500.00, 'pending', '2025-12-27 13:07:28', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(10, 4, 2050.00, 'pending', '2025-12-27 13:18:55', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(11, 2, 6800.00, 'pending', '2025-12-27 15:45:49', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(12, 4, 3000.00, 'pending', '2025-12-28 12:02:36', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(13, 4, 1500.00, 'pending', '2025-12-28 12:09:19', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(14, 4, 9000.00, 'pending', '2025-12-28 12:21:27', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(15, 4, 26300.00, 'pending', '2025-12-28 18:30:23', 'cod', 'showroom', NULL, NULL, NULL, NULL, NULL),
(16, 2, 850.00, 'pending', '2026-01-01 22:54:21', 'cod', 'showroom', 'raneen', '70-123456789', NULL, NULL, NULL),
(17, 2, 13500.00, 'pending', '2026-01-02 01:04:33', 'cod', 'showroom', 'raneen', '70-123456789', NULL, NULL, NULL),
(18, 2, 850.00, 'pending', '2026-01-02 12:31:24', 'cod', 'showroom', 'rrr', '76534232667', NULL, NULL, NULL),
(19, 2, 850.00, 'pending', '2026-01-02 19:33:35', 'cod', 'delivery', 'rrr', '76534232667', 'bekaa', 'bekaa', '0000'),
(20, 3, 850.00, 'pending', '2026-01-03 15:14:15', 'cod', 'showroom', 'raneen', '70-123456789', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_time` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_id`, `quantity`, `price_at_time`) VALUES
(1, 1, 2, 1, 850.00),
(2, 2, 2, 2, 850.00),
(3, 2, 3, 1, 1500.00),
(4, 3, 2, 1, 850.00),
(5, 3, 3, 1, 1500.00),
(6, 4, 1, 1, 1200.00),
(7, 5, 2, 1, 850.00),
(8, 5, 5, 1, 2500.00),
(9, 5, 8, 1, 400.00),
(10, 6, 1, 1, 1200.00),
(11, 7, 1, 1, 1200.00),
(12, 8, 2, 1, 850.00),
(13, 8, 3, 1, 1500.00),
(14, 8, 4, 1, 320.00),
(15, 9, 5, 1, 2500.00),
(16, 9, 7, 1, 14000.00),
(17, 10, 1, 1, 1200.00),
(18, 10, 2, 1, 850.00),
(19, 11, 2, 2, 850.00),
(20, 11, 1, 3, 1200.00),
(21, 11, 3, 1, 1500.00),
(22, 12, 3, 2, 1500.00),
(23, 13, 3, 1, 1500.00),
(24, 14, 3, 6, 1500.00),
(25, 15, 1, 3, 1200.00),
(26, 15, 5, 3, 2500.00),
(27, 15, 9, 1, 1200.00),
(28, 15, 7, 1, 14000.00),
(29, 16, 2, 1, 850.00),
(30, 17, 6, 1, 12000.00),
(31, 17, 3, 1, 1500.00),
(32, 18, 2, 1, 850.00),
(33, 19, 2, 1, 850.00),
(34, 20, 2, 1, 850.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('client','admin') DEFAULT 'client'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `role`) VALUES
(1, 'Raneen', 'raneen@example.com', '$2a$10$examplehash', '2025-12-25 22:58:21', 'client'),
(2, 'raneen', 'raneen.shehadi@gmail.com', '$2b$10$ttKlwMNNpFoJwVUE4YfTi.2kAuK1hlRuQrG8myMoSKD3hG3/y/PyS', '2025-12-26 12:49:27', 'client'),
(3, 'haneen', 'h.sh@gmail.com', '$2b$10$SoKHk/rZ7z/1pl1lsgX00u8ChFfb7c1YUZGmk0b9qhywUFAB16r9i', '2025-12-26 21:30:04', 'client'),
(4, 'nour', 'nour.m@gmail.com', '$2b$10$tVHawXrWHKLmbE4HoslfU.dxplkST89crYhfbp019L4GSw5yDYjGy', '2025-12-27 12:04:25', 'client'),
(5, 'admin', 'admin@lustreva.com', '$2b$10$eLA7LEgWKW5NhO8/Mo7zhulr34YUEXGfpo/wYu2oGaB/BfAhluI1y', '2025-12-28 23:42:27', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `item_id`, `created_at`) VALUES
(4, 2, 3, '2026-01-02 01:02:35'),
(6, 2, 1, '2026-01-02 12:30:42'),
(8, 2, 5, '2026-01-02 12:34:13'),
(10, 3, 2, '2026-01-03 15:13:54'),
(11, 3, 1, '2026-01-03 15:37:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jewelry_items`
--
ALTER TABLE `jewelry_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_item` (`user_id`,`item_id`),
  ADD KEY `item_id` (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jewelry_items`
--
ALTER TABLE `jewelry_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jewelry_items`
--
ALTER TABLE `jewelry_items`
  ADD CONSTRAINT `jewelry_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `jewelry_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `jewelry_items` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
