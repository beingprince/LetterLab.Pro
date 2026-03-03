import React, { useState, useEffect } from 'react';
import { Skeleton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

// --- ICONS ---
const IconBriefcase = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;

// --- Editable Field ---
const EditableField = ({ label, value, icon, onSave, placeholder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [saving, setSaving] = useState(false);

    useEffect(() => { setTempValue(value); }, [value]);

    const handleSave = async () => {
        setSaving(true);
        await onSave(tempValue);
        setSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="group relative p-4 rounded-xl border border-transparent hover:bg-brand-bg/50 hover:border-brand-border transition-all">
            {/* Label & Icon */}
            <div className="flex items-center gap-2 mb-2">
                <div className="text-brand-dim">{icon}</div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dim">{label}</span>
            </div>

            {/* Edit Mode */}
            {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                    <input
                        autoFocus
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-brand-bg border-b-2 border-blue-500 text-brand-text px-2 py-1 outline-none text-lg"
                    />
                    <button onClick={() => setIsEditing(false)} className="p-1 text-brand-dim hover:text-red-500">
                        <CloseIcon fontSize="small" />
                    </button>
                    <button onClick={handleSave} disabled={saving} className="p-1 text-blue-500 hover:text-blue-400">
                        {saving ? <span className="animate-spin block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> : <SaveIcon fontSize="small" />}
                    </button>
                </div>
            ) : (
                /* View Mode */
                <div className="flex justify-between items-center mt-1">
                    <span className={`text-lg font-medium ${value ? 'text-brand-text' : 'text-brand-dim/50'}`}>
                        {value || "Not set"}
                    </span>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-brand-border text-brand-dim transition-all"
                        title="Edit"
                    >
                        <EditIcon fontSize="small" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default function TabGeneral({ formData, updateField }) {
    return (
        <div className="space-y-6">
            <div className="bg-brand-card/30 rounded-2xl p-6 border border-brand-border/50">
                <h3 className="text-xl font-heading font-bold text-brand-text mb-6">Personal Details</h3>

                <div className="space-y-4">
                    <EditableField
                        label="Job Title"
                        value={formData.jobTitle}
                        icon={<IconBriefcase />}
                        onSave={(v) => updateField('jobTitle', v)}
                        placeholder="Product Designer"
                    />
                    <EditableField
                        label="Location"
                        value={formData.location}
                        icon={<IconMapPin />}
                        onSave={(v) => updateField('location', v)}
                        placeholder="New York, USA"
                    />
                </div>
            </div>
        </div>
    );
}
