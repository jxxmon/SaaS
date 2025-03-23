/**
 * File Management System Types
 */

export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'file' | 'folder';
  mimeType?: string;
  extension?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  permissions?: FilePermissions;
  metadata?: FileMetadata;
}

export interface FilePermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  pages?: number;
  author?: string;
  tags?: string[];
  description?: string;
}

export interface FolderStructure {
  id: string;
  name: string;
  path: string;
  children: (FileItem | FolderStructure)[];
  itemCount: number;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedBytes: number;
  totalBytes: number;
}

export interface FileFilterOptions {
  types?: string[];
  extensions?: string[];
  minSize?: number;
  maxSize?: number;
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchQuery?: string;
}

export interface FileSortOptions {
  field: 'name' | 'size' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface FileBrowserViewOptions {
  viewMode: 'grid' | 'list' | 'details';
  sortBy: FileSortOptions;
  filterBy: FileFilterOptions;
  selectedItems: string[];
}

export interface FileUploadOptions {
  maxFileSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  chunkSize?: number;
  concurrentUploads?: number;
  autoUpload?: boolean;
}

export interface FileAction {
  id: string;
  label: string;
  icon: string;
  handler: (files: FileItem[]) => void;
  enabled: (files: FileItem[]) => boolean;
}
