# EcoFleet - Smart Recycling and Waste Management for Karlsruhe

## 🌍 HackXplore Hackathon Project

EcoFleet is a smart waste management platform designed to make recycling and disposal of waste, especially glass bottles, more efficient in Karlsruhe, Germany. Developed during the HackXplore hackathon, our solution aims to transform urban waste management through real-time monitoring, intelligent routing, and citizen engagement.

## 🚀 Features

- **Real-time Container Monitoring**: Track fill levels of recycling containers throughout the city
- **Smart Route Optimization**: Efficient collection routes for waste management vehicles
- **Recycling Guide**: Educational information about proper recycling practices
- **Mobile-First Design**: Fully responsive interface that works on all devices
- **Collection Schedule**: Calendar view showing pickup dates for different waste types
- **Firebase Integration**: Real-time data synchronization with Firebase Realtime Database

## 💻 Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Map Visualization**: MapBox GL JS with custom markers and route display
- **State Management**: Zustand for global state
- **Backend**: Next.js API routes with Firebase integration
- **Database**: Firebase Realtime Database
- **UI Components**: Shadcn/UI with custom animations and responsive design

## 📱 Mobile Experience

EcoFleet is designed with a mobile-first approach:
- Touch-friendly UI components
- Optimized for small screens
- Interactive map with smooth animations
- Bottom navigation for essential actions
- iOS safe area support for full-screen experience
- Adaptive typography and spacing

## 🗺️ Map Features

- Custom container markers with status indication
- Real-time fill level visualization
- Optimized collection routes for waste management vehicles
- Location tracking for mobile users
- Smooth transitions and animations for a better user experience

## 🔄 Data Flow

1. Real-time container data is stored in Firebase Realtime Database
2. Custom API endpoints fetch and process this data
3. Frontend displays container information including location and fill levels
4. Users can access detailed information and optimal routes
5. The system provides educational content on proper recycling practices

## 💡 Inspiration

Recycling in urban areas often faces challenges:
- Difficulty finding appropriate recycling containers
- Overflowing containers causing frustration
- Inefficient collection routes leading to wasted resources
- Lack of knowledge about proper recycling practices

EcoFleet addresses these challenges by providing a comprehensive platform that connects citizens with waste management infrastructure, promoting sustainability and environmental responsibility.

## 🔍 Smart Route Optimization

Our intelligent routing system:
- Optimizes collection paths based on fill levels
- Reduces fuel consumption and emissions
- Prioritizes containers that are near capacity
- Provides turn-by-turn navigation for collection vehicles
- Estimates collection time and resource requirements

## 📊 Implementation Details

- **Container Monitoring**: Each container is equipped with virtual fill-level sensors
- **Data API**: Custom endpoints for retrieving and processing container data
- **Mobile Responsiveness**: Carefully crafted mobile views with touch targets and proper spacing


## 🌿 Environmental Impact

By optimizing waste collection routes and promoting proper recycling:
- Reduced CO2 emissions from collection vehicles
- Increased recycling rates
- Less overflow and litter around containers
- More efficient use of city resources

## 🔧 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/heitzlki/hackxplore.git

# Navigate to the client directory
cd client

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the client directory with:

```
MAP_BOX_ACCESS_TOKEN=your_mapbox_token
```

---

*EcoFleet: Making recycling smarter in Karlsruhe - one container at a time.*
