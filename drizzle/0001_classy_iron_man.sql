CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featuredImage` text,
	`category` enum('noticias','rumores','fichajes','analisis','radar-latino','talento-iberico','tactico') NOT NULL,
	`accessTier` enum('FREE','PRO','PREMIUM') NOT NULL DEFAULT 'FREE',
	`author` enum('ruso','inge','mister') NOT NULL,
	`authorName` varchar(100),
	`tags` text,
	`relatedTeams` text,
	`relatedPlayers` text,
	`views` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contentViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`contentType` enum('article','player','match') NOT NULL,
	`contentId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contentViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matchesCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`apiFootballId` int NOT NULL,
	`fixtureData` text NOT NULL,
	`status` varchar(20) NOT NULL,
	`homeTeamId` int NOT NULL,
	`awayTeamId` int NOT NULL,
	`homeScore` int,
	`awayScore` int,
	`matchDate` timestamp NOT NULL,
	`lastFetched` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matchesCache_id` PRIMARY KEY(`id`),
	CONSTRAINT `matchesCache_apiFootballId_unique` UNIQUE(`apiFootballId`)
);
--> statement-breakpoint
CREATE TABLE `newsletterSubscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`userId` int,
	`tier` enum('FREE','PRO','PREMIUM') NOT NULL DEFAULT 'FREE',
	`frequency` enum('daily','weekly','never') NOT NULL DEFAULT 'weekly',
	`isActive` boolean NOT NULL DEFAULT true,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribedAt` timestamp,
	`unsubscribeToken` varchar(64),
	CONSTRAINT `newsletterSubscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletterSubscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`apiFootballId` int,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`position` varchar(50),
	`nationality` varchar(100),
	`age` int,
	`teamId` int,
	`teamName` varchar(255),
	`photo` text,
	`customIllustration` text,
	`appearances` int DEFAULT 0,
	`goals` int DEFAULT 0,
	`assists` int DEFAULT 0,
	`rating` varchar(10),
	`isPremium` boolean NOT NULL DEFAULT false,
	`bio` text,
	`analysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`),
	CONSTRAINT `players_apiFootballId_unique` UNIQUE(`apiFootballId`),
	CONSTRAINT `players_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `userFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entityType` enum('team','player') NOT NULL,
	`entityId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userFavorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('FREE','PRO','PREMIUM') DEFAULT 'FREE' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','inactive','cancelled','expired') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStartDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `newsletterSubscribed` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `newsletterFrequency` enum('daily','weekly','never') DEFAULT 'weekly' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `favoriteTeams` text;