/**
 * ============================================
 * CONTEXT MENU COMPONENT
 * Right-click menu for nodes and blank canvas
 * ============================================
 */

import {
    GitBranchPlus,
    GitFork,
    Info,
    Trash2,
    PlusCircle,
    Map,
    Anchor,
    Flag,
} from 'lucide-react';

export default function ContextMenu({
    x,
    y,
    nodeId,
    // Connection topology of the right-clicked node
    hasParent,
    hasChild,
    isRoot,
    isFinal,
    // Handlers
    onAddChild,
    onDelete,
    onAddNode,
    onToggleMinimap,
    showMiniMap,
    onMakeRoot,
    onMakeFinal,
    onClose,
}) {
    const handleClick = (action) => {
        action();
        onClose();
    };

    const adjustedX = Math.min(x, window.innerWidth - 220);
    const adjustedY = Math.min(y, window.innerHeight - 300);

    return (
        <>
            {/* Invisible backdrop — click outside to close */}
            <div
                className="fixed inset-0 z-[999]"
                onClick={onClose}
                onContextMenu={(e) => { e.preventDefault(); onClose(); }}
            />

            <div
                className="context-menu"
                style={{ left: adjustedX, top: adjustedY }}
            >
                {nodeId ? (
                    /* ═══════════════════════════════════════
                       NODE CONTEXT MENU
                       ═══════════════════════════════════════ */
                    <>
                        {/* ── Child options — hidden when node is Final ── */}
                        {!isFinal && (
                            <>
                                <div
                                    className="context-menu-item"
                                    onClick={() => handleClick(() => onAddChild(nodeId, 'If'))}
                                >
                                    <GitBranchPlus />
                                    <span>Add Child (If)</span>
                                </div>

                                <div
                                    className="context-menu-item"
                                    onClick={() => handleClick(() => onAddChild(nodeId, 'Else'))}
                                >
                                    <GitFork />
                                    <span>Add Child (Else)</span>
                                </div>

                                <div
                                    className="context-menu-item"
                                    onClick={() => handleClick(() => onAddChild(nodeId, 'Info'))}
                                >
                                    <Info />
                                    <span>Add Info</span>
                                </div>

                                <div className="context-menu-divider" />
                            </>
                        )}

                        {/* ── Make Root — only shown when no parent exists ── */}
                        {!hasParent && (
                            <div
                                className={`context-menu-item ${isRoot ? 'context-menu-item--active' : ''}`}
                                onClick={() => handleClick(() => onMakeRoot(nodeId))}
                                title={isRoot ? 'Remove Root role — top handle restored' : 'Make Root — removes top connection handle'}
                            >
                                <Anchor size={16} />
                                <span>{isRoot ? 'Remove Root Role' : 'Make Root Node'}</span>
                            </div>
                        )}

                        {/* ── Make Final — only shown when no child exists ── */}
                        {!hasChild && (
                            <div
                                className={`context-menu-item ${isFinal ? 'context-menu-item--active' : ''}`}
                                onClick={() => handleClick(() => onMakeFinal(nodeId))}
                                title={isFinal ? 'Remove Final role — bottom handle restored' : 'Make Final — removes bottom connection handle'}
                            >
                                <Flag size={16} />
                                <span>{isFinal ? 'Remove Final Role' : 'Make Result Node'}</span>
                            </div>
                        )}

                        {/* ── Divider before delete ── */}
                        {(!hasParent || !hasChild) && <div className="context-menu-divider" />}

                        <div
                            className="context-menu-item"
                            onClick={() => handleClick(() => onDelete(nodeId))}
                            style={{ color: 'rgba(239, 68, 68, 0.9)' }}
                        >
                            <Trash2 />
                            <span>Delete Node</span>
                        </div>
                    </>
                ) : (
                    /* ═══════════════════════════════════════
                       CANVAS CONTEXT MENU
                       ═══════════════════════════════════════ */
                    <>
                        <div
                            className="context-menu-item"
                            onClick={() => handleClick(() => onAddNode(x, y))}
                        >
                            <PlusCircle />
                            <span>Add Node Here</span>
                        </div>

                        <div className="context-menu-divider" />

                        <div
                            className="context-menu-item"
                            onClick={() => handleClick(onToggleMinimap)}
                        >
                            <Map />
                            <span>{showMiniMap ? 'Hide Minimap' : 'Show Minimap'}</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
