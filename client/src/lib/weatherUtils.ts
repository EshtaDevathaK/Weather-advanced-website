// Format date string to display nicely
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Set dynamic background color based on weather condition
export const getBackgroundColor = (weatherCondition: string) => {
  if (weatherCondition.includes("sunny") || weatherCondition.includes("clear")) {
    return "bg-gradient-to-br from-blue-100 to-yellow-100";
  } else if (weatherCondition.includes("rain") || weatherCondition.includes("drizzle")) {
    return "bg-gradient-to-br from-blue-200 to-slate-200";
  } else if (weatherCondition.includes("cloud") || weatherCondition.includes("overcast")) {
    return "bg-gradient-to-br from-gray-100 to-indigo-100";
  } else if (weatherCondition.includes("snow") || weatherCondition.includes("blizzard")) {
    return "bg-gradient-to-br from-slate-100 to-blue-50";
  } else if (weatherCondition.includes("fog") || weatherCondition.includes("mist")) {
    return "bg-gradient-to-br from-gray-200 to-gray-100";
  } else {
    // Default background
    return "bg-secondary-light";
  }
};

// Get temperature-based color
export const getTemperatureColor = (temperature: number) => {
  if (temperature < 0) return "text-blue-700";
  if (temperature < 10) return "text-blue-500";
  if (temperature < 20) return "text-green-500";
  if (temperature < 30) return "text-yellow-500";
  return "text-red-500";
};
