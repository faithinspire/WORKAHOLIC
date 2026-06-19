# Quick Start & Phone Access Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Terminal 1 - Start Backend
```bash
cd c:\Users\OLU\FAITHJOBS
npm start
```

Expected output:
```
✅ Server running on port 5000
📍 http://localhost:5000
🌐 Frontend: http://localhost:5000
🏥 Health check: http://localhost:5000/api/health
```

### Step 2: Terminal 2 - Start Frontend
```bash
cd c:\Users\OLU\FAITHJOBS\client
npm start
```

Expected output:
```
On Your Network: http://192.168.x.x:3000
Compiled successfully!
```

### Step 3: Open in Browser
```
http://localhost:3000
```

✅ You're running!

---

## 📱 Access on Phone (Same WiFi Network)

### Method 1: Direct IP Address (Easiest)

**Step 1: Find Your Computer's IP**
```cmd
ipconfig
```

Look for "IPv4 Address" (something like 192.168.1.100)

**Step 2: On your phone's browser**
```
http://192.168.1.100:3000
```

Replace `192.168.1.100` with your actual IP

### Method 2: Use Local Hostname

**Step 1: Find your computer name**
```cmd
hostname
```

**Step 2: On your phone**
```
http://[COMPUTER-NAME].local:3000
```

Example: `http://DESKTOP-ABC123.local:3000`

### Method 3: Internet Access (Ngrok)

**Step 1: Install Ngrok**
```bash
npm install -g ngrok
# or download from https://ngrok.com/
```

**Step 2: In a new terminal**
```bash
ngrok http 3000
```

**Step 3: Copy the HTTPS URL provided**
```
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Step 4: Share that URL with anyone**
```
https://abc123.ngrok.io
```

Works anywhere in the world!

---

## 🔍 Testing SEO Implementation

### Backend API Tests

**1. Check categories:**
```
http://localhost:5000/api/jobs-landing/categories
```

**2. Check locations:**
```
http://localhost:5000/api/jobs-landing/locations
```

**3. Get jobs by category (after DB migration + data population):**
```
http://localhost:5000/api/jobs-landing/by-role/teaching-education
```

**4. Get job by slug:**
```
http://localhost:5000/api/jobs-seo/by-slug/company-job-title
```

### Frontend Page Tests

**1. Job board:**
```
http://localhost:3000/jobs
```

**2. Category page:**
```
http://localhost:3000/jobs/teaching-education
```

**3. Location page:**
```
http://localhost:3000/locations/remote
```

**4. Combined filter:**
```
http://localhost:3000/jobs/teaching-education/remote
```

**5. Job detail (with SEO):**
```
http://localhost:3000/jobs/company-senior-developer
```

**6. Success page (with sharing):**
```
http://localhost:3000/application-success/123
```

---

## 📊 Check SEO Meta Tags in Browser

### In Desktop Browser (Chrome)

**1. Open DevTools:** Press `F12`

**2. Go to:** Elements tab → Find `<head>` section

**3. Look for SEO tags:**
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<script type="application/ld+json">...</script>
```

### On Phone

**1. Open page in browser**

**2. View page source:** Long press → "View page source"

**3. Search for "og:" to find Open Graph tags

**4. Or use SEO checker tools:**
- https://www.seobility.net/en/seocheck/
- https://metatags.io/
- https://www.opengraph.xyz/

---

## 🔧 Common Issues & Fixes

### Issue: "Can't connect to http://192.168.x.x:3000"

**Solution:**
1. Make sure both devices are on same WiFi
2. Check Windows Firewall isn't blocking port 3000
3. Verify backend is running (Terminal 1)
4. Check frontend is running (Terminal 2)

### Issue: Backend running but frontend won't start

**Solution:**
```bash
cd client
npm install  # Install dependencies first
npm start
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID 1234 /F

# Or use a different port
PORT=3001 npm start
```

### Issue: Phone can't reach computer IP

**Solution:**
1. Disable phone VPN
2. Check computer firewall settings
3. Try Ngrok for internet access instead

---

## 📱 Phone Access Comparison

| Method | Speed | Range | Setup |
|--------|-------|-------|-------|
| IP Address | ⚡ Fast | WiFi only | 2 min |
| Hostname | ⚡ Fast | WiFi only | 2 min |
| Ngrok | 🚀 Good | Anywhere | 5 min |

**Recommended:** Start with IP address method, use Ngrok if sharing externally.

---

## 🌐 Production Deployment (Vercel)

After testing locally:

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel deploy --prod
```

Access globally:
```
https://faithjobs-platform.vercel.app
```

---

## 📝 Notes

- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Database: Connected to Supabase PostgreSQL
- Static files served from: `/public`

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can access from phone on same WiFi
- [ ] Database migration executed (in Supabase)
- [ ] Job slugs populated in database
- [ ] Category/location mappings created
- [ ] SEO meta tags visible in page source
- [ ] JSON-LD schema visible in page source
- [ ] Share buttons working on success page

---

## 🎯 Next Steps

1. **Execute database migration** (most important!)
   - Go to Supabase dashboard
   - Paste `database/migration-seo-virality.sql` in SQL editor
   - Run it

2. **Populate existing jobs**
   - Run slugification queries
   - Create category/location mappings

3. **Test all endpoints** locally

4. **Deploy to production**

---

**Ready to launch!** 🚀

