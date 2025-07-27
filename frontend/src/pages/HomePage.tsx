// frontend/src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Box, Alert, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EntryTable from "../components/EntryTable";
import EntryForm from "../components/EntryForm";
import ConfirmationDialog from "../components/ConfirmationDialog";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Entry, EntryFormData } from "../types";
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../services/api";
import Header from "../components/Header";

const ITEMS_PER_PAGE = 10; // Consistent with backend default

const HomePage: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [entryToDeleteId, setEntryToDeleteId] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Move showSnackbar above fetchEntries
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const isLoadingRef = useRef(false);

  const fetchEntries = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsLoading(true);
      try {
        console.log(`Fetching page: ${pageNum}, limit: ${ITEMS_PER_PAGE}`);
        const response = await getEntries(pageNum, ITEMS_PER_PAGE);
        console.log(
          `Received ${response.entries.length} entries (total: ${response.total})`
        );
        setEntries((prev) =>
          append ? [...prev, ...response.entries] : response.entries
        );
        setTotalEntries(response.total);
        setHasMore(response.entries.length === ITEMS_PER_PAGE); // If we received less than limit, no more data
      } catch (error) {
        console.error("Failed to fetch entries:", error);
        showSnackbar("Failed to load entries.", "error");
        setHasMore(false); // Stop trying to load more if there's an error
      } finally {
        setIsLoading(false);
        isLoadingRef.current = false;
      }
    },
    [showSnackbar]
  );

  useEffect(() => {
    fetchEntries(1, false); // Initial load
    // Only run on mount
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchEntries(nextPage, true);
        return nextPage;
      });
    }
  }, [isLoading, hasMore, fetchEntries]);

  const handleOpenAddForm = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (entry: Entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleSubmitForm = async (formData: EntryFormData) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const updated = await updateEntry(editingEntry.id, formData);
        setEntries((prev) =>
          prev.map((entry) => (entry.id === updated.id ? updated : entry))
        );
        showSnackbar("Entry updated successfully!", "success");
      } else {
        // Create new entry
        const newEntry = await createEntry(formData);
        // For simplicity, re-fetch the first page to ensure new entry is visible
        // In a real app, you might prepend it or manage state more granularly
        setPage(1); // Reset page to ensure we start from beginning
        setHasMore(true); // Assume there might be more if a new one is added
        await fetchEntries(1, false); // Re-fetch the first page to get the new item in correct order
        showSnackbar("Entry added successfully!", "success");
      }
      handleCloseForm();
    } catch (error: any) {
      console.error("Form submission failed:", error);
      const errorMessage = error.response?.data?.message || "Operation failed.";
      showSnackbar(errorMessage, "error");
    }
  };

  const handleOpenConfirmDelete = (id: number) => {
    setEntryToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setIsConfirmOpen(false);
    setEntryToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (entryToDeleteId !== null) {
      try {
        await deleteEntry(entryToDeleteId);
        setEntries((prev) =>
          prev.filter((entry) => entry.id !== entryToDeleteId)
        );
        setTotalEntries((prev) => prev - 1);
        showSnackbar("Entry deleted successfully!", "success");
      } catch (error: any) {
        console.error("Delete failed:", error);
        const errorMessage =
          error.response?.data?.message || "Deletion failed.";
        showSnackbar(errorMessage, "error");
      } finally {
        handleCloseConfirmDelete();
      }
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
      <Header />
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
        Favorite Movies & TV Shows
      </h1>

      <Box className="mb-6 flex justify-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddForm}
          className="capitalize text-lg px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          Add New Entry
        </Button>
      </Box>

      {isLoading && entries.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <EntryTable
          entries={entries}
          onEdit={handleOpenEditForm}
          onDelete={handleOpenConfirmDelete}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      )}

      <EntryForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={editingEntry}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={handleCloseConfirmDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this entry? This action cannot be undone."
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default HomePage;
