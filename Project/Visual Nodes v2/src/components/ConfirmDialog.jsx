/**
 * ============================================
 * CONFIRM DIALOG COMPONENT
 * Modal for confirming destructive actions
 * ============================================
 */

import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog - Confirmation modal for destructive actions
 * 
 * Used primarily for "Clear All" to prevent accidental data loss
 * 
 * @param {Object} props
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message/question
 * @param {Function} props.onConfirm - Called when user confirms
 * @param {Function} props.onCancel - Called when user cancels
 * @param {string} props.confirmText - Text for confirm button (default: "Yes")
 * @param {string} props.cancelText - Text for cancel button (default: "No")
 */
export default function ConfirmDialog({
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    onConfirm,
    onCancel,
    confirmText = 'Yes',
    cancelText = 'No',
}) {
    return (
        <div className="confirm-overlay" onClick={onCancel}>
            {/* 
        Stop propagation to prevent closing when clicking inside dialog
      */}
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Warning icon */}
                <div className="flex justify-center mb-4">
                    <AlertTriangle
                        className="text-yellow-500"
                        size={48}
                    />
                </div>

                {/* Title */}
                <h3>{title}</h3>

                {/* Message */}
                <p>{message}</p>

                {/* Action buttons */}
                <div className="confirm-buttons">
                    <button
                        className="confirm-btn cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="confirm-btn danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
