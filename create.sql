-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: posters
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `posters`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `posters` ;

USE `posters`;

--
-- Table structure for table `posters`
--

DROP TABLE IF EXISTS `posters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `posters` (
  `ID` char(37) NOT NULL,
  `NO` int(11) NOT NULL AUTO_INCREMENT,
  `POSTERID` char(37) DEFAULT NULL,
  `POSTERNUM` char(8) DEFAULT NULL,
  `USERID` char(37) DEFAULT NULL,
  `CREATETIME` varchar(32) DEFAULT NULL,
  `UPDATETIME` varchar(32) DEFAULT NULL,
  `FIX` text,
  `TITLE` text,
  `URLQR` text,
  `PRICE` text,
  PRIMARY KEY (`NO`)
) ENGINE=InnoDB ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posters`
--

--
-- Dumping routines for database 'posters'
--

--
-- Current Database: `users`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `users` ;

USE `users`;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `orders` (
  `NO` bigint(32) NOT NULL AUTO_INCREMENT,
  `ID` varchar(37) NOT NULL,
  `USERID` varchar(37) DEFAULT NULL,
  `TITLE` varchar(37) DEFAULT NULL,
  `POSTERID` varchar(37) DEFAULT NULL,
  `STATE` varchar(8) DEFAULT NULL COMMENT '待支付,支付中,支付超时,支付失败(待支付),支付成功',
  `AMOUNT` varchar(16) DEFAULT NULL,
  `CREATETIME` varchar(32) DEFAULT NULL,
  `UPDATETIME` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`NO`),
  UNIQUE KEY `ID_UNIQUE` (`ID`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--


-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `ID` char(37) NOT NULL,
  `NO` bigint(32) NOT NULL AUTO_INCREMENT,
  `OPENID` varchar(64) DEFAULT NULL,
  `USERNAME` varchar(36) DEFAULT NULL,
  `USERPWD` varchar(36) DEFAULT NULL,
  `NICKNAME` varchar(36) DEFAULT NULL,
  `JOB` varchar(8) DEFAULT NULL,
  `ADDRESS` varchar(256) DEFAULT NULL,
  `EMAIL` varchar(36) DEFAULT NULL,
  `TEL` varchar(36) DEFAULT NULL,
  `STATE` varchar(8) DEFAULT NULL COMMENT '未注册，已注册(未付费), 已付费',
  `AVAILABE` float DEFAULT NULL COMMENT '每share一次增加点数',
  `BALANCE` float DEFAULT NULL,
  `GENDER` varchar(4) DEFAULT NULL,
  `CREATETIME` varchar(32) DEFAULT NULL,
  `UPDATETIME` varchar(32) DEFAULT NULL,
  `AVATAR` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`NO`),
  UNIQUE KEY `ID` (`ID`)
) ENGINE=InnoDB;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--
--
-- Dumping routines for database 'users'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-27 18:05:44
