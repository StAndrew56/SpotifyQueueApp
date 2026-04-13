# Mixify 🎵

A full-stack music queue app powered by Spotify. Search for songs, add them to a shared queue, and enjoy uninterrupted playback with auto-advance.

## Live Demo Only Works For Me
[https://spotify-queue-app-rho.vercel.app](https://spotify-queue-app-rho.vercel.app)

> Note: Backend is hosted on Render free tier and may take ~50 seconds to wake up on first load.

## Demo Video
[Watch Demo](https://youtu.be/LeGat8cdemk)

## Features
- Spotify OAuth 2.0 login
- Real-time song search via Spotify API
- Full song playback via Spotify Web Playback SDK (requires Spotify Premium)
- Persistent queue saved to MongoDB
- Auto-advance to next song when current song ends
- Queue persists after page refresh via MongoDB

## Tech Stack
**Frontend**
- React
- Tailwind CSS
- Spotify Web Playback SDK

**Backend**
- Node.js / Express
- MongoDB / Mongoose
- Express Session

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
