import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
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
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

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
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const FinancialDashboard: React.FC = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<any>({
    balanceSheet: [],
    incomeStatement: [],
    cashFlow: [],
    ratios: {},
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const [balanceSheet, incomeStatement, cashFlow, ratios] = await Promise.all([
          api.get('/financial/reports/balance-sheet'),
          api.get('/financial/reports/income-statement'),
          api.get('/financial/reports/cash-flow'),
          api.get('/financial/reports/ratios'),
        ]);

        setFinancialData({
          balanceSheet: balanceSheet.data,
          incomeStatement: incomeStatement.data,
          cashFlow: cashFlow.data,
          ratios: ratios.data,
        });
      } catch (err) {
        setError('Failed to fetch financial data');
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Financial Dashboard
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Overview" />
            <Tab label="Balance Sheet" />
            <Tab label="Income Statement" />
            <Tab label="Cash Flow" />
            <Tab label="Ratios" />
          </Tabs>

          <TabPanel value={value} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Key Financial Ratios
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(financialData.ratios).map(([key, value]) => ({
                      name: key,
                      value: value,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Revenue vs Expenses
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={financialData.incomeStatement}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Cash Flow Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(financialData.cashFlow).map(([key, value]) => ({
                          name: key,
                          value: value,
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(financialData.cashFlow).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Balance Sheet
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={financialData.balanceSheet}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="account" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="debit" fill="#8884d8" />
                      <Bar dataKey="credit" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Income Statement
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={financialData.incomeStatement}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="netIncome" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Cash Flow Statement
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={financialData.cashFlow}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="operating" stroke="#8884d8" />
                      <Line type="monotone" dataKey="investing" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="financing" stroke="#ffc658" />
                      <Line type="monotone" dataKey="netCashFlow" stroke="#ff8042" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Financial Ratios
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(financialData.ratios).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="subtitle1" color="textSecondary">
                            {key}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {typeof value === 'number' ? value.toFixed(2) : String(value)}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default FinancialDashboard; 