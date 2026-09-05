'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FolderSync,
  CloudCheck,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileImage,
} from 'lucide-react';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
} from '@/lib/firebase-auth';
import type { User } from 'firebase/auth';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  thumbnailLink?: string;
}

interface DriveFolder {
  id: string;
  name: string;
}

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleDriveSyncModal({ isOpen, onClose }: GoogleDriveSyncModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<DriveFolder | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<any[] | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFolderFiles = useCallback(async (folderId: string, authToken: string) => {
    setIsLoadingFiles(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/drive/files?folderId=${encodeURIComponent(folderId)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch files from folder');
      }
      setFiles(data.files || []);
      setStatusMessage(`Found ${data.files?.length || 0} product images in folder.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to list images in folder');
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const searchTargetFolder = useCallback(async (authToken: string) => {
    setIsLoadingFolders(true);
    setErrorMessage(null);
    setStatusMessage('Searching for folder "Mini Highland Cows Product Images"...');
    try {
      const res = await fetch('/api/drive/folders?name=Mini Highland Cows Product Images', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to search folders');
      }

      const foundFolders: DriveFolder[] = data.folders || [];
      setFolders(foundFolders);

      if (foundFolders.length > 0) {
        const target = foundFolders[0];
        setSelectedFolder(target);
        setStatusMessage(`Found target folder: "${target.name}". Fetching photos...`);
        await loadFolderFiles(target.id, authToken);
      } else {
        setStatusMessage('No folder named "Mini Highland Cows Product Images" found. You can search again or paste a folder ID below.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with Google Drive');
    } finally {
      setIsLoadingFolders(false);
    }
  }, [loadFolderFiles]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When token is available and modal is open, search for the target folder asynchronously
  useEffect(() => {
    let active = true;
    if (token && isOpen) {
      const timer = setTimeout(() => {
        if (active) {
          void searchTargetFolder(token);
        }
      }, 50);
      return () => {
        active = false;
        clearTimeout(timer);
      };
    }
  }, [token, isOpen, searchTargetFolder]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    setStatusMessage('Connecting to Google Drive with permission...');
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setStatusMessage('Successfully connected to Google Drive.');
        await searchTargetFolder(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setFolders([]);
    setSelectedFolder(null);
    setFiles([]);
    setImportResults(null);
    setStatusMessage(null);
  };

  const handleImportAll = async () => {
    if (!token || !selectedFolder) return;

    setIsImporting(true);
    setErrorMessage(null);
    setStatusMessage('Downloading and processing images via WebForge Sharp 4:3 pipeline (WebP + AVIF)...');
    try {
      const res = await fetch('/api/drive/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          folderId: selectedFolder.id,
          items: files.map((f) => ({ id: f.id, name: f.name })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setImportResults(data.results);
      setStatusMessage(`Successfully imported and optimized ${data.processedCount} images!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Import error occurred');
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#b08d57]/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1c3028] text-white p-5 flex items-center justify-between border-b border-[#b08d57]/40">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#b08d57]/20 rounded-lg text-[#e5c07b]">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif tracking-tight text-white flex items-center gap-2">
                Google Drive Product Images Sync
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#b08d57] text-[#1c3028]">
                  WebForge v9.1
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                Folder: <span className="text-[#e5c07b] font-medium">&apos;Mini Highland Cows Product Images&apos;</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Auth State Card */}
          {!user ? (
            <div className="text-center py-6 px-4 bg-[#f8f5ee] rounded-xl border border-[#d6cbba] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#1c3028]/10 flex items-center justify-center mx-auto text-[#1c3028]">
                <FolderSync className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-[#1c3028] text-base">
                  Connect Google Drive
                </h4>
                <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                  Authenticate with Google to access photos in your &apos;Mini Highland Cows Product Images&apos; Drive folder.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-lg border border-gray-300 shadow-sm transition-all text-sm disabled:opacity-60 cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{isSigningIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1c3028]" />
                <span>Read-only access strictly with user permission</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account Bar */}
              <div className="flex items-center justify-between p-3 bg-[#f4efe6] rounded-xl border border-[#d6cbba] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#1c3028] text-white flex items-center justify-center font-bold">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-bold text-[#1c3028]">{user.displayName || user.email}</div>
                    <div className="text-gray-500 text-[11px]">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => token && searchTargetFolder(token)}
                    disabled={isLoadingFolders || isLoadingFiles}
                    className="px-2.5 py-1.5 text-xs text-[#1c3028] bg-white border border-[#d6cbba] rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFolders ? 'animate-spin' : ''}`} />
                    <span>Rescan</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-2.5 py-1.5 text-xs text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              {statusMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Folder Discovery */}
              {folders.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1c3028] flex items-center justify-between">
                    <span>Target Folder Identified:</span>
                    <span className="text-[11px] font-normal text-gray-500">
                      ID: {selectedFolder?.id}
                    </span>
                  </label>
                  <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#d6cbba] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1c3028]">
                      <FolderSync className="w-4 h-4 text-[#b08d57]" />
                      <span>{selectedFolder?.name}</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1c3028] text-[#e5c07b] font-medium">
                      {files.length} images found
                    </span>
                  </div>
                </div>
              )}

              {/* File Previews List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#1c3028] flex items-center justify-between">
                    <span>Images Ready for Optimization:</span>
                    <span className="text-[11px] font-normal text-gray-500">
                      Pipeline: 4:3 1600x1200 White Frame &bull; WebP + AVIF
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-gray-100 bg-white">
                    {files.map((file) => (
                      <div key={file.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-50">
                        <div className="flex items-center gap-2.5 truncate max-w-sm">
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 text-gray-400">
                            {file.thumbnailLink ? (
                              <Image
                                src={file.thumbnailLink}
                                alt={file.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover rounded"
                                referrerPolicy="no-referrer"
                                unoptimized
                              />
                            ) : (
                              <FileImage className="w-4 h-4" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800 truncate">{file.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          Google Drive
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3">
                    <button
                      onClick={handleImportAll}
                      disabled={isImporting || files.length === 0}
                      className="w-full py-3 bg-[#1c3028] hover:bg-[#254237] text-[#e5c07b] font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 cursor-pointer"
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#e5c07b]" />
                          <span>Processing & Optimizing Pipeline...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#e5c07b]" />
                          <span>Import & Optimize All {files.length} Images</span>
                          <ArrowRight className="w-4 h-4 text-[#e5c07b]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Import Results */}
              {importResults && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Optimization Complete!</span>
                  </div>
                  <div className="text-xs text-emerald-700 space-y-1">
                    {importResults.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-medium">{r.name} &rarr; {r.slug}.webp</span>
                        <span className="text-emerald-900 font-semibold">{r.webpSizeKb}KB</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Reload Catalog to Preview Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <CloudCheck className="w-4 h-4 text-[#1c3028]" />
            <span>Google Drive API v3 &bull; WebForge v9.1 Standard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
