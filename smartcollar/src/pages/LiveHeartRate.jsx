import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import HeartRateChart from "@/components/charts/HeartRateChart";
import { db } from "@/firebase"; // ✅ Realtime Database now
import { ref, onValue } from "firebase/database"; // ✅ get() is optional here

// Helper: classify BPM
const getStatus = (bpm) => {
  if (bpm >= 160) return { color: "error", text: "Critical" };
  if (bpm >= 120) return { color: "warning", text: "Elevated" };
  if (bpm >= 60) return { color: "success", text: "Normal" };
  if (bpm > 0) return { color: "info", text: "Low" };
  return { color: "default", text: "Offline" };
};

const formatTimestamp = (ts) => {
  if (!ts) return "Unknown";
  const timestamp = ts < 1e12 ? ts * 1000 : ts;
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const STALE_THRESHOLD_MS = 10_000; // 10 seconds

const LiveHeartRate = () => {
  const [bpm, setBpm] = useState(0);
  const [piezoStatus, setPiezoStatus] = useState("OFF");
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState("Unknown");
  const [isOnline, setIsOnline] = useState(false);

  // Use ref to avoid closures in intervals
  const stateRef = useRef({ bpm: 0, lastTimestamp: 0 });

  useEffect(() => {
    const hrRef = ref(db, "heartRate");
    const piezoRef = ref(db, "piezo");

    let unsubscribeHR = null;
    let unsubscribePiezo = null;

    // 🔁 Inactivity monitor
    const inactivityTimer = setInterval(() => {
      const now = Date.now();
      const dataAge = now - stateRef.current.lastTimestamp;

      if (dataAge > STALE_THRESHOLD_MS) {
        if (isOnline) {
          console.warn("⚠️ Sensor data stale (>10s). Forcing BPM=0 & Offline.");
          setIsOnline(false);
          setBpm(0);
          setHistory((prev) => [...prev.slice(-59), { t: now, v: 0 }]);
          setLastUpdate("Stale → Reset");
        }
      }
    }, 2000); // check every 2s

    // 📡 Listen to heartRate
    unsubscribeHR = onValue(hrRef, (snapshot) => {
      const data = snapshot.val();
      const now = Date.now();

      if (!data || typeof data.bpm !== "number" || !data.timestamp) {
        console.warn("⚠️ Invalid or missing heartRate data");
        return;
      }

      const newBpm = data.bpm;
      const tsFromFirebase = Number(data.timestamp);
      const localReceiveTime = now;

      // Accept only if timestamp is reasonably fresh (e.g., within 30s)
      // But mostly rely on reception time for staleness
      const ageAtReceive = localReceiveTime - tsFromFirebase;
      if (ageAtReceive > 60_000) {
        console.warn("⚠️ Very old timestamp — skipping:", new Date(tsFromFirebase));
        return;
      }

      // ✅ Fresh data!
      stateRef.current = { bpm: newBpm, lastTimestamp: localReceiveTime };

      setBpm(newBpm);
      setLastUpdate(formatTimestamp(tsFromFirebase));
      setIsOnline(true);

      setHistory((prev) => [
        ...prev.slice(-59),
        { t: localReceiveTime, v: newBpm },
      ]);
    });

    // 📡 Listen to piezo
    unsubscribePiezo = onValue(piezoRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.status !== undefined) setPiezoStatus(data.status);
    });

    return () => {
      if (unsubscribeHR) unsubscribeHR();
      if (unsubscribePiezo) unsubscribePiezo();
      clearInterval(inactivityTimer);
    };
  }, []);

  // 🔊 Calming sound
  const handleCalmingSound = async () => {
    await import("firebase/database").then(({ ref: r, set }) => {
      const piezoRef = r(db, "piezo/status");
      set(piezoRef, "ON");
      setPiezoStatus("ON");
      setTimeout(() => {
        set(piezoRef, "OFF");
        setPiezoStatus("OFF");
      }, 5000);
    });
  };

  const status = getStatus(bpm);

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, md: 3 }, width: "100%" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Live Heart Rate
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        {/* LEFT */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Current BPM
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  color: isOnline ? "text.primary" : "text.disabled",
                  transition: "color 0.4s ease",
                }}
              >
                {isOnline ? bpm : 0}
              </Typography>
              <Chip label={status.text} color={status.color} />
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1 }}
                color="text.secondary"
              >
                Status ranges: Normal 60–120 • Elevated 120–160 • Critical 160+
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Collar Status
              </Typography>
              <Typography variant="body2">
                Connection:{" "}
                <Chip
                  label={isOnline ? "Online" : "Offline"}
                  color={isOnline ? "success" : "default"}
                  size="small"
                />
              </Typography>
              <Typography variant="body2">
                Last update:{" "}
                <strong style={{ color: "#90caf9" }}>{lastUpdate}</strong>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Buzzer:{" "}
                <Chip
                  label={piezoStatus}
                  color={piezoStatus === "ON" ? "success" : "default"}
                  size="small"
                />
              </Typography>
              <Button
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={handleCalmingSound}
                disabled={!isOnline}
              >
                Trigger Calming Sound
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Real-time Graph
              </Typography>
              <HeartRateChart
                data={history}
                style={{
                  opacity: isOnline ? 1 : 0.3,
                  transition: "opacity 0.5s ease",
                }}
              />
              {!isOnline && (
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 1,
                    color: "#f44336",
                    fontWeight: 600,
                    textShadow: "0 0 4px rgba(255,69,58,0.4)",
                  }}
                >
                  ⚠️ Sensor disconnected — Showing 0 BPM until fresh data
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiveHeartRate;