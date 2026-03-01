/**
 * ============================================
 * SCRIPT PANEL COMPONENT
 * A full-height right-side drawer that shows
 * the raw JSON of the current graph.
 * Users can read or edit and click Apply.
 * ============================================
 */

import { useState, useEffect, useRef } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

export default function ScriptPanel({ nodes, edges, viewport, onApply, onClose }) {
    // Build the initial JSON string from current graph state
    const buildJson = () =>
        JSON.stringify({ nodes, edges, viewport }, null, 2);

    const [code, setCode] = useState(buildJson);
    const [error, setError] = useState(null);
    const [applied, setApplied] = useState(false);
    const textareaRef = useRef(null);

    // Keep the editor in sync when canvas changes externally
    // (only if the panel was just opened — don't overwrite user edits)
    const initialSyncDone = useRef(false);
    useEffect(() => {
        if (!initialSyncDone.current) {
            setCode(buildJson());
            initialSyncDone.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Prevent scroll inside the textarea from reaching the canvas zoom
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        const block = (e) => e.stopPropagation();
        el.addEventListener('wheel', block, { passive: true });
        return () => el.removeEventListener('wheel', block);
    }, []);

    const handleApply = () => {
        try {
            const parsed = JSON.parse(code);
            onApply(parsed);
            setError(null);
            setApplied(true);
            setTimeout(() => setApplied(false), 1800);
        } catch (e) {
            setError(e.message);
        }
    };

    // Format / pretty-print the current content
    const handleFormat = () => {
        try {
            const parsed = JSON.parse(code);
            setCode(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <>
            {/* Backdrop — click to close */}
            <div
                className="script-panel-backdrop"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="script-panel">

                {/* Header */}
                <div className="script-panel-header">
                    <div className="script-panel-title">
                        <span className="script-panel-dot" />
                        Script Editor
                        <span className="script-panel-subtitle">Raw JSON — same format as Save/Load</span>
                    </div>
                    <div className="script-panel-actions">
                        <button
                            className="script-btn script-btn-format"
                            onClick={handleFormat}
                            title="Format / pretty-print JSON"
                        >
                            Format
                        </button>
                        <button
                            className={`script-btn script-btn-apply ${applied ? 'script-btn-applied' : ''}`}
                            onClick={handleApply}
                            title="Parse and apply JSON to the canvas"
                        >
                            {applied ? <><Check size={13} /> Applied</> : 'Apply'}
                        </button>
                        <button
                            className="script-btn script-btn-close"
                            onClick={onClose}
                            title="Close"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* Error bar */}
                {error && (
                    <div className="script-panel-error">
                        <AlertTriangle size={13} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Code area */}
                <textarea
                    ref={textareaRef}
                    className="script-panel-textarea"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(null); }}
                    onContextMenu={(e) => e.preventDefault()}
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                />

                {/* Footer hint */}
                <div className="script-panel-footer">
                    Edit the JSON above, then click <strong>Apply</strong> to update the canvas.
                    Ctrl+Z / Ctrl+Y still work for canvas undo/redo.
                </div>
            </div>
        </>
    );
}
