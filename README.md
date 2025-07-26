# Youtube Content Optimize

## Project Overview

YouTube has become a dominant platform for content consumption, yet creators and marketing teams often lack visibility into what drives true engagement and subscriber growth. Our goal was to build a scalable, real-time analytics solution that answers key questions like:

- What factors drive views, likes, and subscriber growth?
- Which videos or channels are underperforming?
- How can content strategy be improved through data?

This project combines data engineering, machine learning, and visualization into one seamless experience using a modern web interface.

---

## Methodology

### Data Pipeline
- **YouTube Data API** to stream metadata and performance metrics
- **GCP Stack**: Pub/Sub → Cloud Functions → Dataflow → BigQuery
- Regularly updated BigQuery tables feed both analysis and dashboard

### Modeling & Analysis
- **Regression Models** (Linear, Lasso, Ridge):
  - Target variables: `log_subscriber_growth_rate`, `log_view_count`
  - Objective: quantify impact of tags, titles, frequency, and length
- **Clustering (KMeans)**:
  - Group videos based on derived KPIs
  - Discover high performers and fast-growing newcomers

### Feature Engineering
Derived metrics include:
- `views_per_upload`
- `engagement_per_upload`
- `subscriber_growth_rate`
- `upload_frequency`
- `subscriber_per_upload`

---

## Deliverables & Features

### Interactive Dashboard
- Key KPIs: Views, Likes, Comments, Engagement Rate, Subscriber Growth
- Time-range filtering and category breakdowns

### Embedded Chatbot
- Ask questions about top videos, brands, or trends
- Provides instant natural language insights
- Can be enhanced with LLM APIs for richer interaction

### Machine Learning and Statistical Models
- Predict subscriber growth using regression
- Cluster videos by performance profiles
- Visualize trends and key drivers of engagement

--

## Dashboard Demo

![Dashboard](dashboard.png)
Users can explore:
- Top viewed channels and their engagement trends
- Category-wise performance summaries
- Individual channel performance across time

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **Routing**: React Router DOM

### Dashboard Structure

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

The dashboard uses Tailwind CSS with a custom color palette.

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

---

## Modeling Results

| Prediction Target         | Best Model        | R² Score | Notes                                  |
|--------------------------|-------------------|----------|----------------------------------------|
| Subscriber Growth Rate   | Lasso / Ridge     | ~0.89    | Strong linear pattern                  |
| View Count               | Linear Regression | ~0.51    | Less predictable, nonlinear dynamics   |

- **Clustering Analysis** revealed three distinct video types:
  - **Cluster 2**: High-view, low-frequency uploads (e.g. MrBeast-type viral hits)
  - **Cluster 1**: Newer, fast-growing channels with frequent uploads
  - **Cluster 0**: Stable performers with long-form content

---

## Insights & Takeaways

### Key Engagement Insights
- **Likes > Comments** as engagement indicators
- **Video length is not a strong predictor** of performance
- Strong feedback loop: more subscribers → more views → higher engagement

### Content Strategy Recommendations
- Focus on increasing **engagement per upload**
- Target consistent uploading and optimize **titles**, **tags**, and **thumbnails**
- Monitor normalized metrics like `subscriber_growth_rate` for clearer performance evaluation

### Market Applications
- **For Creators**: Know what to improve and where to invest
- **For Brands**: Benchmark sponsored content, optimize campaign timing
- **For Analysts**: A flexible framework for scalable content intelligence

---














