// useDocumentUpload.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom hook that handles the entire document upload flow for the chat composer.
//
// How it works:
//   1. User picks a file via the + button in the composer
//   2. When they hit Send, this hook uploads the file to our backend
//   3. Backend saves the file and queues it for processing (OCR / extraction)
//   4. We immediately return a document_id to the frontend
//   5. We then poll every 3 seconds to see when processing is done
//   6. Once done, the document is "ready" and the user can ask questions about it
//
// States:
//   - idle       → no document uploaded yet
//   - uploading  → file is being sent to the server
//   - processing → backend received it, extraction is running in background
//   - ready      → extraction complete, Q&A is now unlocked
//   - error      → something went wrong
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useDocumentUpload({ jwtToken }) {
  // The current document that's been uploaded (or being processed)
  const [uploadedDoc, setUploadedDoc] = useState(null); // { document_id, filename, status, ready }
  const [uploadError, setUploadError] = useState(null);

  // We keep a reference to the polling interval so we can stop it later
  const pollingRef = useRef(null);

  // Stop polling (called when doc is ready or on cleanup)
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Poll the backend every 3 seconds to check if the document is ready
  const startPolling = useCallback((documentId) => {
    stopPolling(); // clear any existing poll first

    pollingRef.current = setInterval(async () => {
      try {
        // Target /v1 instead of /api/v1 to bypass rate limit
        const res = await fetch(`${API_BASE}/v1/documents/${documentId}/status`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const json = await res.json();

        if (!json.success) {
          stopPolling();
          setUploadError('Could not check document status.');
          return;
        }

        const doc = json.data;

        // Update the chip display on every poll
        setUploadedDoc((prev) => ({ ...prev, ...doc }));

        // If extraction is done (or even partially done), stop polling
        if (doc.status === 'completed' || doc.status === 'partial_success') {
          stopPolling();
        }

        // If it failed completely, stop and show error
        if (doc.status === 'failed') {
          stopPolling();
          setUploadError(`Processing failed for "${doc.filename}".`);
        }
      } catch (err) {
        console.error('[useDocumentUpload] Polling error:', err.message);
        // Don't stop polling on network hiccup — it will retry next interval
      }
    }, 3000); // check every 3 seconds
  }, [jwtToken, stopPolling]);


  // ── Main upload function ──
  // Called when user hits Send while a file is attached.
  // Returns the document_id so the chat can include it with the message.
  const uploadDocument = useCallback(async (file) => {
    setUploadError(null);

    // Show the file immediately as "uploading" so the user gets instant feedback
    setUploadedDoc({
      filename: file.name,
      status: 'uploading',
      ready: false,
      document_id: null,
    });

    try {
      // Build a FormData payload — same as an HTML form with enctype="multipart/form-data"
      const formData = new FormData();
      formData.append('document', file); // 'document' must match the field name in multer on backend

      // Send file to our backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for file upload

      // Target /v1 instead of /api/v1 to bypass rate limit
      const res = await fetch(`${API_BASE}/v1/documents/upload-and-process`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Upload failed.');
      }

      const { document_id, filename, status } = json.data;

      // Update display: file received by server, now processing
      setUploadedDoc({ document_id, filename, status, ready: false });

      // Start polling to watch for when extraction finishes
      startPolling(document_id);

      return document_id; 
    } catch (err) {
      console.error('[useDocumentUpload] Upload failed:', err);
      const isTimeout = err.name === 'AbortError';
      const msg = isTimeout ? 'Upload timed out (60s). Check your connection.' : err.message;
      setUploadError(msg);
      setUploadedDoc((prev) => (prev ? { ...prev, status: 'failed' } : null));
      return null;
    }
  }, [jwtToken, startPolling]);


  // Clear everything — called when user removes the file chip
  const clearDocument = useCallback(() => {
    stopPolling();
    setUploadedDoc(null);
    setUploadError(null);
  }, [stopPolling]);


  return {
    uploadedDoc,    // current doc state — used to render the chip
    uploadError,    // error string if something failed
    uploadDocument, // call with a File object to start the upload
    clearDocument,  // call to reset everything
  };
}
