DROP DATABASE
IF
	EXISTS `MOCK_PROJECT`;

CREATE DATABASE
IF
	NOT EXISTS `MOCK_PROJECT`;
USE `MOCK_PROJECT`;
DROP TABLE
IF
	EXISTS `roles`;-- Table structure for table `ROLE`
CREATE TABLE `roles` ( `roleNumber` TINYINT ( 5 ) NOT NULL, `roleTitle` VARCHAR ( 50 ) NOT NULL, PRIMARY KEY ( `roleNumber` ) ) ENGINE = INNODB DEFAULT CHARSET = utf8;-- Data for table `role`
INSERT INTO `roles` ( `roleNumber`, `roleTitle` )
VALUES
	( 1, 'Admin' ),
	( 2, 'Manager' ),
	( 3, 'Staff' ),
	( 4, 'Customer' );
DROP TABLE
IF
	EXISTS `users`;-- Table structure for table `USER`
CREATE TABLE
IF
	NOT EXISTS `users` (
		`email` VARCHAR ( 100 ) NOT NULL UNIQUE,
		`password` VARCHAR ( 255 ) NOT NULL,
		`userNumber` INT ( 11 ) NOT NULL AUTO_INCREMENT,
		`isVerified` boolean NOT NULL DEFAULT 0,
		`verifyToken` VARCHAR ( 100 ) UNIQUE,
		PRIMARY KEY ( `userNumber` ) 
	) ENGINE = INNODB DEFAULT CHARSET = utf8;
/*Table structure for table `offices` */
DROP TABLE
IF
	EXISTS `offices`;
CREATE TABLE `offices` (
	`officeCode` VARCHAR ( 10 ) NOT NULL,
	`city` VARCHAR ( 50 ) NOT NULL,
	`phone` VARCHAR ( 50 ) NOT NULL,
	`addressLine1` VARCHAR ( 50 ) NOT NULL,
	`addressLine2` VARCHAR ( 50 ) DEFAULT NULL,
	`state` VARCHAR ( 50 ) DEFAULT NULL,
	`country` VARCHAR ( 50 ) NOT NULL,
	`postalCode` VARCHAR ( 15 ) NOT NULL,
	`territory` VARCHAR ( 10 ) NOT NULL,
	PRIMARY KEY ( `officeCode` ) 
) ENGINE = INNODB DEFAULT CHARSET = latin1;
/*Data for the table `offices` */
INSERT INTO `offices` ( `officeCode`, `city`, `phone`, `addressLine1`, `addressLine2`, `state`, `country`, `postalCode`, `territory` )
VALUES
	( '1', 'San Francisco', '+1 650 219 4782', '100 Market Street', 'Suite 300', 'CA', 'USA', '94080', 'NA' ),
	( '2', 'Boston', '+1 215 837 0825', '1550 Court Place', 'Suite 102', 'MA', 'USA', '02107', 'NA' ),
	( '3', 'NYC', '+1 212 555 3000', '523 East 53rd Street', 'apt. 5A', 'NY', 'USA', '10022', 'NA' ),
	( '4', 'Paris', '+33 14 723 4404', '43 Rue Jouffroy Dabbans', NULL, NULL, 'France', '75017', 'EMEA' ),
	( '5', 'Tokyo', '+81 33 224 5000', '4-1 Kioicho', NULL, 'Chiyoda-Ku', 'Japan', '102-8578', 'Japan' ),
	( '6', 'Sydney', '+61 2 9264 2451', '5-11 Wentworth Avenue', 'Floor #2', NULL, 'Australia', 'NSW 2010', 'APAC' ),
	( '7', 'London', '+44 20 7877 2041', '25 Old Broad Street', 'Level 7', NULL, 'UK', 'EC2N 1HN', 'EMEA' );
/*Table structure for table `employees` */
DROP TABLE
IF
	EXISTS `employees`;
CREATE TABLE `employees` (
	`employeeNumber` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`lastName` VARCHAR ( 50 ) NOT NULL,
	`firstName` VARCHAR ( 50 ) NOT NULL,
	`extension` VARCHAR ( 10 ) NOT NULL,
	`officeCode` VARCHAR ( 10 ) NOT NULL,
	`reportsTo` INT ( 11 ) DEFAULT NULL,
	`jobTitle` VARCHAR ( 50 ) NOT NULL,
	`userNumber` INT ( 11 ) NOT NULL,
	`roleNumber` TINYINT ( 5 ) NOT NULL DEFAULT 3,
	`isActive` boolean NOT NULL DEFAULT 1,
	PRIMARY KEY ( `employeeNumber` ),
	KEY `reportsTo` ( `reportsTo` ),
	KEY `officeCode` ( `officeCode` ),
	KEY `userNumber` ( `userNumber` ),
	KEY `roleNumber` ( `roleNumber` ),
	CONSTRAINT `employees_ibfk_1` FOREIGN KEY ( `reportsTo` ) REFERENCES `employees` ( `employeeNumber` ),
	CONSTRAINT `employees_ibfk_2` FOREIGN KEY ( `officeCode` ) REFERENCES `offices` ( `officeCode` ),
	CONSTRAINT `employees_ibfk_3` FOREIGN KEY ( `userNumber` ) REFERENCES `users` ( `userNumber` ),
	CONSTRAINT `employees_ibfk_4` FOREIGN KEY ( `roleNumber` ) REFERENCES `roles` ( `roleNumber` ) 
) ENGINE = INNODB DEFAULT CHARSET = latin1;
/*Table structure for table `customers` */
DROP TABLE
IF
	EXISTS `customers`;
