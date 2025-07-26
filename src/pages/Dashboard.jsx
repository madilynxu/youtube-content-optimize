import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Video, 
  ThumbsUp, 
  Eye,
  Calendar,
  RefreshCw,
  Play,
  MessageCircle,
  Share2,
  Target
} from 'lucide-react'
import { processYouTubeData } from '../utils/youtubeDataProcessor'
import { formatNumber } from '../utils/dataUtils'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'

const Dashboard = () => {
  console.log('Dashboard component rendering')
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)
  const [kpiData, setKpiData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])

  // Load YouTube data on component mount
  useEffect(() => {
    console.log('Dashboard useEffect triggered')
    loadYouTubeData()
    setKpiData({
      subscriberGrowth: {
        current: 12500,
        previous: 11800,
        change: 5.9,
        trend: 'up',
        totalSubscribers: 125000
      },
      uploadFrequency: {
        current: 2.4,
        previous: 2.1,
        change: 14.3,
        trend: 'up',
        videosThisMonth: 12,
        channelAge: 24
      },
      viewsPerUpload: {
        current: 45000,
        previous: 42000,
        change: 7.1,
        trend: 'up',
        totalViews: 540000
      },
      engagementPerUpload: {
        current: 3200,
        previous: 2900,
        change: 10.3,
        trend: 'up',
        totalEngagement: 38400
      },
      subscribersPerUpload: {
        current: 850,
        previous: 720,
        change: 18.1,
        trend: 'up',
        totalSubscriberGain: 10200
      }
    })
  }, [])

  const loadYouTubeData = async () => {
    setIsLoading(true)
    try {
      console.log('Loading YouTube data...')
      const response = await fetch('/youtube_cleaned.csv')
      console.log('CSV response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const csvText = await response.text()
      console.log('CSV text length:', csvText.length)
      
      const processedData = await processYouTubeData(csvText)
      console.log('Processed data:', processedData)
      
      setKpiData(processedData.kpiData)
      setChartData(processedData.chartData)
      setRecentActivity(processedData.recentActivity)
    } catch (error) {
      console.error('Error loading YouTube data:', error)
      // Fallback to sample data if CSV loading fails
      setKpiData({
        subscriberGrowth: {
          current: 12500,
          previous: 11800,
          change: 5.9,
          trend: 'up',
          totalSubscribers: 125000
        },
        uploadFrequency: {
          current: 2.4,
          previous: 2.1,
          change: 14.3,
          trend: 'up',
          videosThisMonth: 12,
          channelAge: 24
        },
        viewsPerUpload: {
          current: 45000,
          previous: 42000,
          change: 7.1,
          trend: 'up',
          totalViews: 540000
        },
        engagementPerUpload: {
          current: 3200,
          previous: 2900,
          change: 10.3,
          trend: 'up',
          totalEngagement: 38400
        },
        subscribersPerUpload: {
          current: 850,
          previous: 720,
          change: 18.1,
          trend: 'up',
          totalSubscriberGain: 10200
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Use real data if available, otherwise fallback to sample data
  const subscriberData = chartData?.subscriberData || Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    subscribers: Math.floor(Math.random() * 500) + 400,
    newSubscribers: Math.floor(Math.random() * 100) + 50
  }))

  const engagementData = chartData?.engagementData || Array.from({ length: 30 }, (_, i) => ({
    date: format(subDays(new Date(), 29 - i), 'MMM dd'),
    likes: Math.floor(Math.random() * 2000) + 1500,
    comments: Math.floor(Math.random() * 300) + 200
  }))

  const videoPerformanceData = chartData?.videoPerformanceData || [
    { name: 'Tutorial Videos', views: 85000, engagement: 4200, subscribers: 1200 },
    { name: 'Product Reviews', views: 65000, engagement: 3800, subscribers: 950 },
    { name: 'Behind the Scenes', views: 45000, engagement: 2800, subscribers: 680 },
    { name: 'Live Streams', views: 120000, engagement: 5200, subscribers: 1500 },
    { name: 'Q&A Sessions', views: 35000, engagement: 2200, subscribers: 520 }
  ]

  const weeklyUploadData = chartData?.weeklyUploadData || [
    { day: 'Monday', uploads: 2, views: 45000 },
    { day: 'Tuesday', uploads: 1, views: 38000 },
    { day: 'Wednesday', uploads: 2, views: 52000 },
    { day: 'Thursday', uploads: 1, views: 41000 },
    { day: 'Friday', uploads: 2, views: 48000 },
    { day: 'Saturday', uploads: 2, views: 55000 },
    { day: 'Sunday', uploads: 2, views: 62000 }
  ]

  const topTagsData = chartData?.topTagsData || [
    { tag: 'gaming', count: 45, percentage: 15 },
    { tag: 'tutorial', count: 32, percentage: 11 },
    { tag: 'music', count: 28, percentage: 9 },
    { tag: 'review', count: 25, percentage: 8 },
    { tag: 'comedy', count: 22, percentage: 7 }
  ]

  const durationEngagementData = chartData?.durationEngagementData || []

  // Filter out outliers for better visualization
  const filteredDurationEngagementData = durationEngagementData.length > 0 
    ? durationEngagementData.filter(item => {
        // Remove extreme outliers (videos with views > 50M or duration > 60 minutes)
        return item.views <= 50000000 && item.duration <= 3600
      })
    : []

  const refreshData = () => {
    loadYouTubeData()
  }

  const MetricCard = ({ title, value, change, trend, icon: Icon, color, subtitle }) => (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {change}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  console.log('Dashboard about to render, kpiData:', kpiData, 'isLoading:', isLoading)
  
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">YouTube Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor most popular videos in US and channel growth trends</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-32"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* YouTube KPI Cards */}
      {kpiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Subscriber Growth"
            value={`${kpiData.subscriberGrowth.current.toLocaleString()}`}
            change={kpiData.subscriberGrowth.change}
            trend={kpiData.subscriberGrowth.trend}
            icon={Users}
            color="bg-primary-500"
            subtitle={`${kpiData.subscriberGrowth.totalSubscribers.toLocaleString()} total`}
          />
          <MetricCard
            title="Upload Frequency"
            value={`${kpiData.uploadFrequency.current}/week`}
            change={kpiData.uploadFrequency.change}
            trend={kpiData.uploadFrequency.trend}
            icon={Video}
            color="bg-success-500"
            subtitle={`${kpiData.uploadFrequency.videosThisMonth} videos this month`}
          />
          <MetricCard
            title="Views per Upload"
            value={kpiData.viewsPerUpload.current.toLocaleString()}
            change={kpiData.viewsPerUpload.change}
            trend={kpiData.viewsPerUpload.trend}
            icon={Play}
            color="bg-warning-500"
            subtitle={`${kpiData.viewsPerUpload.totalViews.toLocaleString()} total views`}
          />
          <MetricCard
            title="Engagement per Upload"
            value={kpiData.engagementPerUpload.current.toLocaleString()}
            change={kpiData.engagementPerUpload.change}
            trend={kpiData.engagementPerUpload.trend}
            icon={ThumbsUp}
            color="bg-purple-500"
            subtitle={`${kpiData.engagementPerUpload.totalEngagement.toLocaleString()} total`}
          />
          <MetricCard
            title="Subscribers per Upload"
            value={kpiData.subscribersPerUpload.current.toLocaleString()}
            change={kpiData.subscribersPerUpload.change}
            trend={kpiData.subscribersPerUpload.trend}
            icon={Target}
            color="bg-danger-500"
            subtitle={`${kpiData.subscribersPerUpload.totalSubscriberGain.toLocaleString()} gained`}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading YouTube data... {isLoading ? '(Loading...)' : '(Ready)'}</span>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscriber Growth Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Subscriber Growth Trend</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={subscriberData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                tickFormatter={(value) => formatNumber(value)}
                width={60}
              />
              <Tooltip 
                formatter={(value) => [formatNumber(value), 'Subscribers']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="subscribers" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
            <ThumbsUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => formatNumber(value)}
                width={60}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatNumber(value)}
                width={60}
              />
              <Tooltip 
                formatter={(value, name) => [formatNumber(value), name]}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="likes" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Likes"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="comments" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Comments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Performance Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Video Performance by Channel</h3>
            <Play className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={videoPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => formatNumber(value)}
                width={60}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatNumber(value)}
                width={60}
              />
              <Tooltip 
                formatter={(value, name) => [formatNumber(value), name]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="views" fill="#3B82F6" name="Views" />
              <Bar yAxisId="right" dataKey="engagement" fill="#10B981" name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Upload Frequency Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Upload Schedule</h3>
            <Video className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyUploadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickFormatter={(value) => formatNumber(value)}
                width={80}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="uploads" fill="#F59E0B" name="Uploads" />
              <Bar yAxisId="right" dataKey="views" fill="#8B5CF6" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top 10 Channels by Total Views */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top 10 Channels by Total Views</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {videoPerformanceData.slice(0, 10).map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{channel.name}</p>
                    <p className="text-sm text-gray-500">{channel.videoCount || 1} videos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatNumber(channel.totalViews || channel.views)}</p>
                  <p className="text-sm text-gray-500">{formatNumber(channel.engagement)} engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 20 Most Common Tags */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top 20 Most Common Tags</h3>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {topTagsData.map((tag, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{tag.tag}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{tag.count}</p>
                  <p className="text-xs text-gray-500">{tag.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Duration vs Engagement Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Duration vs Views Scatter Plot */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Video Duration vs Views</h3>
            <Play className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={filteredDurationEngagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="duration" 
                name="Duration (seconds)"
                tickFormatter={(value) => `${Math.round(value / 60)}m`}
              />
              <YAxis 
                dataKey="views" 
                name="Views"
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'views' ? formatNumber(value) : `${Math.round(value / 60)}m`,
                  name === 'views' ? 'Views' : 'Duration'
                ]}
              />
              <Scatter dataKey="views" fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Duration vs Engagement Rate */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Duration vs Engagement Rate</h3>
            <ThumbsUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={durationEngagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="duration" 
                name="Duration (seconds)"
                tickFormatter={(value) => `${Math.round(value / 60)}m`}
              />
              <YAxis 
                dataKey="engagementRate" 
                name="Engagement Rate (%)"
                tickFormatter={(value) => `${value.toFixed(2)}%`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'engagementRate' ? `${value.toFixed(2)}%` : `${Math.round(value / 60)}m`,
                  name === 'engagementRate' ? 'Engagement Rate' : 'Duration'
                ]}
              />
              <Scatter dataKey="engagementRate" fill="#EF4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>



      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Video Activity</h3>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'upload' ? 'bg-primary-500' :
                    activity.type === 'milestone' ? 'bg-success-500' :
                    activity.type === 'engagement' ? 'bg-warning-500' :
                    activity.type === 'live' ? 'bg-danger-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-700">{activity.value}</span>
                  <p className="text-xs text-gray-500">{activity.views} views</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <span className="text-gray-500">No recent activity data available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 