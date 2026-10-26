# Leaf & Node — Specification

## Overview

Leaf & Node is a web-based community trading and care application for plant enthusiasts. Rather than focusing solely on watering alarms, Leaf & Node differentiates itself through a high-trust peer-to-peer exchange ecosystem for plant cuttings, rare cultivars, and established specimens.

## Background & Problem Statement

Plant enthusiasts lack a secure, dedicated ecosystem for trading rare cultivars and cuttings, often relying on general platforms unequipped for live plant verification, local matching, or environmental transit tracking. Leaf & Node addresses this inefficiency by creating a high-trust marketplace focused on verification, trait metadata, and safe peer-to-peer logistics.

------

## Goals

* Establish a high-trust peer-to-peer exchange ecosystem for plant enthusiasts.
* Prevent fraudulent listings through real-time live camera verification and digital plant passports.
* Facilitate automated local 1:1 matchmaking and trait-based filtering for rare specimens.
* Ensure safe shipping and handling with real-time weather monitoring.

------

## User Roles

### Plant Enthusiast & Trader

- Manage public inventories categorized into "Have" (plants ready for trade) and "Want" (desired plants/cultivars) portfolios.
- Perform real-time live camera photo/video capture within the app to generate unalterable watermarked "Proof of Life" verification assets.
- Negotiate trade terms, coordinate cash adjustments, and arrange meeting or shipping details via in-app direct chat.
- View local matches within a customizable geographic radius (10, 25, 50 miles) and filter wishlist alerts by trait metadata.
- Rate trading partners using a multi-metric feedback system covering plant health, packaging quality, species authenticity, and communication.
- Receive automated weather-aware shipping alerts.

------

## Core Features

### 1. Trust & Verification Infrastructure

This feature ensures transparency and authenticity by requiring real-time, live camera photo or video capture within the app to prevent gallery or stock photo uploads. It automatically embeds an unalterable watermark displaying the user handle, timestamp, and city location as a Digital Plant Passport. Additionally, it includes a multi-metric trader karma and review system covering plant health, packaging quality, species authenticity, and communication, alongside specialized trait and node tagging for rare specimens (developmental stage, node count, and variegation stability).

### 2. Smart Wishlist & Matchmaking System

This system lets users maintain dual "Have" versus "Want" public portfolios to showcase available inventory and desired cultivars. It features an automated local matchmaking engine that algorithmically flags 1:1 local matches within a customizable geographic radius such as 10, 25, or 50 miles. Users can also apply trait-based filtering to narrow wishlist alerts by developmental stage, maturity, and variegation stability.

### 3. Peer-to-Peer Logistics & Chat Negotiation

This module streamlines transactions via an in-app direct chat interface for discussing terms, exchanging items, coordinating cash adjustments, and organizing meeting or shipping logistics. It integrates with live weather APIs to monitor transit routes between sender and recipient, automatically triggering warnings if temperatures fall below 35°F (1.6°C) or exceed 90°F (32°C).  

------

## Technical Stack

- **Backend** — Node.js (TypeScript) with Express/NestJS, utilizing WebSockets for real-time peer-to-peer messaging.
- **Frontend** — Vue.js web application with a responsive interface optimized for desktop and mobile browsers.
- **Database** — PostgreSQL with PostGIS extension for geospatial radius queries and distance calculations.
- **Authentication & Storage** — AWS S3 + Cloudflare CDN for fast, secure photo storage and "Proof of Life" verification assets.
- **External APIs** — Google Maps SDK for location filtering and OpenWeather API for shipping weather alerts.