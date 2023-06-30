-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2023 at 11:02 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `member1` varchar(50) DEFAULT NULL,
  `member2` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`id`, `member1`, `member2`) VALUES
(3, 'rahul111', 'jeeva123'),
(8, 'rahul111', 'aniket456'),
(13, 'jeeva123', 'krish777'),
(15, 'krish777', 'aniket456'),
(17, 'rahul111', 'krish777');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `conversationid` int(11) DEFAULT NULL,
  `senderid` varchar(255) DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`conversationid`, `senderid`, `text`, `created_at`) VALUES
(8, 'rahul111', 'how you doing?', '2023-06-30 19:14:50'),
(8, 'aniket456', 'im fine? how about you', '2023-06-30 19:15:26'),
(15, 'aniket456', 'kya?', '2023-06-30 19:21:26'),
(15, 'krish777', 'ghare', '2023-06-30 19:21:47'),
(8, 'rahul111', 'i am heaving a busy day', '2023-06-30 20:19:11'),
(8, 'rahul111', 'asd', '2023-06-30 20:20:51'),
(8, 'rahul111', 'sdf', '2023-06-30 20:23:04'),
(8, 'rahul111', 'we', '2023-06-30 20:39:47'),
(8, 'aniket456', 'we', '2023-06-30 20:39:48'),
(17, 'rahul111', 'hi krish', '2023-06-30 20:58:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `firstname`, `lastname`, `email`) VALUES
('aniket456', 'aniket', 'menat', 'aniket456@gmail.com'),
('jeeva123', 'jeeva', '', 'jeeva@gmail.com'),
('krish777', 'krish', 'menat', 'krish777@gmail.com'),
('rahul111', 'rahul', 'shingala', 'rahul@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
