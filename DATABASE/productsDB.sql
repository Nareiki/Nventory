-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 26. Apr 2025 um 22:29
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `productsDB`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Artikel`
--

CREATE TABLE `Artikel` (
  `Artikelnummer` int(11) NOT NULL,
  `Produktname` varchar(50) NOT NULL,
  `Information` varchar(250) DEFAULT NULL,
  `Menge` int(11) DEFAULT NULL CHECK (`Menge` >= 0),
  `Kaufpreis` decimal(10,2) DEFAULT NULL CHECK (`Kaufpreis` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `Artikel`
--

INSERT INTO `Artikel` (`Artikelnummer`, `Produktname`, `Information`, `Menge`, `Kaufpreis`) VALUES
(23, 'PS5 - SLIM', 'neues Modell v1.5', 4, 399.99);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `Artikel`
--
ALTER TABLE `Artikel`
  ADD PRIMARY KEY (`Artikelnummer`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `Artikel`
--
ALTER TABLE `Artikel`
  MODIFY `Artikelnummer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `firstname`varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `company` varchar(100),
  `email` varchar(100) UNIQUE NOT NULL,
  `userName` varchar(100) DEFAULT NULL,
  `userPassword` text,
  `warehouseID` int DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1
  PRIMARY KEY (`userID`),
  UNIQUE KEY `userID` (`userID`),
  KEY `warehouseID` (`warehouseID`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`warehouseID`) REFERENCES `warehouse` (`warehouseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `transaktions` ( 
  `id` int(11) PRIMARY KEY AUTO_INCREMENT, 
  `Artikelnummer` int(11) NOT NULL, 
  `Produktname` varchar(50) NOT NULL, 
  `Verkaufsdatum` date NOT NULL, 
  `Menge` int(11) DEFAULT NULL CHECK (`Menge` >= 0), 
  `Verkaufspreis` decimal(10,2) DEFAULT NULL CHECK (`Verkaufspreis` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
