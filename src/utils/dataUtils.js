import { format, parseISO, subDays, startOfDay, endOfDay } from 'date-fns'

// Format currency values
export const formatCurrency = (value, currency = 'USD') => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value)
  }
}

// Format numbers with appropriate suffixes
export const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  } else {
    return value.toLocaleString()
  }
}

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Generate sample data for charts
export const generateChartData = (days = 30, baseValue = 1000, variance = 0.3) => {
  return Array.from({ length: days }, (_, i) => {
    const date = subDays(new Date(), days - 1 - i)
    const randomFactor = 1 + (Math.random() - 0.5) * variance
    return {
      date: format(date, 'MMM dd'),
      value: Math.floor(baseValue * randomFactor),
      timestamp: date.getTime()
    }
  })
}

// Process KPI data
export const processKPIData = (rawData) => {
  return {
    revenue: {
      current: rawData.revenue?.current || 0,
      previous: rawData.revenue?.previous || 0,
      change: calculatePercentageChange(rawData.revenue?.current || 0, rawData.revenue?.previous || 0),
      trend: (rawData.revenue?.current || 0) >= (rawData.revenue?.previous || 0) ? 'up' : 'down'
    },
    users: {
      current: rawData.users?.current || 0,
      previous: rawData.users?.previous || 0,
      change: calculatePercentageChange(rawData.users?.current || 0, rawData.users?.previous || 0),
      trend: (rawData.users?.current || 0) >= (rawData.users?.previous || 0) ? 'up' : 'down'
    },
    orders: {
      current: rawData.orders?.current || 0,
      previous: rawData.orders?.previous || 0,
      change: calculatePercentageChange(rawData.orders?.current || 0, rawData.orders?.previous || 0),
      trend: (rawData.orders?.current || 0) >= (rawData.orders?.previous || 0) ? 'up' : 'down'
    },
    conversion: {
      current: rawData.conversion?.current || 0,
      previous: rawData.conversion?.previous || 0,
      change: calculatePercentageChange(rawData.conversion?.current || 0, rawData.conversion?.previous || 0),
      trend: (rawData.conversion?.current || 0) >= (rawData.conversion?.previous || 0) ? 'up' : 'down'
    }
  }
}

// Filter data by date range
export const filterDataByDateRange = (data, startDate, endDate) => {
  const start = startOfDay(new Date(startDate))
  const end = endOfDay(new Date(endDate))
  
  return data.filter(item => {
    const itemDate = new Date(item.date || item.timestamp)
    return itemDate >= start && itemDate <= end
  })
}

// Aggregate data by time period
export const aggregateDataByPeriod = (data, period = 'day') => {
  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.date || item.timestamp)
    let key
    
    switch (period) {
      case 'hour':
        key = format(date, 'yyyy-MM-dd HH:00')
        break
      case 'day':
        key = format(date, 'yyyy-MM-dd')
        break
      case 'week':
        key = format(date, 'yyyy-\'W\'ww')
        break
      case 'month':
        key = format(date, 'yyyy-MM')
        break
      default:
        key = format(date, 'yyyy-MM-dd')
    }
    
    if (!acc[key]) {
      acc[key] = {
        date: key,
        count: 0,
        value: 0,
        items: []
      }
    }
    
    acc[key].count += item.count || 1
    acc[key].value += item.value || 0
    acc[key].items.push(item)
    
    return acc
  }, {})
  
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date))
}

// Generate color palette for charts
export const generateColorPalette = (count) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ]
  
  return Array.from({ length: count }, (_, i) => colors[i % colors.length])
}

// Format tooltip values
export const formatTooltipValue = (value, type = 'number') => {
  switch (type) {
    case 'currency':
      return formatCurrency(value)
    case 'percentage':
      return `${value.toFixed(1)}%`
    case 'number':
      return formatNumber(value)
    default:
      return value
  }
}

// Validate data structure
export const validateDataStructure = (data, requiredFields) => {
  if (!data || typeof data !== 'object') {
    return false
  }
  
  return requiredFields.every(field => {
    return data.hasOwnProperty(field) && data[field] !== undefined && data[field] !== null
  })
}

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} 