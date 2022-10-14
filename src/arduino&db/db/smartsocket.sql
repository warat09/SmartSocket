-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2022 at 03:27 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 7.4.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartsocket`
--

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id_assets` int(11) NOT NULL,
  `name_assets` varchar(45) NOT NULL,
  `time_limit` time DEFAULT NULL,
  `time_remain` time DEFAULT NULL,
  `maintanent` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`id_assets`, `name_assets`, `time_limit`, `time_remain`, `maintanent`) VALUES
(1, 'คอม', NULL, NULL, 0),
(2, 'ปลั๊ก', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `matching`
--

CREATE TABLE `matching` (
  `id_matching` int(11) NOT NULL,
  `id_assets` int(11) NOT NULL,
  `mac_address` varchar(45) NOT NULL,
  `floor` varchar(45) NOT NULL,
  `room` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `matching`
--

INSERT INTO `matching` (`id_matching`, `id_assets`, `mac_address`, `floor`, `room`, `status`) VALUES
(1, 1, 'BC:FF:4D:3A:0D:AB', '3', '4', 'rent'),
(2, 2, '4C:75:25:36:9D:D9', '3', '4', 'rent');

-- --------------------------------------------------------

--
-- Table structure for table `nodes`
--

CREATE TABLE `nodes` (
  `mac_address` varchar(45) NOT NULL,
  `ip_protocol` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `nodes`
--

INSERT INTO `nodes` (`mac_address`, `ip_protocol`) VALUES
('4C:75:25:36:9D:D9', '192.168.43.207'),
('BC:FF:4D:3A:0D:AB', '192.168.43.41');

-- --------------------------------------------------------

--
-- Table structure for table `rent`
--

CREATE TABLE `rent` (
  `id_rent` int(11) NOT NULL,
  `date_time_rent` datetime NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_matching` int(11) NOT NULL,
  `date_time_return` datetime NOT NULL,
  `date_time_approve` datetime NOT NULL,
  `floor` varchar(45) NOT NULL,
  `room` varchar(45) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `description_admin` varchar(45) DEFAULT NULL,
  `approve` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `transection`
--

CREATE TABLE `transection` (
  `id_transection` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `id_matching` int(11) NOT NULL,
  `date_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `transection`
--

INSERT INTO `transection` (`id_transection`, `status`, `id_matching`, `date_time`) VALUES
(1, 'ON', 2, '2022-10-07 19:48:26'),
(2, 'OFF', 2, '2022-10-07 19:49:31'),
(3, 'ON', 2, '2022-10-13 14:55:12'),
(4, 'OFF', 2, '2022-10-13 14:59:54'),
(5, 'ON', 2, '2022-10-13 15:00:39'),
(6, 'OFF', 2, '2022-10-13 15:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `surname` varchar(45) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `role` varchar(20) NOT NULL,
  `department` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id_assets`);

--
-- Indexes for table `matching`
--
ALTER TABLE `matching`
  ADD PRIMARY KEY (`id_matching`),
  ADD KEY `FK_assets` (`id_assets`),
  ADD KEY `FK_mac_address` (`mac_address`);

--
-- Indexes for table `nodes`
--
ALTER TABLE `nodes`
  ADD PRIMARY KEY (`mac_address`);

--
-- Indexes for table `rent`
--
ALTER TABLE `rent`
  ADD PRIMARY KEY (`id_rent`),
  ADD KEY `FK_users` (`id_user`),
  ADD KEY `FK_matching` (`id_matching`);

--
-- Indexes for table `transection`
--
ALTER TABLE `transection`
  ADD PRIMARY KEY (`id_transection`),
  ADD KEY `FK_matching` (`id_matching`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `id_assets` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `matching`
--
ALTER TABLE `matching`
  MODIFY `id_matching` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `rent`
--
ALTER TABLE `rent`
  MODIFY `id_rent` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transection`
--
ALTER TABLE `transection`
  MODIFY `id_transection` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
