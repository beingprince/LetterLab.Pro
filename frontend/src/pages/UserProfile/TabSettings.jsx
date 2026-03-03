import React, { useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function TabSettings() {
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        // Actual API call would go here
        alert("Account deletion simulated. API call required.");
    };

    return (
        <div className="space-y-6">
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
                title="Delete Account?"
                message="This action is permanent and cannot be undone. All your data will be wiped immediately."
                confirmText="Yes, Delete My Account"
                confirmColor="bg-red-600 hover:bg-red-700"
            />

            <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-xl font-heading font-bold text-red-500 mb-2 flex items-center gap-2">
                    <DeleteForeverIcon /> Danger Zone
                </h3>
                <p className="text-brand-dim text-sm mb-6">
                    Once you delete your account, there is no going back. Please be certain.
                </p>

                <div className="p-4 bg-brand-bg/50 rounded-xl border border-red-500/10">
                    <label className="block text-xs font-bold text-red-400 uppercase mb-2">
                        Type "DELETE" to confirm
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className="flex-1 bg-brand-bg border border-brand-border text-brand-text px-4 py-2 rounded-lg outline-none focus:border-red-500"
                        />
                        <button
                            disabled={deleteConfirm !== 'DELETE'}
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2 bg-red-600 disabled:bg-red-600/20 disabled:text-red-400/50 text-white font-bold rounded-lg transition-all"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