CREATE TABLE `customers` (
	`customerNumber` INT ( 11 ) NOT NULL AUTO_INCREMENT,
	`customerName` VARCHAR ( 50 ) NOT NULL,
	`contactLastName` VARCHAR ( 50 ) NOT NULL,
	`contactFirstName` VARCHAR ( 50 ) NOT NULL,
	`phone` VARCHAR ( 50 ) NOT NULL,
	`addressLine1` VARCHAR ( 50 ) NOT NULL,
	`addressLine2` VARCHAR ( 50 ) DEFAULT NULL,
	`city` VARCHAR ( 50 ) NOT NULL,
	`state` VARCHAR ( 50 ) DEFAULT NULL,
	`postalCode` VARCHAR ( 15 ) DEFAULT NULL,
	`country` VARCHAR ( 50 ) NOT NULL,
	`salesRepEmployeeNumber` INT ( 11 ) DEFAULT NULL,
	`creditLimit` DECIMAL ( 10, 2 ) DEFAULT NULL,
	`userNumber` INT ( 11 ) NOT NULL,
	`roleNumber` TINYINT ( 5 ) NOT NULL DEFAULT 4,
	`isActive` boolean NOT NULL DEFAULT 1,
	PRIMARY KEY ( `customerNumber` ),
	KEY `salesRepEmployeeNumber` ( `salesRepEmployeeNumber` ),
	KEY `userNumber` ( `userNumber` ),
	KEY `roleNumber` ( `roleNumber` ),
	CONSTRAINT `customers_ibfk_1` FOREIGN KEY ( `salesRepEmployeeNumber` ) REFERENCES `employees` ( `employeeNumber` ),
	CONSTRAINT `customers_ibfk_2` FOREIGN KEY ( `userNumber` ) REFERENCES `users` ( `userNumber` ),
CONSTRAINT `customers_ibfk_3` FOREIGN KEY ( `roleNumber` ) REFERENCES `roles` ( `roleNumber` ) 
) ENGINE = INNODB DEFAULT CHARSET = latin1;

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `orderNumber` int(11) NOT NULL AUTO_INCREMENT,
  `orderDate` date NOT NULL,
  `requiredDate` date NOT NULL,
  `shippedDate` date DEFAULT NULL,
  `status` varchar(15) NOT NULL,
  `comments` text,
  `customerNumber` int(11) NOT NULL,
  PRIMARY KEY (`orderNumber`),
  KEY `customerNumber` (`customerNumber`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerNumber`) REFERENCES `customers` (`customerNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `productLines` */

DROP TABLE IF EXISTS `productLines`;

CREATE TABLE `productLines` (
  `productLine` varchar(50) NOT NULL,
  `textDescription` varchar(4000) DEFAULT NULL,
  `htmlDescription` mediumtext,
  `image` mediumblob,
  PRIMARY KEY (`productLine`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `productCode` varchar(15) NOT NULL,
  `productName` varchar(70) NOT NULL,
  `productLine` varchar(50) NOT NULL,
  `productScale` varchar(10) NOT NULL,
  `productVendor` varchar(50) NOT NULL,
  `productDescription` text NOT NULL,
  `quantityInStock` smallint(6) NOT NULL,
  `buyPrice` decimal(10,2) NOT NULL,
  `MSRP` decimal(10,2) NOT NULL,
  PRIMARY KEY (`productCode`),
  KEY `productLine` (`productLine`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`productLine`) REFERENCES `productLines` (`productLine`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `orderDetails` */

DROP TABLE IF EXISTS `orderDetails`;

CREATE TABLE `orderDetails` (
  `orderNumber` int(11) NOT NULL,
  `productCode` varchar(15) NOT NULL,
  `quantityOrdered` int(11) NOT NULL,
  `priceEach` decimal(10,2) NOT NULL,
  `orderLineNumber` smallint(6) NOT NULL,
  PRIMARY KEY (`orderNumber`,`productCode`),
  KEY `productCode` (`productCode`),
  CONSTRAINT `orderDetails_ibfk_1` FOREIGN KEY (`orderNumber`) REFERENCES `orders` (`orderNumber`),
  CONSTRAINT `orderDetails_ibfk_2` FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `payments` */

DROP TABLE IF EXISTS `payments`;

CREATE TABLE `payments` (
  `orderNumber` int(11) NOT NULL,
	`paymentMethod` varchar(10) NOT NULL,
  `paymentDate` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
	`isPaid` boolean NOT NULL DEFAULT 0,
	`secureHash` varchar(250),
  PRIMARY KEY (`orderNumber`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderNumber`) REFERENCES `orders` (`orderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
