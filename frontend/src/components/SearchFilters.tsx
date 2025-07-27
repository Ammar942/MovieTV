import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export interface SearchFilters {
  search: string;
  type: string;
  director: string;
  releaseYear: string;
}

export type { SearchFilters };

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  const hasActiveFilters = () => {
    return (
      localFilters.search ||
      localFilters.type ||
      localFilters.director ||
      localFilters.releaseYear
    );
  };

  return (
    <Paper className="p-4 mb-4 shadow-md">
      <Grid container spacing={2} alignItems="center">
        {/* Main search bar */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by title, director, or notes..."
            value={localFilters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: <SearchIcon className="mr-2 text-gray-500" />,
            }}
          />
        </Grid>

        {/* Action buttons */}
        <Grid item xs={12} md={6}>
          <Box className="flex gap-2 justify-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={onSearch}
              className="capitalize"
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="capitalize"
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              Filters
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<ClearIcon />}
                onClick={onClear}
                className="capitalize"
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Advanced filters */}
      <Collapse in={showAdvanced}>
        <Box className="mt-4 pt-4 border-t border-gray-200">
          <Typography variant="h6" className="mb-3 text-gray-700">
            Advanced Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Type</InputLabel>
                <Select
                  value={localFilters.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  label="Type"
                >
                  <MenuItem value="">
                    <em>All Types</em>
                  </MenuItem>
                  <MenuItem value="Movie">Movie</MenuItem>
                  <MenuItem value="TV_Show">TV Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Director"
                placeholder="Filter by director..."
                value={localFilters.director}
                onChange={(e) => handleInputChange("director", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Release Year"
                type="number"
                placeholder="e.g., 2023"
                value={localFilters.releaseYear}
                onChange={(e) => handleInputChange("releaseYear", e.target.value)}
                onKeyPress={handleKeyPress}
                inputProps={{
                  min: 1888,
                  max: new Date().getFullYear() + 5,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SearchFiltersComponent;