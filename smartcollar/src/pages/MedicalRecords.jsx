import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { medicalRecords } from '@/data/dummy';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const statusChip = (nextDue) => {
  const due = new Date(nextDue);
  const now = new Date();
  const diff = (due - now) / (1000 * 60 * 60 * 24);
  if (diff < 0) return <Chip color="error" label="Overdue" size="small" />;
  if (diff < 30) return <Chip color="warning" label="Due Soon" size="small" />;
  return <Chip color="success" label="Up-to-date" size="small" />;
};

const MedicalRecords = () => {
  const { user } = useAuth();
  const isAdmin = user?.type === 'admin';
  const [records, setRecords] = useState(medicalRecords.vaccinations);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    vaccine: '',
    date: '',
    nextDue: '',
    provider: ''
  });

  const handleAddRecord = () => {
    setOpenAddDialog(true);
    setFormData({
      vaccine: '',
      date: '',
      nextDue: '',
      provider: ''
    });
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setOpenEditDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setEditingRecord(null);
    setFormData({
      vaccine: '',
      date: '',
      nextDue: '',
      provider: ''
    });
  };

  const handleSaveRecord = () => {
    if (openEditDialog && editingRecord) {
      // Update existing record
      setRecords(records.map(record =>
        record === editingRecord ? formData : record
      ));
    } else {
      // Add new record
      setRecords([...records, formData]);
    }
    handleCloseDialogs();
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleExportCSV = () => {
    const headers = ['Vaccine', 'Date', 'Next Due', 'Provider', 'Status'];
    const csvData = records.map(record => {
      const statusElement = statusChip(record.nextDue);
      const statusText = statusElement.props.label || 'Unknown';
      return [
        record.vaccine,
        record.date,
        record.nextDue,
        record.provider,
        statusText
      ];
    });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `medical_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    const element = document.querySelector('.medical-records-table');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Add title
      pdf.setFontSize(16);
      pdf.text('Medical Records Report', pdfWidth / 2, 5, { align: 'center' });

      pdf.save(`medical_records_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 3 }, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, flex: 1 }}>Medical Records</Typography>
        <Stack direction="row" spacing={1}>
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddRecord}
              sx={{ mr: 1 }}
            >
              Add Record
            </Button>
          )}
          <Button variant="outlined" onClick={handleExportCSV}>Export CSV</Button>
          <Button variant="contained" onClick={handleExportPDF}>Export PDF</Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>Vaccination Records</Typography>
              <Table size="small" className="medical-records-table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Vaccine</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Next Due</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Status</TableCell>
                    {isAdmin && <TableCell>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{record.vaccine}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.nextDue}</TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell>{statusChip(record.nextDue)}</TableCell>
                      {isAdmin && (
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRecord(record)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Record Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Vaccination Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Vaccine Name"
              value={formData.vaccine}
              onChange={handleInputChange('vaccine')}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange('date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Due Date"
              type="date"
              value={formData.nextDue}
              onChange={handleInputChange('nextDue')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Provider"
              value={formData.provider}
              onChange={handleInputChange('provider')}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleSaveRecord} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Vaccination Record</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Vaccine Name"
              value={formData.vaccine}
              onChange={handleInputChange('vaccine')}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleInputChange('date')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Due Date"
              type="date"
              value={formData.nextDue}
              onChange={handleInputChange('nextDue')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Provider"
              value={formData.provider}
              onChange={handleInputChange('provider')}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Cancel</Button>
          <Button onClick={handleSaveRecord} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecords;
