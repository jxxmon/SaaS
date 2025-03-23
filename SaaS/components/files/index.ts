/**
 * File Management System
 * Export all file management components and utilities
 */

// Components
export { default as FileUpload } from './FileUpload';
export type { FileUploadProps } from './FileUpload';

export { default as FileBrowser } from './FileBrowser';
export type { FileBrowserProps } from './FileBrowser';

export { default as FilePreview } from './FilePreview';
export type { FilePreviewProps } from './FilePreview';

export { default as FileActions } from './FileActions';
export type { FileActionsProps } from './FileActions';

// Hooks
export { default as useFileManager } from './hooks/useFileManager';
export type { UseFileManagerOptions, UseFileManagerReturn } from './hooks/useFileManager';

export { default as useFileUpload } from './hooks/useFileUpload';
export type { UseFileUploadOptions, UseFileUploadReturn } from './hooks/useFileUpload';

// Types
export * from './types/fileTypes';

// Utilities
export * from './utils/fileUtils';
export * from './utils/formatUtils';
EOF && echo '인덱스 파일 생성 완료'
