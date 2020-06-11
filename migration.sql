-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           5.6.45-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Versão:              10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
update mysql.user set plugin='' where user='root';
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('yolo');

-- Dumping database structure for webeng_crosswalks
DROP DATABASE IF EXISTS `webeng_crosswalks`;
CREATE DATABASE IF NOT EXISTS `webeng_crosswalks` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `webeng_crosswalks`;

-- Dumping structure for table webeng_crosswalks.crosswalks
DROP TABLE IF EXISTS `crosswalks`;
CREATE TABLE IF NOT EXISTS `crosswalks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(50) NOT NULL DEFAULT 'OFF',
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table webeng_crosswalks.crosswalks: ~2 rows (approximately)
DELETE FROM `crosswalks`;
/*!40000 ALTER TABLE `crosswalks` DISABLE KEYS */;
INSERT INTO `crosswalks` (`id`, `state`, `latitude`, `longitude`) VALUES
	(2, 'OFF', 41.5608846, -8.4293997),
	(3, 'ON', 41.55844, -8.39782);
/*!40000 ALTER TABLE `crosswalks` ENABLE KEYS */;

-- Dumping structure for table webeng_crosswalks.nearby_pedestrians
DROP TABLE IF EXISTS `nearby_pedestrians`;
CREATE TABLE IF NOT EXISTS `nearby_pedestrians` (
  `crosswalk_id` int(11) DEFAULT NULL,
  `pedestrian_id` int(11) DEFAULT NULL,
  KEY `FK__crosswalks` (`crosswalk_id`),
  CONSTRAINT `FK__crosswalks` FOREIGN KEY (`crosswalk_id`) REFERENCES `crosswalks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table webeng_crosswalks.nearby_pedestrians: ~0 rows (approximately)
DELETE FROM `nearby_pedestrians`;
/*!40000 ALTER TABLE `nearby_pedestrians` DISABLE KEYS */;
/*!40000 ALTER TABLE `nearby_pedestrians` ENABLE KEYS */;

-- Dumping structure for table webeng_crosswalks.nearby_vehicles
DROP TABLE IF EXISTS `nearby_vehicles`;
CREATE TABLE IF NOT EXISTS `nearby_vehicles` (
  `crosswalk_id` int(11) NOT NULL,
  `vehicle_id` int(11) NOT NULL,
  PRIMARY KEY (`crosswalk_id`,`vehicle_id`),
  CONSTRAINT `FK__crosswalks_vehicle` FOREIGN KEY (`crosswalk_id`) REFERENCES `crosswalks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table webeng_crosswalks.nearby_vehicles: ~0 rows (approximately)
DELETE FROM `nearby_vehicles`;
/*!40000 ALTER TABLE `nearby_vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `nearby_vehicles` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
