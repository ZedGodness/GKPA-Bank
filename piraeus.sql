-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2026 at 03:26 PM
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
-- Database: `piraeus`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `IBAN` varchar(22) NOT NULL,
  `owner` varchar(10) NOT NULL,
  `type` enum('разплащателна','спестовна','','') NOT NULL,
  `balance` float(10,2) NOT NULL,
  `payment_limit` float(7,2) NOT NULL,
  `currency` enum('EUR','USD') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`IBAN`, `owner`, `type`, `balance`, `payment_limit`, `currency`) VALUES
('PRB001', '1234567891', 'разплащателна', 460.00, 1000.00, 'EUR'),
('PRB002', '9910121414', 'разплащателна', 200.00, 1000.00, 'EUR');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `IBAN_sender` varchar(22) NOT NULL,
  `IBAN_receiver` varchar(22) NOT NULL,
  `amount` float(10,2) NOT NULL,
  `currency` varchar(3) NOT NULL,
  `reason` varchar(100) NOT NULL,
  `dateTime` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`IBAN_sender`, `IBAN_receiver`, `amount`, `currency`, `reason`, `dateTime`) VALUES
('PRB001', 'PRB002', 100.00, 'EUR', 'Превод на 100 евро.', '2026-04-02 11:46:44'),
('PRB002', 'PRB001', 50.00, 'EUR', 'Превод на 50 евро.', '2026-04-02 11:48:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `EGN` varchar(10) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(60) NOT NULL,
  `phoneNumber` varchar(10) NOT NULL,
  `address` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`EGN`, `firstName`, `lastName`, `email`, `phoneNumber`, `address`) VALUES
('1234567891', 'Иван', 'Иванов', 'ivan.ivanov91@gmail.com', '0891234567', 'гр. Русе, ул. \"Пирин\" 6'),
('9910121414', 'Кирил', 'Венелинов', 'kiril.venelinov99@gmail.com', '0889765432', 'гр. Свищов, ул. \"Цар Освободител\" 27');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`IBAN`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`EGN`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `users` (`EGN`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
