Convex Media 🎬

A modern, high-performance web application built with Next.js 15, Convex, and Better-Auth. This project demonstrates a clean, scalable architecture with real-time data synchronization, robust authentication, and optimized caching strategies.

🔗 Live Demo: convexmedia.vercel.app

🚀 Tech Stack
Framework: Next.js 15 (App Router)

Backend & Database: Convex - Real-time reactive database with serverless functions

Authentication: Better-Auth - Secure, flexible authentication

Styling: Tailwind CSS + shadcn/ui - Beautiful, accessible components

Package Manager: pnpm - Fast, disk-efficient package management

Fonts: Next.js font optimization with modern typefaces

✨ Key Features
⚡ Blazing fast - Built with Next.js 15 App Router for optimal performance

🔄 Real-time updates - Convex enables live data synchronization out of the box

🔐 Secure authentication - Better-Auth integration with multiple auth strategies

🎨 Beautiful UI - shadcn/ui components styled with Tailwind CSS

📱 Fully responsive - Works seamlessly across all devices

🚦 Optimized caching - Strategic data caching for improved performance

🧩 Modular architecture - Clean, maintainable code structure

🛠️ Getting Started
Prerequisites
Node.js 18+

pnpm (recommended) or npm/yarn/bun

Installation
Clone the repository

bash
git clone <your-repo-url>
cd convex-media
Install dependencies

bash
pnpm install
Set up environment variables

bash
cp .env.example .env.local
# Add your Convex deployment URL and auth credentials
Run the development server

bash
pnpm dev
Open http://localhost:3000 to see the result

📁 Project Structure
text
convex-media/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable UI components (shadcn/ui)
├── convex/             # Convex backend functions and schema
├── lib/                 # Utility functions and configurations
├── public/             # Static assets
├── styles/             # Global styles
└── ...
🚦 Performance Optimizations
✅ React Server Components were beneficial

✅ Partial pre-rendering for hybrid static/dynamic content

✅ Image optimization with Next.js Image component

✅ Font optimization with next/font

✅ Strategic caching of database queries

✅ Code splitting and lazy loading

📚 What I Learned
Building Convex Media deepened my understanding of:

Modern Next.js 15 patterns with App Router

Real-time data synchronization with Convex

Authentication flows with Better-Auth

Building reusable component libraries with shadcn/ui

Performance optimization and caching strategies

🚀 Deployment
This project is deployed on Vercel with automatic deployments from the main branch.

https://img.shields.io/badge/Deployed%2520on-Vercel-black?style=flat&logo=vercel

Built with 💻 by Mohammed Sarfaraj Rahman
