import Papa from 'papaparse'

// Process YouTube CSV data
export const processYouTubeData = async (csvData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
        const processedData = processData(data)
        resolve(processedData)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

// Process the parsed data
const processData = (data) => {
  if (!data || data.length === 0) {
    return getDefaultData()
  }

  // Calculate aggregate metrics
  const totalSubscribers = data.reduce((sum, row) => sum + (parseInt(row.subscriber_count) || 0), 0)
  const totalViews = data.reduce((sum, row) => sum + (parseInt(row.view_count) || 0), 0)
  const totalLikes = data.reduce((sum, row) => sum + (parseInt(row.like_count) || 0), 0)
  const totalComments = data.reduce((sum, row) => sum + (parseInt(row.comment_count) || 0), 0)
  const totalVideos = data.length

  // Calculate averages
  const avgViewsPerUpload = totalViews / totalVideos
  const avgEngagementPerUpload = (totalLikes + totalComments) / totalVideos
  const avgSubscribersPerUpload = totalSubscribers / totalVideos

  // Calculate growth rates (using the subscriber_growth_rate from data)
  const avgSubscriberGrowthRate = data.reduce((sum, row) => sum + (parseFloat(row.subscriber_growth_rate) || 0), 0) / totalVideos
  const avgUploadFrequency = data.reduce((sum, row) => sum + (parseFloat(row.upload_frequency) || 0), 0) / totalVideos

  // Get recent data for trends (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentData = data.filter(row => {
    const publishedDate = new Date(row.published_at)
    return publishedDate >= thirtyDaysAgo
  })

  // Calculate recent metrics
  const recentSubscribers = recentData.reduce((sum, row) => sum + (parseInt(row.subscriber_count) || 0), 0)
  const recentViews = recentData.reduce((sum, row) => sum + (parseInt(row.view_count) || 0), 0)
  const recentEngagement = recentData.reduce((sum, row) => sum + (parseInt(row.like_count) || 0) + (parseInt(row.comment_count) || 0), 0)
  const recentVideos = recentData.length

  const recentAvgViewsPerUpload = recentVideos > 0 ? recentViews / recentVideos : 0
  const recentAvgEngagementPerUpload = recentVideos > 0 ? recentEngagement / recentVideos : 0
  const recentAvgSubscribersPerUpload = recentVideos > 0 ? recentSubscribers / recentVideos : 0

  // Calculate percentage changes
  const viewsChange = avgViewsPerUpload > 0 ? ((recentAvgViewsPerUpload - avgViewsPerUpload) / avgViewsPerUpload) * 100 : 0
  const engagementChange = avgEngagementPerUpload > 0 ? ((recentAvgEngagementPerUpload - avgEngagementPerUpload) / avgEngagementPerUpload) * 100 : 0
  const subscribersChange = avgSubscribersPerUpload > 0 ? ((recentAvgSubscribersPerUpload - avgSubscribersPerUpload) / avgSubscribersPerUpload) * 100 : 0

  return {
    kpiData: {
      subscriberGrowth: {
        current: Math.round(avgSubscriberGrowthRate),
        previous: Math.round(avgSubscriberGrowthRate * 0.9), // Simulate previous month
        change: Math.round((avgSubscriberGrowthRate * 0.1) / (avgSubscriberGrowthRate * 0.9) * 100),
        trend: avgSubscriberGrowthRate > 0 ? 'up' : 'down',
        totalSubscribers: totalSubscribers
      },
      uploadFrequency: {
        current: parseFloat(avgUploadFrequency.toFixed(1)),
        previous: parseFloat((avgUploadFrequency * 0.9).toFixed(1)),
        change: Math.round((avgUploadFrequency * 0.1) / (avgUploadFrequency * 0.9) * 100),
        trend: avgUploadFrequency > 0 ? 'up' : 'down',
        videosThisMonth: recentVideos,
        channelAge: Math.round(data[0]?.channel_age_days || 365)
      },
      viewsPerUpload: {
        current: Math.round(avgViewsPerUpload),
        previous: Math.round(avgViewsPerUpload * 0.9),
        change: Math.round(viewsChange),
        trend: viewsChange >= 0 ? 'up' : 'down',
        totalViews: totalViews
      },
      engagementPerUpload: {
        current: Math.round(avgEngagementPerUpload),
        previous: Math.round(avgEngagementPerUpload * 0.9),
        change: Math.round(engagementChange),
        trend: engagementChange >= 0 ? 'up' : 'down',
        totalEngagement: totalLikes + totalComments
      },
      subscribersPerUpload: {
        current: Math.round(avgSubscribersPerUpload),
        previous: Math.round(avgSubscribersPerUpload * 0.9),
        change: Math.round(subscribersChange),
        trend: subscribersChange >= 0 ? 'up' : 'down',
        totalSubscriberGain: totalSubscribers
      }
    },
    chartData: {
      subscriberData: generateSubscriberChartData(data),
      engagementData: generateEngagementChartData(data),
      videoPerformanceData: generateVideoPerformanceData(data),
      weeklyUploadData: generateWeeklyUploadData(data),
      topTagsData: generateTopTagsData(data),
      durationEngagementData: generateDurationEngagementData(data),
      topicCategoriesData: generateTopicCategoriesData(data)
    },
    recentActivity: generateRecentActivity(data),
    rawData: data
  }
}

