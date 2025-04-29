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
