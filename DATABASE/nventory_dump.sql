-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 01, 2025 at 02:42 PM
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
-- Database: `nventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `articleID` int(11) NOT NULL,
  `shelfID` int(11) NOT NULL,
  `articleName` varchar(255) NOT NULL,
  `articleInformation` text NOT NULL,
  `articleAmount` int(11) NOT NULL,
  `articlePrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`articleID`, `shelfID`, `articleName`, `articleInformation`, `articleAmount`, `articlePrice`) VALUES
(1, 1, 'PS5 - SLIM', 'neues Modell v1.5', 20, 419.99),
(2, 1, 'Widget B', 'Blue Widget B', 55, 49.99),
(3, 2, 'Gadget X', 'Special edition Gadget', 20, 69.99),
(4, 3, 'Spare Part', 'For backup warehouse', 200, 119.99),
(5, 1, 'Widget A', 'First batch of Widget A', 100, 4.99),
(6, 1, 'IPhone 16', 'Minimale gebrauchsspuren, 256GB Speicher, 8GB Arbeitsspeicher, Apple AI', 4, 649.99);

-- --------------------------------------------------------

--
-- Table structure for table `articleTransactions`
--

CREATE TABLE `articleTransactions` (
  `transactionID` int(11) NOT NULL,
  `articleID` int(11) NOT NULL,
  `transactionPrice` decimal(10,2) NOT NULL,
  `transactionAmount` int(11) NOT NULL,
  `transactionTimestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `transactionType` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articleTransactions`
--

INSERT INTO `articleTransactions` (`transactionID`, `articleID`, `transactionPrice`, `transactionAmount`, `transactionTimestamp`, `transactionType`) VALUES
(7, 1, 399.00, 6, '2025-06-27 08:03:00', 'in'),
(8, 1, 389.00, 2, '2025-06-26 08:03:00', 'in'),
(9, 2, 45.00, 10, '2025-06-26 09:03:00', 'in'),
(10, 2, 52.00, 3, '2025-06-27 09:03:00', 'in'),
(11, 3, 75.00, 3, '2025-06-27 10:03:00', 'in'),
(12, 3, 67.00, 5, '2025-06-26 10:03:00', 'in'),
(13, 4, 99.99, 20, '2025-06-27 10:03:00', 'in'),
(14, 4, 119.99, 2, '2025-06-26 10:03:00', 'in'),
(15, 5, 4.99, 5, '2025-06-27 10:03:00', 'in'),
(16, 5, 5.99, 1, '2025-06-26 10:03:00', 'in'),
(17, 6, 600.00, 20, '2025-06-27 10:03:00', 'in'),
(18, 6, 649.99, 1, '2025-06-26 10:03:00', 'in'),
(19, 1, 499.99, 2, '2025-06-27 11:03:00', 'out'),
(20, 1, 479.99, 2, '2025-06-26 12:03:00', 'out'),
(21, 2, 59.99, 3, '2025-06-27 09:03:00', 'out'),
(22, 2, 59.99, 1, '2025-06-28 09:03:00', 'out'),
(23, 3, 99.99, 2, '2025-06-29 10:03:00', 'out'),
(24, 3, 89.99, 4, '2025-06-29 10:03:00', 'out'),
(25, 4, 169.99, 1, '2025-06-30 10:03:00', 'out'),
(26, 4, 169.99, 3, '2025-06-30 10:03:00', 'out'),
(27, 5, 9.99, 2, '2025-07-01 10:03:00', 'out'),
(28, 5, 8.99, 6, '2025-07-01 10:03:00', 'out'),
(29, 6, 699.99, 1, '2025-07-01 10:03:00', 'out'),
(30, 6, 679.99, 5, '2025-07-01 10:03:00', 'out');

-- --------------------------------------------------------

--
-- Table structure for table `shelf`
--

CREATE TABLE `shelf` (
  `shelfID` int(11) NOT NULL,
  `warehouseID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shelf`
--

INSERT INTO `shelf` (`shelfID`, `warehouseID`) VALUES
(1, 1),
(2, 1),
(3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` int(11) NOT NULL,
  `warehouseID` int(11) DEFAULT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `company` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `warehouseID`, `firstname`, `lastname`, `company`, `email`, `username`, `password`, `status`) VALUES
(6, 1, 'TestUser', 'TestUser', 'Test company', 'test@test.at', 'testUser', '$2b$10$G7s6ZNYhQKAJI6ga4V6Qwux.fMJyqsFWMfRSR6OeemNIgTdc.XwGS', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_warehouse`
--

CREATE TABLE `user_warehouse` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `warehouseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `warehouse`
--

CREATE TABLE `warehouse` (
  `warehouseID` int(11) NOT NULL,
  `warehouseName` varchar(255) NOT NULL,
  `warehouseLocation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouse`
--

INSERT INTO `warehouse` (`warehouseID`, `warehouseName`, `warehouseLocation`) VALUES
(1, 'Main Storage', 'Wien');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`articleID`),
  ADD KEY `FK_a9e2368ee2b5cf75e9363cd07c3` (`shelfID`);

--
-- Indexes for table `articleTransactions`
--
ALTER TABLE `articleTransactions`
  ADD PRIMARY KEY (`transactionID`),
  ADD KEY `FK_5d17bcc822b0e0f443122d89f23` (`articleID`);

--
-- Indexes for table `shelf`
--
ALTER TABLE `shelf`
  ADD PRIMARY KEY (`shelfID`),
  ADD KEY `FK_50d074cb1a613cd3923b27590f2` (`warehouseID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD KEY `FK_889463ada2cbb15c0d5c2de9e4c` (`warehouseID`);

--
-- Indexes for table `user_warehouse`
--
ALTER TABLE `user_warehouse`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_12deaa771d36f6bfbd149d86820` (`userId`),
  ADD KEY `FK_b3068d6cad746b2db02f200316e` (`warehouseId`);

--
-- Indexes for table `warehouse`
--
ALTER TABLE `warehouse`
  ADD PRIMARY KEY (`warehouseID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `articleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `articleTransactions`
--
ALTER TABLE `articleTransactions`
  MODIFY `transactionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `shelf`
--
ALTER TABLE `shelf`
  MODIFY `shelfID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_warehouse`
--
ALTER TABLE `user_warehouse`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `warehouse`
--
ALTER TABLE `warehouse`
  MODIFY `warehouseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `FK_a9e2368ee2b5cf75e9363cd07c3` FOREIGN KEY (`shelfID`) REFERENCES `shelf` (`shelfID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `articleTransactions`
--
ALTER TABLE `articleTransactions`
  ADD CONSTRAINT `FK_5d17bcc822b0e0f443122d89f23` FOREIGN KEY (`articleID`) REFERENCES `article` (`articleID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `shelf`
--
ALTER TABLE `shelf`
  ADD CONSTRAINT `FK_50d074cb1a613cd3923b27590f2` FOREIGN KEY (`warehouseID`) REFERENCES `warehouse` (`warehouseID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_889463ada2cbb15c0d5c2de9e4c` FOREIGN KEY (`warehouseID`) REFERENCES `warehouse` (`warehouseID`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `user_warehouse`
--
ALTER TABLE `user_warehouse`
  ADD CONSTRAINT `FK_12deaa771d36f6bfbd149d86820` FOREIGN KEY (`userId`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b3068d6cad746b2db02f200316e` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse` (`warehouseID`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
