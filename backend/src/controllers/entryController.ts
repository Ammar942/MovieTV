// backend/src/controllers/entryController.ts
import { Request, Response, NextFunction } from "express";
import * as entryService from "../services/entryService";
import { ApiError } from "../utils/errorHandler";

// Type definitions for request bodies (Zod infers from schemas)
import { z } from "zod";
import {
  createEntrySchema,
  updateEntrySchema,
  paginationSchema,
} from "../validationSchemas/entrySchemas";

type CreateEntryInput = z.infer<typeof createEntrySchema>;
type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
type PaginationInput = z.infer<typeof paginationSchema>;

export const createEntry = async (
  req: Request<{}, {}, CreateEntryInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const entry = await entryService.createEntry(req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const getEntries = async (
  req: Request<{}, {}, {}, PaginationInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { entries, total } = await entryService.getEntries(page, limit);
    res.status(200).json({ entries, total, page, limit });
  } catch (error) {
    next(error);
  }
};

export const getEntryById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError("Invalid ID format", 400);
    }
    const entry = await entryService.getEntryById(id);
    if (!entry) {
      throw new ApiError("Entry not found", 404);
    }
    res.status(200).json(entry);
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (
  req: Request<{ id: string }, {}, UpdateEntryInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError("Invalid ID format", 400);
    }
    const updatedEntry = await entryService.updateEntry(id, req.body);
    if (!updatedEntry) {
      throw new ApiError("Entry not found", 404);
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new ApiError("Invalid ID format", 400);
    }
    const deletedEntry = await entryService.deleteEntry(id);
    if (!deletedEntry) {
      throw new ApiError("Entry not found", 404);
    }
    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    next(error);
  }
};
