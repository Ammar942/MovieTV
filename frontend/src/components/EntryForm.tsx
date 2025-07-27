// frontend/src/components/EntryForm.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import type { Entry, EntryFormData } from "../types";

interface EntryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EntryFormData) => void;
  initialData?: Entry | null; // For editing
}

const defaultFormData: EntryFormData = {
  title: "",
  type: "",
  director: "",
  budget: "",
  location: "",
  duration: "",
  releaseYear: "",
  endTime: "",
  notes: "",
  poster: "",
};

const EntryForm: React.FC<EntryFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<EntryFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        director: initialData.director,
        budget: initialData.budget || "",
        location: initialData.location || "",
        duration: initialData.duration || "",
        releaseYear: initialData.releaseYear,
        endTime: initialData.endTime || "",
        notes: initialData.notes || "",
        poster: initialData.poster || "",
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({}); // Clear errors when dialog opens or initialData changes
  }, [initialData, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
    // Clear error for the field being typed into
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!formData.type) {
      newErrors.type = "Type is required";
      isValid = false;
    }
    if (!formData.director.trim()) {
      newErrors.director = "Director is required";
      isValid = false;
    }
    if (formData.releaseYear === "" || isNaN(Number(formData.releaseYear))) {
      newErrors.releaseYear = "Valid year is required";
      isValid = false;
    } else if (
      Number(formData.releaseYear) < 1888 ||
      Number(formData.releaseYear) > new Date().getFullYear() + 5
    ) {
      newErrors.releaseYear = "Year must be realistic";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-bold">
        {initialData ? "Edit Entry" : "Add New Entry"}
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense" error={!!errors.type}>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={formData.type}
                  label="Type"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  <MenuItem value="Movie">Movie</MenuItem>
                  <MenuItem value="TV_Show">TV Show</MenuItem>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="director"
                label="Director"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.director}
                onChange={handleChange}
                error={!!errors.director}
                helperText={errors.director}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="releaseYear"
                label="Release Year"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.releaseYear}
                onChange={handleChange}
                error={!!errors.releaseYear}
                helperText={errors.releaseYear}
                inputProps={{ min: 1888, max: new Date().getFullYear() + 5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="budget"
                label="Budget"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.budget}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="location"
                label="Location"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="duration"
                label="Duration (e.g., '2h 30m', '7 Seasons')"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.duration}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="endTime"
                label="End Time/Year (for TV Shows)"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.endTime}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="notes"
                label="Notes / Other Details"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="poster"
                label="Poster URL"
                type="url"
                fullWidth
                variant="outlined"
                value={formData.poster}
                onChange={handleChange}
                placeholder="https://example.com/poster.jpg"
                helperText="Enter a URL for the movie/show poster image"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="error"
          variant="outlined"
          className="capitalize"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          className="capitalize"
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryForm;
