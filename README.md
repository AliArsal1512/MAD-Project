# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.





Salon-App/
│
├── app/                            # Screens + navigation (Expo Router pages)
│   ├── _layout.tsx                # Global layout (like Root Navigator)
│   ├── index.tsx                  # Home screen
│   ├── booking/                   # Nested route: /booking
│   │   └── index.tsx
│   ├── services/                  # Nested route: /services
│   │   └── index.tsx
│   ├── auth/                      # Login/Register routes
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── profile/                   # Profile route
│       └── index.tsx
│
├── components/                    # Reusable UI components
│   ├── Header.tsx
│   ├── ServiceCard.tsx
│   └── Button.tsx
│
├── constants/                     # Static data, colors, configs
│   ├── colors.ts
│   └── services.ts
│
├── hooks/                         # Custom React hooks
│   └── useAuth.ts
│
├── lib/                           # API, utility functions
│   ├── api.ts                     # Axios/Fetch base API
│   └── utils.ts
│
├── store/                         # Global state (Context, Zustand, Redux)
│   └── userStore.ts
│
├── assets/                        # Images, fonts, icons
│   ├── images/
│   └── fonts/
│
├── global.css                     # Tailwind CSS styles
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
├── tsconfig.json
├── package.json
├── app.json                       # Expo config
└── README.md


Folder/File	Purpose
app/	Routing-based screens using expo-router
components/	Reusable UI blocks like cards, headers
constants/	Static config or mock data (like service list, colors)
hooks/	Custom logic, e.g., useAuth, useBooking
lib/	API utilities, date formatters, etc.
store/	Global app state (if needed)
assets/	Images, fonts
global.css	Tailwind’s directives go here

FRs

1. User Authentication & Profiles
Customers can:

Register/login (email/phone + password or social login).

View/edit their profile (name, contact info, profile picture).

Barbers can:

Register/login as a professional barber (with verification if needed).

Set up a profile (shop name, location, services, pricing, working hours, photos).

2. Barber Discovery & Search
Customers can:

Browse/search barbers by:

Location (city/neighborhood).

Ratings/reviews.

Services offered (e.g., haircut, beard trim).

Price range.

View barber profiles (portfolio, availability, pricing).

3. Appointment Booking
Customers can:

Select a barber, service, date, and available time slot.

Confirm/cancel/modify appointments.

Receive booking confirmation (email/in-app notification).

Barbers can:

Set their availability (working hours, breaks, days off).

Approve/reject/cancel appointments.

4. Notifications & Reminders
Automated reminders for:

Upcoming appointments (customer & barber).

Cancellations/rescheduling.

Notifications for new bookings.