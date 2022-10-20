-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2022 at 09:51 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

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
  `date_assets` datetime NOT NULL,
  `expire_hour` bigint(20) NOT NULL,
  `remain_time` bigint(20) NOT NULL,
  `maitanent` tinyint(1) NOT NULL,
  `status_assets` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`id_assets`, `name_assets`, `date_assets`, `expire_hour`, `remain_time`, `maitanent`, `status_assets`) VALUES
(1, 'อุปกรณ์1', '2022-10-20 14:49:59', 36000000, 36000000, 0, 'active'),
(2, 'test', '2022-10-20 22:35:43', 20, 40, 0, 'enable');

-- --------------------------------------------------------

--
-- Table structure for table `estimate_time`
--

CREATE TABLE `estimate_time` (
  `id_estimate` int(11) NOT NULL,
  `mac_address` varchar(45) NOT NULL,
  `id_assets` int(11) NOT NULL,
  `used_time` bigint(20) NOT NULL COMMENT 'miliseconde'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `maintanent_assets`
--

CREATE TABLE `maintanent_assets` (
  `id_maintanent` int(11) NOT NULL,
  `id_assets` int(11) NOT NULL,
  `date_matanent` datetime NOT NULL,
  `status_maintanent` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `match`
--

CREATE TABLE `match` (
  `id_match` int(11) NOT NULL,
  `id_assets` int(11) NOT NULL,
  `mac_address` varchar(45) NOT NULL,
  `status` varchar(45) NOT NULL,
  `active_datetime` datetime NOT NULL,
  `room` varchar(255) NOT NULL,
  `floor` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `node`
--

CREATE TABLE `node` (
  `mac_address` varchar(45) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `date_node` datetime NOT NULL,
  `status_node` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `node`
--

INSERT INTO `node` (`mac_address`, `ip`, `date_node`, `status_node`) VALUES
('4C:75:25:36:9D:D9', '192.168.43.207', '2022-10-20 22:19:07', 'enable');

-- --------------------------------------------------------

--
-- Table structure for table `node_transaction`
--

CREATE TABLE `node_transaction` (
  `id_txn` int(11) NOT NULL,
  `mac_address` varchar(45) NOT NULL,
  `id_assets` int(11) NOT NULL,
  `status_action` varchar(45) NOT NULL COMMENT 'on, off,running',
  `datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `role` varchar(45) NOT NULL,
  `departure` varchar(45) NOT NULL,
  `status_user` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_match`
--

CREATE TABLE `user_match` (
  `id_user_match` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `mac_address` int(11) NOT NULL,
  `id_assets` int(11) NOT NULL,
  `room` varchar(45) NOT NULL,
  `floor` varchar(45) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `datetime` datetime NOT NULL,
  `sum_used_time` bigint(20) NOT NULL,
  `status` varchar(45) NOT NULL
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
-- Indexes for table `estimate_time`
--
ALTER TABLE `estimate_time`
  ADD PRIMARY KEY (`id_estimate`);

--
-- Indexes for table `maintanent_assets`
--
ALTER TABLE `maintanent_assets`
  ADD PRIMARY KEY (`id_maintanent`),
  ADD KEY `FK_assets_maintanent` (`id_assets`);

--
-- Indexes for table `match`
--
ALTER TABLE `match`
  ADD PRIMARY KEY (`id_match`),
  ADD KEY `FK_assets` (`id_assets`),
  ADD KEY `FK_node` (`mac_address`);

--
-- Indexes for table `node`
--
ALTER TABLE `node`
  ADD PRIMARY KEY (`mac_address`);

--
-- Indexes for table `node_transaction`
--
ALTER TABLE `node_transaction`
  ADD PRIMARY KEY (`id_txn`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- Indexes for table `user_match`
--
ALTER TABLE `user_match`
  ADD PRIMARY KEY (`id_user_match`),
  ADD KEY `FK_users` (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `id_assets` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `estimate_time`
--
ALTER TABLE `estimate_time`
  MODIFY `id_estimate` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `maintanent_assets`
--
ALTER TABLE `maintanent_assets`
  MODIFY `id_maintanent` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `match`
--
ALTER TABLE `match`
  MODIFY `id_match` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `node_transaction`
--
ALTER TABLE `node_transaction`
  MODIFY `id_txn` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_match`
--
ALTER TABLE `user_match`
  MODIFY `id_user_match` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `maintanent_assets`
--
ALTER TABLE `maintanent_assets`
  ADD CONSTRAINT `FK_assets_maintanent` FOREIGN KEY (`id_assets`) REFERENCES `assets` (`id_assets`);

--
-- Constraints for table `match`
--
ALTER TABLE `match`
  ADD CONSTRAINT `FK_assets` FOREIGN KEY (`id_assets`) REFERENCES `assets` (`id_assets`),
  ADD CONSTRAINT `FK_node` FOREIGN KEY (`mac_address`) REFERENCES `node` (`mac_address`);

--
-- Constraints for table `user_match`
--
ALTER TABLE `user_match`
  ADD CONSTRAINT `FK_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
