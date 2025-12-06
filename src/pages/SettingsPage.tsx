"use client";
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Grid,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Camera, Check, Edit2 } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`,
  };
}

export default function SettingsPageModern() {
  const theme = useTheme();
  const {
    settings = {
      fullName: "",
      email: "",
      phone: "",
      theme: "system",
      twoFactorEnabled: false,
      timezone: "UTC",
    },
    loading,
    saveAccountSettings,
    savePreferences,
    saveSecuritySettings,
  } = useSettings();

  const [tabValue, setTabValue] = useState(0);

  const [accountForm, setAccountForm] = useState({
    fullName: settings.fullName || "",
    email: settings.email || "",
    phone: settings.phone || "",
    timezone: (settings as any).timezone || "UTC",
  });
  const [accountSaved, setAccountSaved] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  const [preferenceForm, setPreferenceForm] = useState({
    theme: (settings as any).theme || "system",
  });
  const [prefSaved, setPrefSaved] = useState(false);

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: (settings as any).twoFactorEnabled || false,
  });
  const [securitySaved, setSecuritySaved] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const presetAvatars =""
  const handleTabChange = (_e: any, v: number) => {
    setTabValue(v);
    setAccountSaved(false);
    setPrefSaved(false);
    setSecuritySaved(false);
  };

  const handleAccountSave = async () => {
    setAccountError(null);
    setAccountSaved(false);
    if (!accountForm.fullName.trim())
      return setAccountError("Full name required");
    if (!accountForm.email.trim()) return setAccountError("Email required");
    const success = await saveAccountSettings?.(accountForm);
    if (success) {
      setAccountSaved(true);
      setTimeout(() => setAccountSaved(false), 3000);
    } else {
      setAccountError("Could not save account settings");
    }
  };

  const handlePreferencesSave = async () => {
    const success = await savePreferences?.(preferenceForm);
    if (success) {
      setPrefSaved(true);
      setTimeout(() => setPrefSaved(false), 2500);
    }
  };

  const handleSecuritySave = async () => {
    setSecurityError(null);
    if (
      securityForm.newPassword &&
      securityForm.newPassword !== securityForm.confirmPassword
    ) {
      return setSecurityError("New password and confirm do not match");
    }
    const success = await saveSecuritySettings?.(securityForm);
    if (success) {
      setSecuritySaved(true);
      setSecurityForm((s) => ({
        ...s,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setTimeout(() => setSecuritySaved(false), 3000);
    } else setSecurityError("Failed to update security settings");
  };

  // small styles to keep layout neat
  const FIELD_BG =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.02)"
      : "rgba(0,0,0,0.03)";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Settings
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Keep your profile and account secure. Modern, compact layout with
            clear alignment.
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            p: 0,
            boxShadow: theme.shadows[8],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="settings tabs"
            >
              <Tab
                label="Account"
                {...a11yProps(0)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              />
              <Tab
                label="Preferences"
                {...a11yProps(1)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              />
              <Tab
                label="Security"
                {...a11yProps(2)}
                sx={{ textTransform: "none", fontWeight: 700 }}
              />
            </Tabs>
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                • Auto-saved drafts
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ p: 4 }}>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: FIELD_BG,
                        boxShadow: "0 8px 30px rgba(2,6,23,0.5)",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 96,
                          height: 96,
                          fontSize: 32,
                          fontWeight: 800,
                        }}
                      >
                        {accountForm.fullName
                          .split(" ")
                          .map((n) => (n ? n[0] : ""))
                          .join("")
                          .toUpperCase()}
                      </Avatar>
                      <IconButton
                        sx={{
                          position: "absolute",
                          right: 6,
                          bottom: 6,
                          bgcolor: "background.paper",
                        }}
                        size="small"
                        aria-label="edit avatar"
                      >
                        <Edit2 size={14} />
                      </IconButton>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <label htmlFor="avatar-upload">
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        <Button
                          component="span"
                          variant="contained"
                          startIcon={<Camera size={14} />}
                          sx={{ textTransform: "none" }}
                        >
                          Upload
                        </Button>
                      </label>
                      <Button variant="outlined" sx={{ textTransform: "none" }}>
                        Presets
                      </Button>
                    </Stack>

                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      JPG, PNG, GIF — max 5MB
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={0}
                    sx={{ p: 3, borderRadius: 2, bgcolor: "transparent" }}
                  >
                    {accountError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {accountError}
                      </Alert>
                    )}
                    {accountSaved && (
                      <Alert
                        icon={<Check size={18} />}
                        severity="success"
                        sx={{ mb: 2 }}
                      >
                        Saved
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full name"
                          variant="outlined"
                          value={accountForm.fullName}
                          onChange={(e) =>
                            setAccountForm({
                              ...accountForm,
                              fullName: e.target.value,
                            })
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          variant="outlined"
                          value={accountForm.email}
                          onChange={(e) =>
                            setAccountForm({
                              ...accountForm,
                              email: e.target.value,
                            })
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          variant="outlined"
                          value={accountForm.phone}
                          onChange={(e) =>
                            setAccountForm({
                              ...accountForm,
                              phone: e.target.value,
                            })
                          }
                          size="small"
                        />
                      </Grid>

                      <Grid item xs={12} sm={8}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Timezone</InputLabel>
                          <Select
                            value={accountForm.timezone}
                            label="Timezone"
                            onChange={(e) =>
                              setAccountForm({
                                ...accountForm,
                                timezone: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="UTC">UTC</MenuItem>
                            <MenuItem value="Pacific Time (UTC-8)">
                              Pacific Time (UTC-8)
                            </MenuItem>
                            <MenuItem value="India Standard Time (UTC+5:30)">
                              India Standard Time (UTC+5:30)
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: { xs: "flex-start", sm: "flex-end" },
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleAccountSave}
                          disabled={loading}
                          sx={{ px: 3, textTransform: "none" }}
                        >
                          {loading ? (
                            <CircularProgress size={18} sx={{ mr: 1 }} />
                          ) : null}
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Box sx={{ mt: 3 }}>
                   
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {presetAvatars.map((p, i) => (
                        <Tooltip key={i} title={`Avatar ${p}`}>
                          <IconButton
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 1.5,
                              bgcolor: FIELD_BG,
                            }}
                          >
                            <Avatar sx={{ width: 44, height: 44 }}>{p}</Avatar>
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {prefSaved && (
                    <Alert icon={<Check size={18} />} severity="success">
                      Preferences saved
                    </Alert>
                  )}

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mt: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Appearance
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={preferenceForm.theme}
                        label="Theme"
                        onChange={(e) =>
                          setPreferenceForm({
                            ...preferenceForm,
                            theme: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="system">System</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handlePreferencesSave}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    {securityError && (
                      <Alert severity="error">{securityError}</Alert>
                    )}
                    {securitySaved && (
                      <Alert icon={<Check size={18} />} severity="success">
                        Security updated
                      </Alert>
                    )}

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current password"
                          type="password"
                          size="small"
                          value={securityForm.currentPassword}
                          onChange={(e) =>
                            setSecurityForm({
                              ...securityForm,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="New password"
                          type="password"
                          size="small"
                          value={securityForm.newPassword}
                          onChange={(e) =>
                            setSecurityForm({
                              ...securityForm,
                              newPassword: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Confirm password"
                          type="password"
                          size="small"
                          value={securityForm.confirmPassword}
                          onChange={(e) =>
                            setSecurityForm({
                              ...securityForm,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            Two-Factor Authentication
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Add an extra layer of security to your account
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={securityForm.twoFactorEnabled}
                              onChange={(e) =>
                                setSecurityForm({
                                  ...securityForm,
                                  twoFactorEnabled: e.target.checked,
                                })
                              }
                            />
                          }
                          label=""
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          variant="contained"
                          onClick={handleSecuritySave}
                          disabled={loading}
                          sx={{ textTransform: "none" }}
                        >
                          {loading ? (
                            <CircularProgress size={18} sx={{ mr: 1 }} />
                          ) : null}
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
