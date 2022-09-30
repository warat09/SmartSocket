-- phpMyAdmin SQL Dump
-- version 5.3.0-dev+20220928.000bf397a4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2022 at 10:04 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.4

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
-- Table structure for table `macaddress`
--

CREATE TABLE `macaddress` (
  `MAC_ID` int(4) NOT NULL,
  `MAC_ADDRESS` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `macaddress`
--

INSERT INTO `macaddress` (`MAC_ID`, `MAC_ADDRESS`) VALUES
(1, '4C:75:25:36:9D:D9'),
(2, '4C:75:25:36:9D:D9'),
(3, '4C:75:25:36:9D:D9'),
(4, '4C:75:25:36:9D:D9'),
(5, '4C:75:25:36:9D:D9'),
(6, '4C:75:25:36:9D:D9');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `macaddress`
--
ALTER TABLE `macaddress`
  ADD PRIMARY KEY (`MAC_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `macaddress`
--
ALTER TABLE `macaddress`
  MODIFY `MAC_ID` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
