"use client";
import { useState, useEffect, type FormEvent } from "react";
import {
  Droplets,
  RefreshCw,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  MapPin,
} from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useAppContext } from "../context/AppContext";
import {
  fetchWeatherData,
  getWeatherIconUrl,
  type WeatherData,
  getCurrentLocation,
} from "../services/weatherService";
import LoadingSpinnerModern from "../components/LoadingSpinner";
import axios from "axios";


export default function Dashboard() {
  const { isLoading, refreshData, sendEmergencyBroadcast, user } =
    useAppContext();
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSeverity, setSelectedSeverity] = useState(
    "All Severity Levels"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const theme = useTheme();

  const riskData = {
    low: { count: 3, color: theme.palette.success.main },
    moderate: { count: 5, color: theme.palette.warning.main },
    high: { count: 2, color: theme.palette.error.main },
  };

  const stats = {
    activeAlerts: { count: 12, change: "+2" },
    evacuated: { count: 1234, change: "+89" },
    rescueTeams: { count: 8, change: "-1" },
    openShelters: { count: 15, change: "+3" },
  };

  const threshold = 3.5;
  const waterLevelData = Array.from({ length: 8 }, (_, i) => {
    const currentLevel = +(Math.random() * 2 + 1).toFixed(2);
    const predictedLevel = +(currentLevel + (Math.random() * 1 + 0.5)).toFixed(
      2
    );

    if (predictedLevel > threshold) {
      console.warn(
        `⚠️ Flood risk at ${i * 3}:00 — predicted: ${predictedLevel}m`
      );
    }

    return {
      time: `${String(i * 3).padStart(2, "0")}:00`,
      currentLevel,
      predictedLevel,
    };
  });

  const lastEntry = waterLevelData[waterLevelData.length - 1];
  const predictedPeak = Math.max(
    ...waterLevelData.map((entry) => entry.predictedLevel)
  );
  const timeToPeak =
    waterLevelData.find((entry) => entry.predictedLevel === predictedPeak)
      ?.time ?? "Unknown";

  const [floodLevels, setFloodLevels] = useState({
    current: 0,
    predicted: 0,
    timeToPeak: "N/A",
  });

  useEffect(() => {
    const fetchWaterLevel = async () => {
      try {
        const response = await axios.get(
          "google.com"
        );
        const feeds = response.data.feeds;
        const latestFeed = feeds[feeds.length - 1];
        const level = Math.max(0, Number.parseFloat(latestFeed.field1));

        const recentLevels = feeds
          .map((feed: { field1: string }) => Number.parseFloat(feed.field1))
          .filter((val: number) => !isNaN(val) && val >= 0);

        let predictedLevel = level;
        let timeToPeak = "N/A";

        if (recentLevels.length >= 2) {
          const changes: number[] = [];

          for (let i = 1; i < recentLevels.length; i++) {
            changes.push(recentLevels[i] - recentLevels[i - 1]);
          }

          const avgChange =
            changes.reduce((sum, c) => sum + c, 0) / changes.length;

          if (avgChange > 0) {
            predictedLevel = +(level + avgChange * 3).toFixed(2);

            const minutesToPeak = Math.round(
              (30 * (predictedLevel - level)) / avgChange
            );

            if (minutesToPeak <= 60) {
              timeToPeak = `${minutesToPeak} mins`;
            } else {
              const hours = Math.floor(minutesToPeak / 60);
              const mins = minutesToPeak % 60;
              timeToPeak = `${hours}h ${mins}m`;
            }
          } else if (avgChange < 0) {
            predictedLevel = level;
            timeToPeak = "Decreasing";
          } else {
            predictedLevel = level;
            timeToPeak = "Stable";
          }
        }

        setFloodLevels({
          current: level,
          predicted: predictedLevel,
          timeToPeak,
        });
      } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
      }
    };

    fetchWaterLevel();
    const interval = setInterval(fetchWaterLevel, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const coords = await getCurrentLocation();
      const data = await fetchWeatherData(undefined, coords);
      setWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      const data = await fetchWeatherData();
      setWeather(data);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    await loadWeatherData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSendBroadcast = async (e: FormEvent) => {
    e.preventDefault();
    if (broadcastMessage.trim()) {
      setSendingBroadcast(true);
      try {
        await sendEmergencyBroadcast(broadcastMessage);
        setBroadcastMessage("");
        setShowBroadcastModal(false);
      } catch (error) {
        console.error("Error sending broadcast:", error);
      } finally {
        setSendingBroadcast(false);
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinnerModern variant="bar-wave" size="md" color="primary" />;
  }

  // --- Helper: chunk stats into rows of 2
  const statEntries = Object.entries(stats);
  const statRows: Array<Array<[string, { count: number; change: string }]>> =
    [];
  for (let i = 0; i < Math.min(4, statEntries.length); i += 2) {
    statRows.push(statEntries.slice(i, i + 2));
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 3,
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Welcome, {user?.name || "User"}!
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            startIcon={
              refreshing ? (
                <CircularProgress size={20} />
              ) : (
                <RefreshCw size={18} />
              )
            }
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Refresh Data
          </Button>
          <Button
            onClick={() => setShowBroadcastModal(true)}
            startIcon={<AlertTriangle size={18} />}
            variant="contained"
            color="error"
            sx={{ textTransform: "none", width: { xs: "100%", sm: "auto" } }}
          >
            Emergency Broadcast
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Location</InputLabel>
          <Select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            label="Location"
          >
            <MenuItem value="All Locations">All Locations</MenuItem>
            <MenuItem value="Downtown">Downtown</MenuItem>
            <MenuItem value="Riverside">Riverside</MenuItem>
            <MenuItem value="North District">North District</MenuItem>
            <MenuItem value="South Bay">South Bay</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Severity</InputLabel>
          <Select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            label="Severity"
          >
            <MenuItem value="All Severity Levels">All Severity Levels</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Risk Data Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        {Object.entries(riskData).map(([level, data]) => (
          <Card key={level} sx={{ flex: 1 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                    {level} Risk
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, mt: 1, color: data.color }}
                  >
                    {data.count}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Zones
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: data.color,
                    opacity: 0.15,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Main Content Grid */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3} sx={{ mb: 3 }}>
        {/* Weather Card */}
        <Card sx={{ flex: { lg: 1 } }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Current Weather
            </Typography>
            {weatherLoading ? (
              <LoadingSpinnerModern
                variant="gradient-ring"
                size="md"
                color="#7c3aed"
              />
            ) : weather ? (
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      {weather.temp}°C
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {weather.condition}
                    </Typography>
                  </Box>
                  <img
                    src={getWeatherIconUrl(weather.icon) || "/placeholder.svg"}
                    alt={weather.condition}
                    style={{ width: 64, height: 64 }}
                  />
                </Box>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Droplets size={20} color={theme.palette.info.main} />
                    <Typography variant="body2">
                      Humidity: {weather.humidity}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Droplets size={20} color={theme.palette.info.main} />
                    <Typography variant="body2">
                      Rainfall: {weather.rainfall}mm
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MapPin size={20} color={theme.palette.info.main} />
                    <Typography variant="body2">
                      Location: {weather.location}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            ) : (
              <Typography color="textSecondary">
                Weather data unavailable
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Stats area: exact 2 + 2 layout using explicit rows */}
        <Box sx={{ flex: { lg: 1 }, width: "100%" }}>
          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            {statRows.map((row, rowIndex) => (
              <Stack
                key={rowIndex}
                direction="row"
                spacing={2}
                sx={{ width: "100%" }}
                justifyContent="center"
              >
                {row.map(([key, data]) => (
                  <StatCard key={key} title={key} data={data} theme={theme} />
                ))}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Flood Predictions */}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
        <Card sx={{ flex: { lg: 1 } }}>
          <CardContent>
            <Box
              sx={{
                height: 310,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <iframe
                src="https://thingspeak.com/channels/2901817/charts/1?bgcolor=%23ffffff&color=%230072bd&dynamic=true&type=line&update=15&width=2000&height=310"
                style={{
                  width: "100%",
                  height: "100%",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                }}
                allowFullScreen
                title="Real-Time Water Level"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Flood Level Predictions */}
        <Card sx={{ flex: { lg: 1 } }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Flood Level Predictions
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Current Level
                </Typography>
                <Box
                  sx={{
                    height: 12,
                    bgcolor: theme.palette.success.main,
                    borderRadius: 1,
                    width: `${(floodLevels.current / 800) * 100}%`,
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  {floodLevels.current}m
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Predicted Peak
                </Typography>
                <Box
                  sx={{
                    height: 12,
                    bgcolor: theme.palette.error.main,
                    borderRadius: 1,
                    width: `${(floodLevels.predicted / 800) * 100}%`,
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                  {floodLevels.predicted}m
                </Typography>
              </Box>
              <Box
                sx={{ pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}
              >
                <Typography variant="body2" color="textSecondary">
                  Time to Peak
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mt: 1,
                    fontWeight: 700,
                    color:
                      floodLevels.timeToPeak === "Receding"
                        ? theme.palette.error.main
                        : floodLevels.timeToPeak === "Stable"
                        ? theme.palette.success.main
                        : theme.palette.info.main,
                  }}
                >
                  {floodLevels.timeToPeak}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Emergency Broadcast Dialog */}
      <Dialog
        open={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Emergency Broadcast</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Broadcast Message"
            multiline
            rows={4}
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            placeholder="Enter emergency broadcast message..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowBroadcastModal(false)}>Cancel</Button>
          <Button
            onClick={handleSendBroadcast}
            disabled={!broadcastMessage.trim() || sendingBroadcast}
            variant="contained"
            color="error"
            startIcon={
              sendingBroadcast ? <CircularProgress size={20} /> : undefined
            }
          >
            {sendingBroadcast ? "Sending..." : "Send Broadcast"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/* Reusable small stat card used in the 2x2 layout */
function StatCard({
  title,
  data,
  theme,
}: {
  title: string;
  data: { count: number; change: string };
  theme: any;
}) {
  const positive = data.change.startsWith("+");
  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "48%" },
        maxWidth: { xs: "100%", sm: "48%" },
        display: "flex",
        flexDirection: "column",
        minHeight: 140,
        boxSizing: "border-box",
      }}
    >
      <CardContent
        sx={{
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textTransform: "capitalize" }}
        >
          {title.replace(/([A-Z])/g, " $1").trim()}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
          {data.count}
        </Typography>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1.5,
            color: positive
              ? theme.palette.success.main
              : theme.palette.error.main,
            alignSelf: "center",
          }}
        >
          {positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {data.change.replace(/^[+-]/, "")} from yesterday
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
