# 🍵 Tea-Coffee Counter & Tracker WebApp

A modern, full-stack **Tea & Coffee Daily Counting** web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

---

## 🎨 Theme & Design
- **Dark Black**: Deep obsidian dark background (`#05070d`)
- **Neon Blue**: Primary cyan highlights & glow (`#00f0ff`)
- **Lime Green**: Secondary highlights & energetic accents (`#39ff14`)
- **Cyber Glassmorphism**: Translucent glass panels, smooth glowing animations, and responsive layout

---

## 🔐 Admin Login Credentials
- **Logo**: `Tea-Coffee`
- **Email**: `iflora@gmail.com`
- **Password**: `TeaCoffee#2026`
- **Admin Name**: `Iflora` (Database: MongoDB Atlas `teadata` -> Collection: `admin`)

---

## 🌐 Live Database
- **Provider**: MongoDB Atlas Cloud
- **Cluster**: `teacoffee.3fyiurw.mongodb.net`
- **Database**: `teadata`
- **Collections**:
  - `admin`: Stores admin credentials (`iflora@gmail.com`)
  - `records`: Stores daily tea and coffee logs added by the user

---

## ✨ Features
1. **Secure Admin Authentication**:
   - Clean login screen on startup.
   - Connected to MongoDB `teadata` with the `admin` collection.
   - Convenient 1-click **Autofill** helper button for testing.
2. **Dashboard & Data Table**:
   - Displays all existing tea & coffee entries in a responsive dark table.
3. **Add Daily Tea & Coffee**:
   - Click the prominent **"+ Add Tea-Coffee"** button in the header row.
   - Enter Date (defaults to today), Session (Morning / Evening radio options), Tea count, and Coffee count with quick `+` and `-` stepper buttons.
   - Optional remarks / notes field.
4. **CRUD Operations**:
   - **Add**: Save new records directly to MongoDB.
   - **Update/Edit**: Edit any existing record via modal.
   - **Delete**: Remove unwanted records with safety confirmation modal.
5. **Filters & Total Summary**:
   - **2x2 Summary Cards**: Total Tea, Total Coffee, Grand Total, and Filtered Records count.
   - **Filter Panel**: Filter by specific Date, Filter by Month, and search in remarks.
   - **Presets**: `Today`, `This Month`, `All Records`.
   - **Real-time Totals**: Automatically recalculates total tea, coffee, and grand total cups based on active filters.
6. **Excel Export**:
   - **"Download in Excel"** button in the Filters & Search panel.
   - Exports currently filtered table records to `.xlsx` format with auto-calculated total summary row.

---

## 🚀 How to Run the Project

1. Ensure MongoDB service is running locally on `localhost:27017`.
2. Navigate to the project directory and run:
   ```bash
   cd tea-coffee-app
   npm run dev
   ```
3. Open your browser at:
   [http://localhost:3000](http://localhost:3000)
