import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { Calendar } from "./components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { CalendarIcon, Leaf, Car, Bus, Train, Plane, FootprintsIcon, TrendingUp, BarChart3, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Components
const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">EcoTrack</h1>
        </div>
        <Button data-testid="get-started-btn" onClick={() => setShowAuth(true)} className="bg-emerald-600 hover:bg-emerald-700">
          Get Started
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Track Your Carbon Footprint,
            <span className="text-emerald-600 block">Make a Difference</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Monitor your daily transportation emissions, visualize trends, and get actionable insights to reduce your environmental impact.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Track Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Log your daily transportation activities and automatically calculate carbon emissions.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Visualize Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View daily, weekly, and monthly emission trends with beautiful charts.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <Leaf className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Reduce Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Get personalized recommendations to lower your carbon footprint.</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            data-testid="hero-get-started-btn"
            onClick={() => setShowAuth(true)} 
            className="mt-12 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg"
          >
            Start Tracking Today
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <AuthModal onClose={() => setShowAuth(false)} />
        </div>
      )}
    </div>
  );
};

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API}${endpoint}`, payload);
      login(response.data.access_token);
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                data-testid="name-input"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              data-testid="email-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              data-testid="password-input"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button 
            data-testid="auth-submit-btn"
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700" 
            disabled={loading}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <Button 
            variant="link" 
            onClick={() => setIsLogin(!isLogin)}
            className="p-0 ml-2 text-emerald-600"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [activitiesRes, statsRes] = await Promise.all([
        axios.get(`${API}/activities`, { headers }),
        axios.get(`${API}/dashboard/stats`, { headers })
      ]);
      
      setActivities(activitiesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransportIcon = (type) => {
    const icons = {
      car: Car,
      bus: Bus,
      train: Train,
      flight: Plane,
      walking: FootprintsIcon,
      cycling: FootprintsIcon
    };
    const Icon = icons[type] || Car;
    return <Icon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">EcoTrack</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, {user?.name}</span>
            <Button variant="outline" onClick={logout} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger data-testid="dashboard-tab" value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger data-testid="add-activity-tab" value="add-activity">Add Activity</TabsTrigger>
            <TabsTrigger data-testid="history-tab" value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab stats={stats} />
          </TabsContent>

          <TabsContent value="add-activity">
            <AddActivityTab onActivityAdded={fetchData} />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab activities={activities} getTransportIcon={getTransportIcon} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const DashboardTab = ({ stats }) => {
  const [chartData, setChartData] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [chartPeriod]);

  const fetchChartData = async () => {
    setChartLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/activities/chart-data?period=${chartPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data.data;
      setChartData({
        labels: data.map(item => {
          if (chartPeriod === 'daily') {
            return format(new Date(item.date), 'MM/dd');
          } else if (chartPeriod === 'weekly') {
            return `Week ${item.date.split('-W')[1]}`;
          } else {
            return format(new Date(item.date + '-01'), 'MMM yyyy');
          }
        }),
        datasets: [
          {
            label: 'CO₂ Emissions (kg)',
            data: data.map(item => item.emissions),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '500'
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + ' kg';
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          maxRotation: 0,
        }
      }
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      }
    }
  };

  return (
    <div data-testid="dashboard-content" className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_emissions || 0} kg</div>
            <p className="text-xs text-gray-500">CO₂ equivalent</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_activities || 0}</div>
            <p className="text-xs text-gray-500">Recorded trips</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.avg_daily_emissions || 0} kg</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.current_month_emissions || 0} kg</div>
            <p className="text-xs text-gray-500">CO₂ emissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Emissions Trend</CardTitle>
              <CardDescription>Your carbon footprint over time</CardDescription>
            </div>
            <Select value={chartPeriod} onValueChange={setChartPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : chartData && chartData.datasets[0].data.some(val => val > 0) ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center bg-emerald-50 rounded-lg border-2 border-dashed border-emerald-200">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-emerald-300 mx-auto mb-4" />
                  <p className="text-emerald-600 font-medium">No emissions data yet</p>
                  <p className="text-emerald-500 text-sm">Start logging activities to see your trends!</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AddActivityTab = ({ onActivityAdded }) => {
  const [formData, setFormData] = useState({
    transport_type: '',
    distance_km: '',
    date: new Date(),
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/activities`, {
        ...formData,
        distance_km: parseFloat(formData.distance_km),
        date: formData.date.toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFormData({
        transport_type: '',
        distance_km: '',
        date: new Date(),
        description: ''
      });
      onActivityAdded();
    } catch (error) {
      console.error('Failed to add activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card data-testid="add-activity-form" className="bg-white/70 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Transportation Activity
        </CardTitle>
        <CardDescription>
          Log your transportation activities to track your carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Transport Type</Label>
            <Select 
              value={formData.transport_type} 
              onValueChange={(value) => setFormData({...formData, transport_type: value})}
            >
              <SelectTrigger data-testid="transport-type-select">
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">🚗 Car</SelectItem>
                <SelectItem value="bus">🚌 Bus</SelectItem>
                <SelectItem value="train">🚊 Train</SelectItem>
                <SelectItem value="flight">✈️ Flight</SelectItem>
                <SelectItem value="walking">🚶 Walking</SelectItem>
                <SelectItem value="cycling">🚴 Cycling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              data-testid="distance-input"
              type="number"
              step="0.1"
              min="0"
              value={formData.distance_km}
              onChange={(e) => setFormData({...formData, distance_km: e.target.value})}
              placeholder="Enter distance in kilometers"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button 
                  data-testid="date-picker"
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(formData.date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({...formData, date: date || new Date()});
                    setShowCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              data-testid="description-input"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Add notes about this trip..."
            />
          </div>

          <Button 
            data-testid="submit-activity-btn"
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700" 
            disabled={loading || !formData.transport_type || !formData.distance_km}
          >
            {loading ? 'Adding...' : 'Add Activity'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const HistoryTab = ({ activities, getTransportIcon }) => {
  return (
    <div data-testid="history-content" className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Activity History</h3>
      
      {activities.length === 0 ? (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <Leaf className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-700 mb-2">No activities yet</h4>
            <p className="text-gray-500">Start logging your transportation activities to see your carbon footprint!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      {getTransportIcon(activity.transport_type)}
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize text-gray-900">
                        {activity.transport_type.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.distance_km} km • {format(new Date(activity.date), "PP")}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {activity.carbon_footprint_kg} kg CO₂
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppRouter />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

const AppRouter = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return token ? <Dashboard /> : <LandingPage />;
};

export default App;