// Generate subscriber growth chart data
const generateSubscriberChartData = (data) => {
  // Group by date and calculate daily subscriber growth
  const dailyData = {}
  
  data.forEach(row => {
    const date = new Date(row.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!dailyData[date]) {
      dailyData[date] = {
        subscribers: 0,
        newSubscribers: 0
      }
    }
    dailyData[date].subscribers += parseInt(row.subscriber_count) || 0
    dailyData[date].newSubscribers += Math.round((parseFloat(row.subscriber_growth_rate) || 0) * (parseInt(row.subscriber_count) || 0) / 100)
  })

  return Object.entries(dailyData).map(([date, values]) => ({
    date,
    subscribers: values.subscribers,
    newSubscribers: values.newSubscribers
  })).slice(-30) // Last 30 days
}

// Generate engagement chart data
const generateEngagementChartData = (data) => {
  const dailyData = {}
  
  data.forEach(row => {
    const date = new Date(row.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!dailyData[date]) {
      dailyData[date] = {
        likes: 0,
        comments: 0,
        shares: 0
      }
    }
    dailyData[date].likes += parseInt(row.like_count) || 0
    dailyData[date].comments += parseInt(row.comment_count) || 0
    // Estimate shares (usually 10% of likes)
    dailyData[date].shares += Math.round((parseInt(row.like_count) || 0) * 0.1)
  })

  return Object.entries(dailyData).map(([date, values]) => ({
    date,
    likes: values.likes,
    comments: values.comments,
    shares: values.shares
  })).slice(-30)
}

// Generate video performance data by category
const generateVideoPerformanceData = (data) => {
  // Group by channel/category and calculate performance
  const channelData = {}
  
  data.forEach(row => {
    const channel = row.channel_title || 'Unknown'
    if (!channelData[channel]) {
      channelData[channel] = {
        name: channel,
        views: 0,
        engagement: 0,
        subscribers: 0,
        count: 0,
        totalViews: 0
      }
    }
    channelData[channel].views += parseInt(row.view_count) || 0
    channelData[channel].totalViews += parseInt(row.view_count) || 0
    channelData[channel].engagement += (parseInt(row.like_count) || 0) + (parseInt(row.comment_count) || 0)
    channelData[channel].subscribers += parseInt(row.subscriber_count) || 0
    channelData[channel].count += 1
  })

  // Calculate averages and get top 10 channels by total view count
  return Object.values(channelData)
    .map(channel => ({
      name: channel.name,
      views: Math.round(channel.views / channel.count),
      totalViews: channel.totalViews,
      engagement: Math.round(channel.engagement / channel.count),
      subscribers: Math.round(channel.subscribers / channel.count),
      videoCount: channel.count
    }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 10)
}

// Generate weekly upload schedule data
const generateWeeklyUploadData = (data) => {
  const weeklyData = {
    'Monday': { uploads: 0, views: 0 },
    'Tuesday': { uploads: 0, views: 0 },
    'Wednesday': { uploads: 0, views: 0 },
    'Thursday': { uploads: 0, views: 0 },
    'Friday': { uploads: 0, views: 0 },
    'Saturday': { uploads: 0, views: 0 },
    'Sunday': { uploads: 0, views: 0 }
  }

  data.forEach(row => {
    const date = new Date(row.published_at)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    if (weeklyData[dayName]) {
      weeklyData[dayName].uploads += 1
      weeklyData[dayName].views += parseInt(row.view_count) || 0
    }
  })

  return Object.entries(weeklyData).map(([day, data]) => ({
    day,
    uploads: data.uploads,
    views: data.views
  }))
}

// Generate top tags data
const generateTopTagsData = (data) => {
  const tagCounts = {}
  
  data.forEach(row => {
    if (row.tags) {
      // Split tags by comma and clean them
      const tags = row.tags.split(',').map(tag => tag.trim().toLowerCase())
      tags.forEach(tag => {
        if (tag && tag.length > 0) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
      })
    }
  })

  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: Math.round((count / data.length) * 100)
    }))
}

