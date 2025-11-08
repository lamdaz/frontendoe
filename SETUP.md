# CinePro Frontend - Complete Setup Guide

This guide will walk you through setting up the Netflix-style streaming frontend for your CinePro backend.

## 📋 What We've Created

A complete React frontend with:
- ✅ Package.json with all dependencies
- ✅ Vite configuration
- ✅ API integration layer connected to your backend
- ✅ Netflix-style CSS (complete)
- ✅ Complete code templates in README.md

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React 18.3
- React Router DOM
- Axios
- React Player (for video streaming)
- Vite (build tool)
- Swiper (for carousels)

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your TMDB API key
nano .env
```

Add this content to `.env`:
```env
VITE_API_BASE_URL=https://diuuiu.onrender.com
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

**Get TMDB API Key:**
1. Go to https://www.themoviedb.org/settings/api
2. Sign up/Login
3. Request API key (free)
4. Copy and paste into .env

### Step 3: Create Source Files

The README.md contains all the code you need. Copy each code block into the appropriate file:

**Create these files by copying code from README.md:**

1. `src/main.jsx` - Entry point
2. `src/App.jsx` - Main app with routing
3. `src/components/Navbar.jsx` - Navigation bar
4. `src/components/Banner.jsx` - Hero banner
5. `src/components/MovieRow.jsx` - Movie carousels
6. `src/components/VideoPlayer.jsx` - Video player
7. `src/pages/Home.jsx` - Home page
8. `src/pages/MovieDetails.jsx` - Movie detail page
9. `src/pages/TVDetails.jsx` - TV show page
10. `src/pages/Search.jsx` - Search results page

### Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🎯 File Structure Reference

```
frontend/
├── src/
│   ├── main.jsx              ← Entry point
│   ├── App.jsx               ← Router setup
│   ├── components/
│   │   ├── Navbar.jsx        ← Top navigation
│   │   ├── Banner.jsx        ← Hero section
│   │   ├── MovieRow.jsx      ← Content rows
│   │   └── VideoPlayer.jsx   ← Player component
│   ├── pages/
│   │   ├── Home.jsx          ← Main page
│   │   ├── MovieDetails.jsx  ← Movie page
│   │   ├── TVDetails.jsx     ← TV show page
│   │   └── Search.jsx        ← Search page
│   ├── api/
│   │   └── api.js            ✅ Already created
│   └── styles/
│       └── App.css           ✅ Already created
├── index.html                ✅ Already created
├── vite.config.js            ✅ Already created
├── package.json              ✅ Already created
├── .env                      ← YOU CREATE THIS
└── .gitignore                ✅ Already created
```

## 🛠️ Easy File Creation Method

### Option 1: Manual Copy-Paste (Recommended)

1. Open README.md in your editor
2. Find each code block (search for filename)
3. Create the file: `touch src/main.jsx`
4. Copy the code block and paste into file
5. Save

### Option 2: Use VSCode

1. Right-click `src` folder → New File
2. Name it according to structure above
3. Paste code from README.md
4. Save

## ✅ Verify Your Setup

After creating all files, verify:

```bash
# Check file structure
ls -R src/

# Should show:
# src/components/Banner.jsx
# src/components/MovieRow.jsx
# src/components/Navbar.jsx
# src/components/VideoPlayer.jsx
# src/pages/Home.jsx
# src/pages/MovieDetails.jsx
# src/pages/Search.jsx
# src/pages/TVDetails.jsx
# src/App.jsx
# src/main.jsx
```

## 🚀 Start Development

```bash
npm run dev
```

You should see:
```
  VITE v5.4.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## 🎬 Test Your Setup

1. **Home Page**: http://localhost:3000
   - Should show Netflix-style interface
   - Should display trending movies (if TMDB key is correct)

2. **Click a Movie**
   - Should navigate to movie details
   - Click "Play" button
   - Should fetch sources from your backend

3. **Search**
   - Type in search box
   - Press Enter
   - Should show search results

## 🐛 Troubleshooting

### Issue: "Module not found"
```bash
# Solution: Install dependencies
npm install
```

### Issue: "Cannot find module './App'"
```bash
# Solution: Ensure all files are created
# Check filename spelling and location
```

### Issue: Images not loading
```bash
# Solution: Check TMDB API key in .env
# Restart dev server after editing .env
```

### Issue: No streaming sources
```bash
# Solution: 
# 1. Check backend is running: https://diuuiu.onrender.com
# 2. First request may take 30s (backend waking up)
# 3. Try different movie/TV show
```

### Issue: CORS errors
```bash
# Solution: Update backend .env
# Add your frontend URL to ALLOWED_ORIGINS
ALLOWED_ORIGINS=["http://localhost:3000","https://your-deployed-url.com"]
```

## 📦 Build for Production

```bash
# Build optimized production files
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Netlify (Easiest)

