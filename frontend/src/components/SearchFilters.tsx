import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Collapse,
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
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Main search bar */}
        <Box>
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
        </Box>

        {/* Action buttons */}
        <Box>
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
        </Box>
      </Box>

      {/* Advanced filters */}
      <Collapse in={showAdvanced}>
        <Box className="mt-4 pt-4 border-t border-gray-200">
          <Typography variant="h6" className="mb-3 text-gray-700">
            Advanced Filters
          </Typography>
          <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Box>
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
            </Box>
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                label="Director"
                placeholder="Filter by director..."
                value={localFilters.director}
                onChange={(e) => handleInputChange("director", e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Box>
            <Box>
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
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SearchFiltersComponent;