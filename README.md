# 🛍️ NAA - Next-Gen AI E-Commerce Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933.svg)
![AI Powered](https://img.shields.io/badge/Feature-AI%20Powered-FF69B4.svg)

Welcome to the **NAA E-Commerce Platform**! This is a cutting-edge full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to provide a premium, modern shopping experience enriched with advanced Artificial Intelligence features.

---

## ✨ Standout Features

*   🤖 **AI Chatbot & Assistant:** Integrated with OpenAI and Anthropic to provide users with intelligent shopping assistance.
*   📸 **Visual Search ("Shop The Look"):** Users can search for products using images, powered by Xenova/Transformers and advanced machine learning models.
*   🧊 **3D Product Viewer:** Interactive 3D model viewing for products using `@react-three/fiber` and `drei` to give users a fully immersive experience.
*   📊 **Admin Dashboard:** Comprehensive admin panel with real-time analytics and beautiful charts powered by `Chart.js`.
*   💳 **Secure Payments:** Full integration with **Stripe** for seamless and secure checkout flows.
*   ☁️ **Cloud Storage:** Image and asset handling optimized via Cloudinary and Sharp.
*   📱 **Responsive & Modern Design:** Tailored with Tailwind CSS and Framer Motion for a fluid, glassmorphic, and dynamic UI that looks stunning on every device.

---

## 🛠️ Tech Stack

### Frontend
*   **React 19** (via **Vite**)
*   **Tailwind CSS** & **Framer Motion** (Styling & Animations)
*   **Three.js / React Three Fiber** (3D Rendering)
*   **React Router Dom** (Navigation)

### Backend
*   **Node.js / Express** (Server)
*   **MongoDB & Mongoose** (Database)
*   **JWT** (Authentication)
*   **Stripe SDK** (Payments)
*   **OpenAI / Anthropic SDK** (AI Features)

---

## 🚀 Deployment Architecture

This project is optimized for a separated deployment strategy for maximum performance and AI-timeout resilience.
1.  **Frontend:** Hosted on Vercel for lightning-fast global CDN delivery.
2.  **Backend:** Hosted on Railway to ensure 24/7 uptime without strict serverless function timeouts.
3.  **Database:** Scaled on MongoDB Atlas.

---

## 💻 Local Development

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NoumanZahoor1/NAA-Ecommerce-Project-.git
   cd NAA-Ecommerce-Project-
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your keys (MongoDB, Stripe, OpenAI, Cloudinary, etc.).

4. **Run the Development Servers:**
   ```bash
   npm run dev:all
   ```
   *This single command will spin up BOTH the Vite frontend and Express backend concurrently!*

---
*Built with ❤️ for a premium user experience.*
