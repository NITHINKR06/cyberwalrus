# WALRUS: Cybersecurity & Digital Safety Platform

## Project Overview

**WALRUS** is a gamified, multilingual, AI-powered platform designed to educate citizens on cyber scams, enable easy fraud reporting, and provide tools to detect phishing and fraud in real-time. This project was created for the "Reality Rewritten" Hackathon, directly addressing the "Cybersecurity & Digital Safety for Citizens" problem statement.

## The Problem We're Solving

The digital world is full of threats like phishing, scams, and fraud. Many citizens lack the awareness and tools to protect themselves. The challenge is to build a lightweight, multilingual platform that not only educates users about these dangers but also empowers them to report and detect them. Our solution, WALRUS, is designed to tackle this problem head-on.

## Website Flow and User Journey

The WALRUS platform is designed to be an engaging and user-friendly experience. Here's a typical user journey:

1.  **Authentication**: The user's journey begins with a simple sign-up or login process.
2.  **Dashboard**: Upon logging in, the user is greeted with a personal dashboard. This is the central hub where they can see their progress, points, and achievements at a glance.
3.  **Learning Modules**: From the dashboard, users can access interactive and gamified learning modules covering essential topics like:
    * Password security
    * Phishing recognition
    * Two-factor authentication
    * Social engineering awareness
    * Safe online shopping
4.  **Scam Analyzer**: A key feature is the AI-powered Scam Analyzer. Here, users can:
    * Paste suspicious text from messages or emails for real-time analysis.
    * Enter a URL to check its safety.
    * Receive a threat assessment with a confidence score and actionable recommendations.
5.  **Report a Scam**: Users can contribute to community safety by reporting scams. The reporting system is straightforward, with categories for different scam types and severity levels.
6.  **Achievements and Leaderboard**: To keep users engaged, we've incorporated a gamification system. Users can track their achievements, earn badges, and compete with others on a leaderboard.
7.  **Profile and Settings**: Users can manage their profile and customize their experience in the settings section.
8.  **Multilingual Support**: The platform is accessible to a wider audience with support for English, Hindi, and Kannada.

## Core Features

* **Educate**: Interactive and gamified learning modules.
* **Empower**: An AI-powered Scam Analyzer for real-time text and URL analysis.
* **Protect**: A community-driven fraud reporting system.
* **Gamification**: A system of points, levels, achievements, and leaderboards to encourage engagement.
* **Multilingual Support**: Making cybersecurity education accessible to a diverse audience.

## Tech Stack

We've used a modern and robust tech stack to build WALRUS:

### Frontend

* **Framework**: React 18 with TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Internationalization**: react-i18next
* **State Management**: React Context API
* **Routing**: React Router

### Backend

* **Framework**: Express.js
* **Database**: MongoDB with Mongoose
* **Authentication**: JSON Web Tokens (JWT) and session management
* **Middleware**: Cors for handling cross-origin requests

### Planned API Integrations

* **AI Analysis**: Hugging Face Inference API for text analysis.
* **URL Safety**: Google Safe Browsing API for URL checking.
* **Data Visualization**: Recharts for displaying user progress and other data.
* **Notifications**: React Toastify for user notifications.

This comprehensive platform not only educates and protects users but does so in an engaging and accessible manner. We believe WALRUS is a significant step towards a safer digital world for everyone.