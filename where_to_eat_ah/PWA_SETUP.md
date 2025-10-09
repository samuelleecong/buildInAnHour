# PWA Setup Guide

## 📱 Progressive Web App Features

This app is now a fully-featured Progressive Web App (PWA) with the following capabilities:

### ✅ Implemented Features

1. **Installable** - Users can install the app on their devices
2. **Offline Support** - App works without internet connection
3. **Service Worker** - Caches assets and API responses
4. **Web App Manifest** - Defines app metadata and appearance
5. **Install Prompt** - Smart prompt shown after 5 seconds
6. **Offline Fallback** - Dedicated offline page
7. **Update Notifications** - Automatic service worker updates

### 🎨 Icons Required

For production, you need to generate the following icon files and place them in the `/public` directory:

```bash
/public/icon-192.png          # 192x192px standard icon
/public/icon-512.png          # 512x512px standard icon
/public/icon-192-maskable.png # 192x192px maskable (safe area)
/public/icon-512-maskable.png # 512x512px maskable (safe area)
```

#### Generating Icons

You can use the existing `/public/icon.svg` as a template and convert it to PNG using:

**Option 1: Online Tools**
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

**Option 2: Command Line**
```bash
# Using ImageMagick
convert -background none -resize 192x192 public/icon.svg public/icon-192.png
convert -background none -resize 512x512 public/icon.svg public/icon-512.png

# For maskable icons, ensure 20% padding around the logo
```

### 🚀 Testing PWA

#### Development
```bash
npm run build
npm start
```

Then open Chrome DevTools → Application → Manifest to verify PWA setup.

#### Lighthouse Audit
Run a Lighthouse audit in Chrome DevTools to check PWA score:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Analyze page load"

Target Score: 100/100 ✅

### 📊 Service Worker Caching Strategy

- **Network First**: API calls, navigation
- **Cache First**: Static assets (images, styles, scripts)
- **Offline Fallback**: `/offline` page when network unavailable

### 🔔 Push Notifications (Future)

The service worker is configured to support push notifications. To enable:

1. Generate VAPID keys
2. Add push subscription logic
3. Implement backend notification sender

### 💾 Offline Data Storage

Currently caching:
- Static pages (home, about, offline)
- Map tiles (OpenStreetMap)
- Hawker center data (JSON)
- CSS and JavaScript bundles

### 🔄 Update Strategy

Service worker updates are checked:
- Every hour automatically
- On page reload
- When new version is deployed

Users will see a notification to refresh when updates are available.

### 📱 Platform Support

✅ **Chrome** (Desktop & Mobile)
✅ **Edge** (Desktop & Mobile)
✅ **Safari** (iOS 11.3+, macOS)
✅ **Firefox** (Desktop & Mobile)
✅ **Samsung Internet**
✅ **Opera**

### 🛠️ Maintenance

To update the service worker version:
1. Edit `/public/sw.js`
2. Update `CACHE_NAME` version (e.g., `v1` → `v2`)
3. Deploy changes
4. Old caches will be automatically cleaned up

### 📝 Best Practices

1. **Always test locally** before deploying PWA changes
2. **Update cache version** when changing service worker logic
3. **Monitor storage** usage in production
4. **Test offline** functionality regularly
5. **Keep manifest** in sync with brand changes

### 🐛 Troubleshooting

**Issue**: Service worker not registering
- **Solution**: Check browser console, ensure HTTPS (or localhost)

**Issue**: Install prompt not showing
- **Solution**: Check `beforeinstallprompt` event, clear cache

**Issue**: Offline page not loading
- **Solution**: Verify `/offline` route exists and is cached

**Issue**: Updates not applying
- **Solution**: Clear browser cache, unregister service worker in DevTools

### 📚 Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