// Generate duration vs engagement data
const generateDurationEngagementData = (data) => {
  return data.map(row => ({
    duration: parseInt(row.duration_seconds) || 0,
    views: parseInt(row.view_count) || 0,
    engagement: (parseInt(row.like_count) || 0) + (parseInt(row.comment_count) || 0),
    engagementRate: parseInt(row.view_count) > 0 ? 
      ((parseInt(row.like_count) || 0) + (parseInt(row.comment_count) || 0)) / parseInt(row.view_count) * 100 : 0
  })).filter(item => item.duration > 0 && item.views > 0)
}

// Generate topic categories data
const generateTopicCategoriesData = (data) => {
  const categoryData = {}
  
  data.forEach(row => {
    // Extract topic from tags or use channel title as category
    let category = 'Other'
    if (row.tags) {
      const tags = row.tags.toLowerCase()
      if (tags.includes('gaming') || tags.includes('game')) category = 'Gaming'
      else if (tags.includes('music') || tags.includes('song')) category = 'Music'
      else if (tags.includes('tutorial') || tags.includes('how to')) category = 'Tutorial'
      else if (tags.includes('review') || tags.includes('product')) category = 'Review'
      else if (tags.includes('vlog') || tags.includes('daily')) category = 'Vlog'
      else if (tags.includes('comedy') || tags.includes('funny')) category = 'Comedy'
      else if (tags.includes('news') || tags.includes('politics')) category = 'News'
      else if (tags.includes('sports') || tags.includes('fitness')) category = 'Sports'
    }
    
    if (!categoryData[category]) {
      categoryData[category] = {
        name: category,
        views: 0,
        engagement: 0,
        videos: 0,
        avgDuration: 0
      }
    }
    
    categoryData[category].views += parseInt(row.view_count) || 0
    categoryData[category].engagement += (parseInt(row.like_count) || 0) + (parseInt(row.comment_count) || 0)
    categoryData[category].videos += 1
    categoryData[category].avgDuration += parseInt(row.duration_seconds) || 0
  })

  return Object.values(categoryData).map(category => ({
    ...category,
    avgViews: Math.round(category.views / category.videos),
    avgEngagement: Math.round(category.engagement / category.videos),
    avgDuration: Math.round(category.avgDuration / category.videos)
  })).sort((a, b) => b.views - a.views)
}

// Generate recent activity feed
const generateRecentActivity = (data) => {
  // Sort by published date and get recent videos
  const recentVideos = data
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
    .slice(0, 5)

  return recentVideos.map(video => {
    const publishedDate = new Date(video.published_at)
    const now = new Date()
    const diffTime = Math.abs(now - publishedDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let timeAgo
    if (diffDays === 1) timeAgo = '1 day ago'
    else if (diffDays < 7) timeAgo = `${diffDays} days ago`
    else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} weeks ago`
    else timeAgo = `${Math.floor(diffDays / 30)} months ago`

    return {
      action: 'New video uploaded',
      value: video.title || 'Untitled Video',
      time: timeAgo,
      type: 'upload',
      views: formatNumber(parseInt(video.view_count) || 0)
    }
  })
}

// Format numbers for display
const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// Default data if CSV processing fails
const getDefaultData = () => {
  return {
    kpiData: {
      subscriberGrowth: { current: 0, previous: 0, change: 0, trend: 'up', totalSubscribers: 0 },
      uploadFrequency: { current: 0, previous: 0, change: 0, trend: 'up', videosThisMonth: 0, channelAge: 0 },
      viewsPerUpload: { current: 0, previous: 0, change: 0, trend: 'up', totalViews: 0 },
      engagementPerUpload: { current: 0, previous: 0, change: 0, trend: 'up', totalEngagement: 0 },
      subscribersPerUpload: { current: 0, previous: 0, change: 0, trend: 'up', totalSubscriberGain: 0 }
    },
    chartData: {
      subscriberData: [],
      engagementData: [],
      videoPerformanceData: [],
      weeklyUploadData: []
    },
    recentActivity: [],
    rawData: []
  }
} 