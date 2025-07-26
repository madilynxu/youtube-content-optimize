# KPI Dashboard Website

A modern, responsive dashboard application built with React that displays key performance indicators (KPIs) with interactive charts and an embedded chatbot for user assistance.

## Features

### 📊 Dashboard Analytics
- **Real-time KPI Metrics**: Revenue, Users, Orders, Conversion Rate
- **Interactive Charts**: Line charts, Area charts, Bar charts, and Pie charts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Time Range Filtering**: View data for different time periods (7 days, 30 days, 90 days, 1 year)
- **Recent Activity Feed**: Live updates of system activities

### 🤖 Embedded Chatbot
- **AI-Powered Assistant**: Intelligent responses to KPI-related queries
- **Floating Interface**: Non-intrusive chat widget that can be toggled
- **Real-time Responses**: Instant answers about revenue, users, metrics, and more
- **User-Friendly**: Clean, modern chat interface with typing indicators

### 🎨 Modern UI/UX
- **Clean Design**: Professional dashboard with intuitive navigation
- **Dark/Light Theme Support**: Customizable color schemes
- **Smooth Animations**: Framer Motion powered transitions
- **Mobile-First**: Responsive design that works on all devices

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kpi-dashboard-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
kpi-dashboard-website/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   └── Chatbot.jsx     # Embedded chatbot
│   ├── pages/              # Page components
│   │   └── Dashboard.jsx   # Main dashboard page
│   ├── utils/              # Utility functions
│   │   └── dataUtils.js    # Data processing utilities
│   ├── styles/             # CSS and styling
│   ├── data/               # Data files and mock data
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Customizing Data

### Adding Your Own KPI Data

1. **Replace Sample Data**: Update the data in `src/pages/Dashboard.jsx`
2. **Connect to API**: Modify the data fetching logic to connect to your backend
3. **Custom Metrics**: Add new KPI cards by extending the `MetricCard` component

### Example Data Structure

```javascript
const kpiData = {
  revenue: {
    current: 2400000,
    previous: 2080000,
    change: 15.4,
    trend: 'up'
  },
  users: {
    current: 12450,
    previous: 11800,
    change: 5.5,
    trend: 'up'
  },
  // Add more KPIs as needed
}
```

### Customizing the Chatbot

The chatbot responses can be customized in `src/components/Chatbot.jsx`. Update the `generateBotResponse` function to handle your specific use cases:

```javascript
const generateBotResponse = (userInput) => {
  const input = userInput.toLowerCase()
  
  if (input.includes('revenue')) {
    return 'Your custom revenue response here'
  }
  // Add more response patterns
}
```

## Configuration

### Tailwind CSS

The project uses Tailwind CSS with a custom color palette. You can modify colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3B82F6',
        // Add more shades
      }
    }
  }
}
```

### Vite Configuration

The Vite configuration is in `vite.config.js`. You can modify:
- Development server port
- Build output directory
- Source maps
- Plugin configurations

## Deployment

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Vercel

1. Connect your repository to Vercel
2. Vercel will automatically detect the Vite configuration and deploy

### Other Platforms

The built application can be deployed to any static hosting service:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Roadmap

- [ ] Real-time data updates
- [ ] Advanced filtering options
- [ ] Export functionality (PDF, CSV)
- [ ] User authentication
- [ ] Multiple dashboard themes
- [ ] Advanced chatbot with AI integration
- [ ] Mobile app version 