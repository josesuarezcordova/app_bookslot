
# BMI Appointment Project

## Prerequisites
- Node.js (v16+ recommended)
- npm
- Expo CLI (`npm install -g expo-cli`)
- SQLite3

## Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` and add your Stripe secret key:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```

## Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../my-bmi-app
   ```
2. Install dependencies:
   ```bash
   npm install
   npx expo install
   ```
3. Start the Expo app:
   ```bash
   npx expo start
   ```
4. Open the app in Expo Go or a simulator. Make sure your device is on the same network as your backend server.

## Database Setup
1. Navigate to the storage folder:
   ```bash
   cd ../backend/storage
   ```
2. Open the SQLite shell:
   ```bash
   sqlite3 bmi_database.db
   ```
3. (Optional) Insert slots:
   ```sql
   INSERT INTO slots (time) VALUES ('2025-11-27 09:00');
   -- Repeat for more slots
   ```

## Notes
- Ensure `.env` is not committed to git (it's in `.gitignore`).
- Update API URLs in the frontend to match your backend IP address.
- Rotate your Stripe API key if it was ever committed.
