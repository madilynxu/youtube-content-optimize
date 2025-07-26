# Youtube Content Optimize

### Dashboard Analytics
- **Real-time KPI Metrics**: Revenue, Users, Orders, Conversion Rate
- **Interactive Charts**: Line charts, Area charts, Bar charts, and Pie charts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Time Range Filtering**: View data for different time periods (7 days, 30 days, 90 days, 1 year)
- **Recent Activity Feed**: Live updates of system activities

### Embedded Chatbot
- **AI-Powered Assistant**: Intelligent responses to KPI-related queries
- **Floating Interface**: Non-intrusive chat widget that can be toggled
- **Real-time Responses**: Instant answers about revenue, users, metrics, and more
- **User-Friendly**: Clean, modern chat interface with typing indicators

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Routing**: React Router DOM


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

## Roadmap

- [ ] Real-time data updates
- [ ] Advanced filtering options
- [ ] Export functionality (PDF, CSV)
- [ ] User authentication
- [ ] Multiple dashboard themes
- [ ] Advanced chatbot with AI integration
- [ ] Mobile app version 