1. Create GitHub repo for frontend
2. Push code to GitHub
3. Go to https://app.netlify.com
4. Click "New site from Git"
5. Select your frontend repo
6. Settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Add environment variables:
   - `VITE_API_BASE_URL=https://diuuiu.onrender.com`
   - `VITE_TMDB_API_KEY=your_key`
8. Deploy!

### Vercel

```bash
npm i -g vercel
vercel
# Follow prompts
# Add environment variables when asked
```

### Deploy to Render.com (as Static Site)

1. Push to GitHub
2. New Static Site on Render
3. Build: `npm run build`
4. Publish: `dist`
5. Add environment variables

## 🔑 Important Environment Variables

Your `.env` file MUST contain:

```env
# Backend URL (your deployed backend)
VITE_API_BASE_URL=https://diuuiu.onrender.com

# TMDB API Key (get from themoviedb.org)
VITE_TMDB_API_KEY=your_actual_key_here

# Image base URL (don't change)
VITE_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

## 📚 API Endpoints Used

Your frontend will call these backend endpoints:

- `GET /movie/:tmdbId` - Get movie streaming sources
- `GET /tv/:tmdbId?s=1&e=1` - Get TV episode sources

And these TMDB endpoints:

- `/trending/movie/week` - Trending movies
- `/trending/tv/week` - Trending TV shows
- `/movie/popular` - Popular movies
- `/tv/popular` - Popular TV shows
- `/search/multi` - Search
- `/movie/:id` - Movie details
- `/tv/:id` - TV show details

## 🎨 Customization

### Change Colors

Edit `src/styles/App.css`:

```css
/* Netflix red */
#e50914

/* Dark background */
#141414

/* Hover effects */
#b3b3b3
```

### Add More Features

- Add watchlist
- Add user profiles
- Add recommendations
- Add Continue Watching
- Add genres page

## 📝 Code Quality

### Format Code

```bash
# Install Prettier
npm install -D prettier

# Format all files
npx prettier --write "src/**/*.{js,jsx,css}"
```

### Lint Code

```bash
# Install ESLint
npm install -D eslint

# Run linting
npx eslint src/
```

## 🔒 Security Notes

1. **Never commit .env file** - It's in .gitignore
2. **Keep TMDB key private** - Don't expose in frontend code
3. **HTTPS only** - Use HTTPS in production
4. **Update dependencies** - Run `npm update` regularly

## 📊 Performance Tips

1. **Lazy load images** - Images load only when visible
2. **Code splitting** - React Router handles this
3. **Caching** - Browser caches API responses
4. **Optimize images** - TMDB provides multiple sizes

## 🆘 Need Help?

1. Check README.md for complete code examples
2. Check browser console for errors
3. Check backend logs on Render.com
4. Verify environment variables
5. Test backend API directly: https://diuuiu.onrender.com

## ✨ Features Overview

✅ **Home Page**
- Netflix-style hero banner
- Multiple content rows
- Smooth scrolling
- Responsive design

✅ **Movie/TV Details**
- Full backdrop display
- Movie metadata
- Play button
- Episode selection (TV)

✅ **Video Player**
- Multiple source support
- Auto-fallback on error
- Full-screen support
- Source switching

✅ **Search**
- Real-time search
- Movies and TV shows
- Grid layout
- Click to view details

## 🎉 You're Done!

Once all files are created and dependencies installed:

```bash
npm run dev
```

Open http://localhost:3000 and enjoy your Netflix-style streaming platform!

---

**Backend API**: https://diuuiu.onrender.com  
**TMDB**: https://www.themoviedb.org  
**React Docs**: https://react.dev  
**Vite Docs**: https://vite.dev
