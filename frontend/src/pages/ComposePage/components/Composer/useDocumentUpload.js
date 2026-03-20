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
        // We keep the /api/v1 prefix for CORS consistency
        const res = await fetch(`${API_BASE}/api/v1/documents/${documentId}/status`, {
          headers: { Authorization: `Bearer ${jwtToken}` },
        });
        const json = await res.json();

        if (!json.success) {
          stopPolling();
          setUploadError('Could not check document status.');
          return;
        }

        const doc = json.data;
        // doc now includes processing_progress from the backend
        
        // Update the chip display on every poll
        setUploadedDoc((prev) => ({ 
          ...prev, 
          ...doc,
          processingProgress: doc.processing_progress ?? 0 
        }));

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
      // We use XMLHttpRequest instead of fetch to track upload progress
      const xhr = new XMLHttpRequest();
      const url = `${API_BASE}/api/v1/documents/upload-and-process`;
      
      const formData = new FormData();
      formData.append('document', file);

      // Track Upload Progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadedDoc((prev) => ({ ...prev, uploadProgress: percent }));
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            let errorMsg = 'Upload failed.';
            try {
              const errorData = JSON.parse(xhr.response);
              errorMsg = errorData.message || errorData.debug || errorMsg;
            } catch (e) {
              console.error('Could not parse error response:', xhr.response);
            }
            reject(new Error(errorMsg));
          }
        };
        xhr.onerror = () => reject(new Error('Network error.'));
        xhr.onabort = () => reject(new Error('Upload aborted.'));
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
      xhr.send(formData);

      const json = await uploadPromise;

      const { document_id, filename, status } = json.data;

      // Update display: file received by server, now processing
      setUploadedDoc({ document_id, filename, status, ready: false, uploadProgress: 100 });

      // Start polling to watch for when extraction finishes
      startPolling(document_id);

      return document_id; 
    } catch (err) {
      console.error('[useDocumentUpload] Upload failed:', err);
      setUploadError(err.message);
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
