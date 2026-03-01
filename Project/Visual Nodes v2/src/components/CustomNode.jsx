/**
 * ============================================
 * CUSTOM NODE COMPONENT
 * A resizable black box with dynamic text scaling
 * and glow effects when selected in path mode
 * ============================================
 */

import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position, NodeResizer, useReactFlow, useNodeId } from '@xyflow/react';
import { Minus, Maximize2, X } from 'lucide-react';

/**
 * CustomNode - The main node component for the flow editor
 * 
 * Features:
 * - Resizable with NodeResizer
 * - Dynamic text scaling based on node size
 * - Glowing effect when part of selected path
 * - Minimal white connection handles
 * 
 * @param {Object} props - React Flow node props
 * @param {Object} props.data - Custom data for the node
 * @param {string} props.data.label - Text to display in the node
 * @param {boolean} props.data.isGlowing - Whether to show glow effect
 * @param {boolean} props.selected - Whether node is selected
 */
function CustomNode({ data, selected }) {
    // Reference to the node container for measuring size
    const nodeRef = useRef(null);

    // Derive minimized state from node data (single source of truth, survives remounts)
    const isMinimized = !!data.isLocallyMinimized;
    const nodeId = useNodeId(); // Grab the explicit react flow ID

    // Inline label editing state
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [editLabelValue, setEditLabelValue] = useState(data.windowLabel || 'New Window');
    const labelInputRef = useRef(null);

    // Ref for the content textarea — used to block wheel zoom via native listener
    const textareaRef = useRef(null);

    // Attach native wheel listener so scroll inside textarea doesn't zoom the canvas.
    // React's synthetic onWheel fires after React Flow's native listener, so we must
    // use a native addEventListener to intercept it first.
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        const blockZoom = (e) => e.stopPropagation();
        el.addEventListener('wheel', blockZoom, { passive: true });
        return () => el.removeEventListener('wheel', blockZoom);
    }, []);

    // For deleting from inside the node
    const { setNodes, setEdges } = useReactFlow();

    const handleClose = (e) => {
        e.stopPropagation(); // Don't trigger node selection
        if (nodeId) {
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
            setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        }
    };

    const handleMinimize = (e) => {
        e.stopPropagation();
        // Dispatch to App.jsx which handles:
        //  1. Collapsing this node to title-bar height
        //  2. Hiding all descendants
        window.dispatchEvent(new CustomEvent('nodeMinimizeToggle', {
            detail: { nodeId, isMinimized: !isMinimized }
        }));
    };

    const handleMaximize = (e) => {
        e.stopPropagation();
        if (nodeId) {
            // Fire custom event for App.jsx to catch and show modal
            const event = new CustomEvent('nodeMaximize', { detail: { nodeId } });
            window.dispatchEvent(event);
        }
    };

    // Inline label editing handlers
    const handleLabelClick = (e) => {
        e.stopPropagation();
        setEditLabelValue(data.windowLabel || 'New Window');
        setIsEditingLabel(true);
    };

    const commitLabelEdit = () => {
        setIsEditingLabel(false);
        const trimmed = editLabelValue.trim() || 'New Window';
        setEditLabelValue(trimmed);
        // Directly update this node's data in React Flow state
        setNodes((nds) => nds.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, windowLabel: trimmed } } : n
        ));
    };

    const handleLabelKeyDown = (e) => {
        if (e.key === 'Enter') commitLabelEdit();
        if (e.key === 'Escape') {
            setIsEditingLabel(false);
            setEditLabelValue(data.windowLabel || 'New Window');
        }
    };

    // Auto-focus and select all text when entering edit mode
    useEffect(() => {
        if (isEditingLabel && labelInputRef.current) {
            labelInputRef.current.focus();
            labelInputRef.current.select();
        }
    }, [isEditingLabel]);

    return (
        <>
            <NodeResizer
                minWidth={150}
                minHeight={80}
                isVisible={selected && !isMinimized}
                lineClassName="border-[#0078d7]"
                handleClassName="bg-white border-[#0078d7]"
            />

            {/* Top connection handle — hidden when node is Root */}
            {!data.isRoot && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="node-handle"
                />
            )}

            {/* Main window container */}
            <div
                ref={nodeRef}
                className={`custom-node ${data.isGlowing ? 'glowing' : ''} ${isMinimized ? 'minimized' : ''}`}
            >
                {/* Window Title Bar */}
                <div className="window-title-bar custom-drag-handle">
                    {/* Inline-editable label: click to edit, Enter/blur to save */}
                    {isEditingLabel ? (
                        <input
                            ref={labelInputRef}
                            className="window-label-input"
                            value={editLabelValue}
                            onChange={(e) => setEditLabelValue(e.target.value)}
                            onBlur={commitLabelEdit}
                            onKeyDown={handleLabelKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            className="window-label"
                            title="Double-click to rename"
                            onDoubleClick={handleLabelClick}
                            style={{ cursor: 'default' }}
                        >
                            {data.windowLabel || 'New Window'}
                        </span>
                    )}
                    <div className="window-controls">
                        <button className="window-btn window-btn-min" onClick={handleMinimize} title="Minimize">
                            <Minus strokeWidth={3} />
                        </button>
                        <button className="window-btn window-btn-max" onClick={handleMaximize} title="Maximize">
                            <Maximize2 strokeWidth={2.5} />
                        </button>
                        <button className="window-btn window-btn-close" onClick={handleClose} title="Close">
                            <X strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Content Area — hidden entirely when minimized */}
                {!isMinimized && (
                    <div className="window-content-area">
                        <textarea
                            ref={textareaRef}
                            className="node-inline-textarea nodrag"
                            value={data.label || ''}
                            placeholder="What's your thought..."
                            onChange={(e) => {
                                const val = e.target.value;
                                setNodes((nds) => nds.map((n) =>
                                    n.id === nodeId ? { ...n, data: { ...n.data, label: val } } : n
                                ));
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                            onContextMenu={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Bottom connection handle — hidden when node is Final */}
            {!data.isFinal && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="node-handle"
                />
            )}
        </>
    );
}

// Memo for performance - only re-render when props change
export default memo(CustomNode);
