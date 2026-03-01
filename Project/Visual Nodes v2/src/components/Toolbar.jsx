/**
 * ============================================
 * TOOLBAR COMPONENT
 * Minimal yet useful toolbar with icon buttons
 * ============================================
 */

import { useRef } from 'react';
import {
    MousePointer2,
    Maximize,
    Minimize,
    GitBranch,
    Download,
    Upload,
    Trash2,
    Code2,
} from 'lucide-react';

/**
 * Toolbar - Top navigation bar with action buttons
 * 
 * Buttons (left to right):
 * 1. Select Path Mode - Toggle recursive selection
 * 2. Full Screen - Toggle browser fullscreen
 * 3. Auto Arrange - Organize nodes into tree
 * 4. Save - Export graph to JSON
 * 5. Load - Import graph from JSON
 * 6. Clear All - Delete all nodes (with confirmation)
 * 
 * @param {Object} props
 * @param {boolean} props.isPathMode - Whether path selection mode is active
 * @param {Function} props.onTogglePathMode - Toggle path selection mode
 * @param {boolean} props.isFullscreen - Current fullscreen state
 * @param {Function} props.onToggleFullscreen - Toggle fullscreen
 * @param {Function} props.onAutoArrange - Trigger auto-arrange
 * @param {Function} props.onExport - Trigger export
 * @param {Function} props.onImport - Handle file import
 * @param {Function} props.onClearAll - Trigger clear all dialog
 */
export default function Toolbar({
    isPathMode,
    onTogglePathMode,
    isFullscreen,
    onToggleFullscreen,
    onAutoArrange,
    onExport,
    onImport,
    onClearAll,
    onOpenScript,
}) {
    // Hidden file input for importing JSON
    const fileInputRef = useRef(null);

    /**
     * Handle file selection for import
     * Reads the JSON file and passes data to parent
     */
    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                onImport(data);
            } catch (error) {
                console.error('Failed to parse JSON:', error);
                alert('Invalid JSON file. Please select a valid flow export.');
            }
        };

        reader.readAsText(file);

        // Reset input so same file can be selected again
        event.target.value = '';
    };

    return (
        <div className="toolbar">
            {/* ─────────── SELECT PATH MODE ─────────── */}
            <button
                className={`toolbar-btn ${isPathMode ? 'active' : ''}`}
                onClick={onTogglePathMode}
                data-tooltip="Select Path Mode"
                title="Select Path Mode - Click a node to highlight its descendants"
            >
                <MousePointer2 />
            </button>

            <div className="toolbar-divider" />

            {/* ─────────── FULLSCREEN ─────────── */}
            <button
                className="toolbar-btn"
                onClick={onToggleFullscreen}
                data-tooltip={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
                {isFullscreen ? <Minimize /> : <Maximize />}
            </button>

            {/* ─────────── AUTO ARRANGE ─────────── */}
            <button
                className="toolbar-btn"
                onClick={onAutoArrange}
                data-tooltip="Auto Arrange"
                title="Auto Arrange - Organize nodes into a clean tree layout"
            >
                <GitBranch />
            </button>

            <div className="toolbar-divider" />

            {/* ─────────── EXPORT ─────────── */}
            <button
                className="toolbar-btn"
                onClick={onExport}
                data-tooltip="Save"
                title="Save - Download graph as JSON file"
            >
                <Download />
            </button>

            {/* ─────────── IMPORT ─────────── */}
            <button
                className="toolbar-btn"
                onClick={() => fileInputRef.current?.click()}
                data-tooltip="Load"
                title="Load - Import graph from JSON file"
            >
                <Upload />
            </button>

            {/* Hidden file input for import */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden-input"
                onChange={handleFileSelect}
            />


            {/* ─────────── SCRIPT EDITOR ─────────── */}
            <button
                className="toolbar-btn"
                onClick={onOpenScript}
                data-tooltip="Script"
                title="Script - View and edit raw JSON graph data"
            >
                <Code2 />
            </button>

            <div className="toolbar-divider" />

            {/* ─────────── CLEAR ALL ─────────── */}
            <button
                className="toolbar-btn"
                onClick={onClearAll}
                data-tooltip="Clear All"
                title="Clear All - Delete all nodes and edges"
            >
                <Trash2 />
            </button>
        </div>
    );
}
