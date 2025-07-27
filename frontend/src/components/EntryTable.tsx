// frontend/src/components/EntryTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Entry } from "../types";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import LoadingSpinner from "./LoadingSpinner";

interface EntryTableProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const EntryTable: React.FC<EntryTableProps> = ({
  entries,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore,
  isLoading,
}) => {
  const scrollRef = useInfiniteScroll({
    callback: onLoadMore,
    hasMore: hasMore,
    isLoading: isLoading,
  });
  return (
    <TableContainer
      component={Paper}
      className="shadow-lg rounded-lg overflow-hidden"
    >
      <Table
        sx={{ minWidth: 650 }}
        aria-label="favorite movies and TV shows table"
      >
        <TableHead className="bg-gradient-to-r from-blue-500 to-indigo-600">
          <TableRow>
            <TableCell className="text-white font-semibold">Title</TableCell>
            <TableCell className="text-white font-semibold">Type</TableCell>
            <TableCell className="text-white font-semibold">Director</TableCell>
            <TableCell className="text-white font-semibold">
              Release Year
            </TableCell>
            <TableCell className="text-white font-semibold">Duration</TableCell>
            <TableCell className="text-white font-semibold">Budget</TableCell>
            <TableCell className="text-white font-semibold">Location</TableCell>
            <TableCell className="text-white font-semibold">Notes</TableCell>
            <TableCell className="text-white font-semibold text-center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <Typography variant="h6" color="textSecondary">
                  No entries found. Start by adding one!
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  className="font-medium text-gray-800"
                >
                  {entry.title}
                </TableCell>
                <TableCell>{entry.type}</TableCell>
                <TableCell>{entry.director}</TableCell>
                <TableCell>{entry.releaseYear}</TableCell>
                <TableCell>{entry.duration || "-"}</TableCell>
                <TableCell>{entry.budget || "-"}</TableCell>
                <TableCell>{entry.location || "-"}</TableCell>
                <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                  <Tooltip title={entry.notes || ""} placement="top">
                    <span>{entry.notes || "-"}</span>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(entry)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => onDelete(entry.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
          {/* Intersection Observer target div */}
          {hasMore && !isLoading && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                <div ref={scrollRef}></div>
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!hasMore && !isLoading && entries.length > 0 && (
        <Box className="text-center py-4 bg-gray-50 text-gray-600">
          <Typography variant="body2">
            You've reached the end of the list!
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default EntryTable;
