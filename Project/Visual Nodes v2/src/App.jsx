/**
 * ============================================
 * STAR-MAP FLOW EDITOR - MAIN APPLICATION
 * 
 * An infinite canvas flow editor with:
 * - Space theme (black background, white dots)
 * - Custom resizable nodes with dynamic text
 * - Recursive path selection with glow effects
 * - Context menus for adding/deleting nodes
 * - Auto-arrange using dagre
 * - Import/Export JSON functionality
 * ============================================
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X } from 'lucide-react';

// Custom components
import CustomNode from './components/CustomNode';
import Toolbar from './components/Toolbar';
import ContextMenu from './components/ContextMenu';
import ConfirmDialog from './components/ConfirmDialog';
import ScriptPanel from './components/ScriptPanel';

// Utilities
import { getLayoutedNodes } from './utils/layout';
import {
  generateNodeId,
  getChildIds,
  findPathBFS,
  getDescendants,
} from './utils/graphHelpers';

/**
 * Define custom node types
 * This tells React Flow to use our CustomNode component
 * for nodes with type: 'custom'
 */
const nodeTypes = {
  custom: CustomNode,
};

/**
 * Initial nodes to show when app first loads
 * These demonstrate the basic structure
 */
// Default node dimensions — tweak here to affect all new nodes
const NODE_W = 160;
const NODE_H = 90;

const initialNodes = [
  {
    id: 'node_1',
    type: 'custom',
    position: { x: 300, y: 60 },
    data: { label: '', windowLabel: 'Node 1', isGlowing: false },
    width: NODE_W,
    height: NODE_H,
  },
  {
    id: 'node_2',
    type: 'custom',
    position: { x: 60, y: 240 },
    data: { label: '', windowLabel: 'Node 2', isGlowing: false },
    width: NODE_W,
    height: NODE_H,
  },
  {
    id: 'node_3',
    type: 'custom',
    position: { x: 540, y: 240 },
    data: { label: '', windowLabel: 'Node 3', isGlowing: false },
    width: NODE_W,
    height: NODE_H,
  },
];

/**
 * Initial edges connecting the nodes
 */
const initialEdges = [
  { id: 'edge_1_2', source: 'node_1', target: 'node_2' },
  { id: 'edge_1_3', source: 'node_1', target: 'node_3' },
];

/**
 * FlowEditor - The main canvas component
 * Wrapped in ReactFlowProvider for access to React Flow instance
 */
function FlowEditor() {
  // ═══════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════

  // Nodes and edges state (React Flow hooks)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // UI state
  const [isPathMode, setIsPathMode] = useState(false);        // Path selection mode toggle
  const [isFullscreen, setIsFullscreen] = useState(false);    // Fullscreen state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);  // Clear all dialog
  const [showMiniMap, setShowMiniMap] = useState(false);      // Minimap toggle
  const [showScriptPanel, setShowScriptPanel] = useState(false); // Script editor panel

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);
  // Format: { x: number, y: number, nodeId: string | null }

  // Maximize modal state
  const [maximizedNode, setMaximizedNode] = useState(null);

  // Selected nodes in path mode
  const [pathSourceNode, setPathSourceNode] = useState(null);

  // React Flow instance for programmatic control
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef(null);

  // ═══════════════════════════════════════════
  // UNDO / REDO HISTORY
  // ═══════════════════════════════════════════

  // History + future stacks stored in refs — no re-render cost
  const historyStack = useRef([{
    nodes: initialNodes.map(n => ({ ...n })),
    edges: initialEdges.map(e => ({ ...e })),
  }]);
  const futureStack = useRef([]);
  // Flag to suppress snapshot after undo/redo restores state
  const isUndoRedo = useRef(false);
  const snapshotTimer = useRef(null);

  // Debounced snapshot: waits 400ms after last change before saving
  // This prevents every drag frame / keystroke from creating a history entry
  useEffect(() => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false; // Reset flag, skip this snapshot
      return;
    }
    clearTimeout(snapshotTimer.current);
    snapshotTimer.current = setTimeout(() => {
      const snapshot = {
        nodes: nodes.map(n => ({ ...n })),
        edges: edges.map(e => ({ ...e })),
      };
      historyStack.current = [
        ...historyStack.current.slice(-49), // Max 50 entries
        snapshot,
      ];
      futureStack.current = []; // New action clears redo stack
    }, 400);
    return () => clearTimeout(snapshotTimer.current);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (historyStack.current.length <= 1) return; // Nothing to undo
    const current = historyStack.current[historyStack.current.length - 1];
    const prev = historyStack.current[historyStack.current.length - 2];
    // Move current state to future, step back to prev
    futureStack.current = [current, ...futureStack.current];
    historyStack.current = historyStack.current.slice(0, -1);
    isUndoRedo.current = true;
    setNodes(prev.nodes);
    setEdges(prev.edges);
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    if (futureStack.current.length === 0) return; // Nothing to redo
    const next = futureStack.current[0];
    historyStack.current = [...historyStack.current, next];
    futureStack.current = futureStack.current.slice(1);
    isUndoRedo.current = true;
    setNodes(next.nodes);
    setEdges(next.edges);
  }, [setNodes, setEdges]);

  // Keyboard shortcuts for undo / redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Let browser handle Ctrl+Z/Y natively when user is typing
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // ═══════════════════════════════════════════
  // FULLSCREEN HANDLING
  // ═══════════════════════════════════════════

  /**
   * Toggle browser fullscreen mode
   */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes (e.g., user presses Escape)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Listen for maximize & minimize events from inner nodes
  useEffect(() => {
    const handleNodeMaximize = (e) => {
      const nodeHtmlId = e.detail.nodeId;
      const fullNodeData = nodes.find(n => n.id === nodeHtmlId);
      if (fullNodeData) setMaximizedNode(fullNodeData);
    };

    const handleNodeMinimizeToggle = (e) => {
      const { nodeId, isMinimized } = e.detail;
      const TITLE_H = 32; // height of the title bar only

      // Collect all descendant node IDs to hide/show
      const descendantIds = getDescendants(nodeId, edges);

      setNodes((nds) => nds.map((n) => {
        // ── Parent node: collapse to title bar or restore ──────────────────
        if (n.id === nodeId) {
          const currentH = n.style?.height ?? n.height ?? NODE_H;
          // Save height before first minimize so we can restore it exactly
          const savedH = n.data._savedHeight ?? currentH;
          const newH = isMinimized ? TITLE_H : savedH;

          return {
            ...n,
            data: {
              ...n.data,
              isLocallyMinimized: isMinimized,
              // Persist saved height so restoring works even after remount
              _savedHeight: isMinimized ? currentH : savedH,
            },
            height: newH,
            style: { ...n.style, height: newH },
          };
        }

        // ── Descendants: simply hide or show ──────────────────────────────
        if (descendantIds.includes(n.id)) {
          return { ...n, hidden: isMinimized };
        }

        return n;
      }));
    };

    window.addEventListener('nodeMaximize', handleNodeMaximize);
    window.addEventListener('nodeMinimizeToggle', handleNodeMinimizeToggle);
    return () => {
      window.removeEventListener('nodeMaximize', handleNodeMaximize);
      window.removeEventListener('nodeMinimizeToggle', handleNodeMinimizeToggle);
    };
  }, [nodes, edges, setNodes]);

  // ═══════════════════════════════════════════
  // CONNECTION HANDLING
  // ═══════════════════════════════════════════

  /**
   * Handle new edge connections
   * Called when user drags from one handle to another
   */
  const onConnect = useCallback(
    (params) => {
      // Create a unique ID for the new edge
      const newEdge = {
        ...params,
        id: `edge_${params.source}_${params.target}`,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // ═══════════════════════════════════════════
  // PATH MODE SELECTION LOGIC
  // ═══════════════════════════════════════════

  /**
   * Handle node click in path mode
   * 
   * When path mode is ON and user clicks a node:
   * 1. Find all descendants recursively
   * 2. Update node data to show glow effect
   * 3. Mark edges in the path for glow effect
   */
  const onNodeClick = useCallback(
    (event, node) => {
      // Only process if path mode is active
      if (!isPathMode) return;

      if (!pathSourceNode) {
        // First click - set source node
        setPathSourceNode(node.id);

        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, isGlowing: n.id === node.id }
          }))
        );
        setEdges((eds) => eds.map((e) => ({ ...e, className: '' })));
      } else {
        // Second click - find path
        const path = findPathBFS(pathSourceNode, node.id, edges);

        if (path) {
          // We only highlight edges directly on the path, not all connected edges
          const pathEdges = new Set();
          for (let i = 0; i < path.length - 1; i++) {
            const s = path[i];
            const t = path[i + 1];
            const edge = edges.find(e => e.source === s && e.target === t);
            if (edge) pathEdges.add(edge.id);
          }

          setNodes((nds) =>
            nds.map((n) => ({
              ...n,
              data: { ...n.data, isGlowing: path.includes(n.id) }
            }))
          );

          setEdges((eds) =>
            eds.map((e) => ({
              ...e,
              className: pathEdges.has(e.id) ? 'glowing' : ''
            }))
          );
        } else {
          // No path found, hold the newly clicked node as the source
          setPathSourceNode(node.id);
          setNodes((nds) =>
            nds.map((n) => ({
              ...n,
              data: { ...n.data, isGlowing: n.id === node.id }
            }))
          );
          setEdges((eds) => eds.map((e) => ({ ...e, className: '' })));
        }

        // Reset pathSourceNode so they can select a new path
        setPathSourceNode(null);
      }
    },
    [isPathMode, pathSourceNode, edges, setNodes, setEdges]
  );

  /**
   * Toggle path selection mode
   * When turning OFF, clear all glow effects
   */
  const togglePathMode = useCallback(() => {
    setIsPathMode((prev) => {
      if (prev) {
        // Turning OFF - clear all glows
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, isGlowing: false },
          }))
        );
        setEdges((eds) =>
          eds.map((e) => ({ ...e, className: '' }))
        );
        setPathSourceNode(null);
      }
      return !prev;
    });
  }, [setNodes, setEdges]);

  // ═══════════════════════════════════════════
  // CONTEXT MENU HANDLING
  // ═══════════════════════════════════════════

  /**
   * Handle right-click on a node
   */
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();

    // Compute topology so ContextMenu can show/hide role options
    const hasParent = edges.some((e) => e.target === node.id);
    const hasChild = edges.some((e) => e.source === node.id);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
      hasParent,
      hasChild,
      isRoot: !!node.data.isRoot,
      isFinal: !!node.data.isFinal,
    });
  }, [edges]);

  /**
   * Handle right-click on the canvas (not on a node)
   * React Flow fires this only for true pane clicks (not drags), so it's reliable.
   */
  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, nodeId: null });
  }, []);

  /**
   * Close the context menu
   */
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  /**
   * Toggle isRoot on a node — removes/restores the top (target) handle
   */
  const toggleRootNode = useCallback((nodeId) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, isRoot: !n.data.isRoot } } : n
    ));
  }, [setNodes]);

  /**
   * Toggle isFinal on a node — removes/restores the bottom (source) handle
   */
  const toggleFinalNode = useCallback((nodeId) => {
    setNodes((nds) => nds.map((n) =>
      n.id === nodeId ? { ...n, data: { ...n.data, isFinal: !n.data.isFinal } } : n
    ));
  }, [setNodes]);

  /**
   * Add a child node to an existing node
   * 
   * @param {string} parentId - ID of the parent node
   * @param {string} type - Type label ('If', 'Else', 'Info')
   */
  const addChildNode = useCallback(
    (parentId, type) => {
      // Find the parent node to get its position
      const parentNode = nodes.find((n) => n.id === parentId);
      if (!parentNode) return;

      // Count existing children to offset position
      const existingChildren = getChildIds(parentId, edges);
      const childIndex = existingChildren.length;

      // Calculate position for new node
      const offsetX = (childIndex - existingChildren.length / 2) * 180;

      const currentZoom = reactFlowInstance.getZoom() || 1;

      // Name the child node based on its type (If, Else, etc.)
      const childLabel = type || 'Node';

      const newNodeId = generateNodeId();
      const newNode = {
        id: newNodeId,
        type: 'custom',
        position: {
          x: parentNode.position.x + offsetX,
          y: parentNode.position.y + NODE_H + 60,
        },
        data: {
          label: '',
          upperLabel: type,
          windowLabel: childLabel,
          isGlowing: false,
        },
        width: NODE_W,
        height: NODE_H,
        style: { width: NODE_W, height: NODE_H },
      };

      // Create edge connecting parent to new child
      const newEdge = {
        id: `edge_${parentId}_${newNode.id}`,
        source: parentId,
        target: newNode.id,
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [nodes, edges, setNodes, setEdges, reactFlowInstance]
  );

  /**
   * Add a new standalone node on the canvas
   * 
   * @param {number} screenX - Screen X position (from click)
   * @param {number} screenY - Screen Y position (from click)
   */
  const addNodeOnCanvas = useCallback(
    (screenX, screenY) => {
      // Convert screen position to flow position
      const position = reactFlowInstance.screenToFlowPosition({
        x: screenX,
        y: screenY,
      });

      // Auto-name: find the highest existing "Node N" number and increment
      const newNodeId = generateNodeId();
      setNodes((nds) => {
        const maxNum = nds.reduce((max, n) => {
          const match = (n.data.windowLabel || '').match(/^Node (\d+)$/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        const autoLabel = `Node ${maxNum + 1}`;

        const newNode = {
          id: newNodeId,
          type: 'custom',
          position,
          data: {
            label: '',
            windowLabel: autoLabel,
            isGlowing: false,
          },
          width: NODE_W,
          height: NODE_H,
          style: { width: NODE_W, height: NODE_H },
        };
        return [...nds, newNode];
      });
    },
    [reactFlowInstance, setNodes]
  );

  /**
   * Delete a node and its connected edges
   * 
   * @param {string} nodeId - ID of node to delete
   */
  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  const setWindowLabel = useCallback((nodeId) => {
    const labelText = window.prompt("Enter Window Label text:");
    if (labelText !== null) {
      setNodes((nds) => nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, windowLabel: labelText }
          };
        }
        return n;
      }));
    }
  }, [setNodes]);

  const setWindowTitle = useCallback((nodeId) => {
    const titleText = window.prompt("Enter Node Title text:");
    if (titleText !== null) {
      setNodes((nds) => nds.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, titleLabel: titleText }
          };
        }
        return n;
      }));
    }
  }, [setNodes]);

  const toggleMinimap = useCallback(() => {
    setShowMiniMap((prev) => !prev);
  }, []);

  // ═══════════════════════════════════════════
  // AUTO-ARRANGE (DAGRE LAYOUT)
  // ═══════════════════════════════════════════

  /**
   * Automatically arrange nodes using dagre algorithm
   * Organizes messy graphs into clean tree structures
   */
  const autoArrange = useCallback(() => {
    // Get new positions from dagre
    const layoutedNodes = getLayoutedNodes(nodes, edges, {
      direction: 'TB',  // Top to bottom
      nodeWidth: 180,
      nodeHeight: 80,
      rankSep: 100,     // Vertical spacing
      nodeSep: 60,      // Horizontal spacing
    });

    // Update nodes with new positions
    setNodes(layoutedNodes);

    // Wait a bit then fit the view to show all nodes
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, duration: 500 });
    }, 50);
  }, [nodes, edges, setNodes, reactFlowInstance]);

  // ═══════════════════════════════════════════
  // IMPORT / EXPORT
  // ═══════════════════════════════════════════

  /**
   * Export current graph to JSON file
   * 
   * HOW EXPORT WORKS:
   * 1. Get current nodes and edges arrays
   * 2. Get current viewport (pan/zoom position)
   * 3. Combine into a single object
   * 4. Convert to JSON string
   * 5. Create a Blob (binary data)
   * 6. Create a download link
   * 7. Programmatically click the link to trigger download
   * 8. Clean up the temporary link
   */
  const handleExport = useCallback(() => {
    // Collect all data to save
    const exportData = {
      // Nodes array with all their properties
      nodes: nodes,
      // Edges array with connections
      edges: edges,
      // Viewport so we can restore the exact view
      viewport: reactFlowInstance.getViewport(),
      // Metadata for the file
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    // Convert to formatted JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create a Blob (Binary Large Object) from the JSON
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `flow-export-${Date.now()}.json`;

    // Add to document, click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    URL.revokeObjectURL(url);
  }, [nodes, edges, reactFlowInstance]);

  /**
   * Import graph from JSON data
   * 
   * HOW IMPORT WORKS:
   * 1. Receive parsed JSON data from file input
   * 2. Validate that nodes and edges exist
   * 3. Set the nodes state (replaces current nodes)
   * 4. Set the edges state (replaces current edges)
   * 5. If viewport was saved, restore pan/zoom position
   * 
   * @param {Object} data - Parsed JSON data
   */
  const handleImport = useCallback(
    (data) => {
      // Validate the data structure
      if (!data.nodes || !data.edges) {
        console.error('Invalid import data: missing nodes or edges');
        alert('Invalid file format. Expected nodes and edges arrays.');
        return;
      }

      // Replace current nodes and edges
      setNodes(data.nodes);
      setEdges(data.edges);

      // Restore viewport if it was saved
      if (data.viewport) {
        // Small delay to ensure nodes are rendered first
        setTimeout(() => {
          reactFlowInstance.setViewport(data.viewport, { duration: 500 });
        }, 100);
      } else {
        // Otherwise, fit view to show all imported nodes
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2, duration: 500 });
        }, 100);
      }
    },
    [setNodes, setEdges, reactFlowInstance]
  );

  // ═══════════════════════════════════════════
  // CLEAR ALL
  // ═══════════════════════════════════════════

  /**
   * Show confirmation dialog for clearing all nodes
   */
  const handleClearAll = useCallback(() => {
    setShowConfirmDialog(true);
  }, []);

  /**
   * Confirm clear - delete all nodes and edges
   */
  const confirmClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setPathSourceNode(null);
    setShowConfirmDialog(false);
  }, [setNodes, setEdges]);

  /**
   * Cancel clear - close dialog without deleting
   */
  const cancelClear = useCallback(() => {
    setShowConfirmDialog(false);
  }, []);

  /**
   * Auto-create a node + edge when an edge is dropped on empty canvas
   * Fires when user drags from a handle and releases on empty space
   */
  const onConnectEnd = useCallback(
    (event, connectionState) => {
      // Only trigger when drop didn't land on a valid handle
      if (connectionState?.isValid) return;

      const fromNodeId = connectionState?.fromNode?.id;
      if (!fromNodeId) return;

      // Get drop screen coords (supports both mouse and touch)
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;

      const position = reactFlowInstance.screenToFlowPosition({ x: clientX, y: clientY });
      const newNodeId = generateNodeId();

      setNodes((nds) => {
        const maxNum = nds.reduce((max, n) => {
          const match = (n.data.windowLabel || '').match(/^Node (\d+)$/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        const autoLabel = `Node ${maxNum + 1}`;
        const newNode = {
          id: newNodeId,
          type: 'custom',
          position,
          data: { label: '', windowLabel: autoLabel, isGlowing: false },
          width: NODE_W,
          height: NODE_H,
          style: { width: NODE_W, height: NODE_H },
        };
        return [...nds, newNode];
      });

      setEdges((eds) => {
        // If the drag started from the TOP (target) handle, the new node should
        // be the PARENT — so the edge goes: newNode → existingNode.
        // If from the BOTTOM (source) handle, new node is the CHILD: existingNode → newNode.
        const draggedFromTarget = connectionState?.fromHandle?.type === 'target';

        const edgeSource = draggedFromTarget ? newNodeId : fromNodeId;
        const edgeTarget = draggedFromTarget ? fromNodeId : newNodeId;

        return [
          ...eds,
          {
            id: `edge_${edgeSource}_${edgeTarget}`,
            source: edgeSource,
            target: edgeTarget,
          },
        ];
      });
    },
    [reactFlowInstance, setNodes, setEdges]
  );

  /**
   * Apply raw JSON data from ScriptPanel with smart post-processing.
   * Handles the minimize/restore state machine automatically so that
   * editing isLocallyMinimized in JSON produces correct visual results.
   */
  const applyScriptData = useCallback((data) => {
    const newEdges = data.edges ? [...data.edges] : edges;
    let processedNodes = data.nodes ? [...data.nodes] : nodes;

    if (data.nodes) {
      // Detect nodes being un-minimized (isLocallyMinimized: true → false)
      const unminimizing = data.nodes.filter((newN) => {
        const oldN = nodes.find((o) => o.id === newN.id);
        return oldN?.data?.isLocallyMinimized && !newN?.data?.isLocallyMinimized;
      });

      unminimizing.forEach((unminN) => {
        // Restore the saved height, or fall back to NODE_H
        const restoredH = unminN.data?._savedHeight ?? NODE_H;
        const descIds = getDescendants(unminN.id, newEdges);

        processedNodes = processedNodes.map((n) => {
          if (n.id === unminN.id) {
            return {
              ...n,
              height: restoredH,
              style: { ...n.style, height: restoredH },
              data: { ...n.data, isLocallyMinimized: false },
            };
          }
          // Un-hide all descendants
          if (descIds.includes(n.id)) {
            return { ...n, hidden: false };
          }
          return n;
        });
      });
    }

    setNodes(processedNodes);
    if (data.edges) setEdges(newEdges);
    if (data.viewport) reactFlowInstance.setViewport(data.viewport);
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance]);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════

  return (
    <div
      className="w-full h-full"
      ref={reactFlowWrapper}
      onContextMenu={(e) => {
        e.preventDefault();
        // Ctrl + right-click anywhere = create a new node at cursor position
        if (e.ctrlKey) {
          addNodeOnCanvas(e.clientX, e.clientY);
        }
        // Plain right-click: canvas pans (handled by ReactFlow), node shows menu (onNodeContextMenu)
      }}
    >
      {/* Main React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 1, minZoom: 0.1, maxZoom: 1 }}
        // Customize default edge appearance
        defaultEdgeOptions={{
          style: { stroke: 'rgba(80,160,255,0.75)', strokeWidth: 2 },
          type: 'default',
          pathOptions: { curvature: 0.5 },   // ← change THIS number
        }}

        // Keyboard shortcuts
        deleteKeyCode={['Delete']}
        // Zoom range — expanded so start zoom is in the middle
        minZoom={0.1}
        maxZoom={8}
        // Smooth panning & selection
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        // Removed snapToGrid — was causing sudden jumps on resize/drag
        nodeDragThreshold={1}
      >
        {/* Dots background - Space theme */}
        <Background
          variant="dots"
          gap={20}
          size={1}
          color="rgba(255,255,255,0.3)"
        />

        {/* Zoom controls in bottom-left */}
        <Controls
          showInteractive={false}
          className="!bg-black/80 !border-white/20"
        />

        {/* Minimap in bottom-right */}
        {showMiniMap && (
          <MiniMap
            nodeColor="#aaa"
            maskColor="rgba(0,0,0,0.5)"
            className="!bg-black/80 !border-white/20"
          />
        )}
      </ReactFlow>

      {/* Top Toolbar */}
      <Toolbar
        isPathMode={isPathMode}
        onTogglePathMode={togglePathMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onAutoArrange={autoArrange}
        onExport={handleExport}
        onImport={handleImport}
        onClearAll={handleClearAll}
        onOpenScript={() => setShowScriptPanel(true)}
      />

      {/* Context Menu (shown on right-click) */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          hasParent={contextMenu.hasParent}
          hasChild={contextMenu.hasChild}
          isRoot={contextMenu.isRoot}
          isFinal={contextMenu.isFinal}
          onAddChild={addChildNode}
          onDelete={deleteNode}
          onAddNode={addNodeOnCanvas}
          onToggleMinimap={toggleMinimap}
          showMiniMap={showMiniMap}
          onMakeRoot={toggleRootNode}
          onMakeFinal={toggleFinalNode}
          onClose={closeContextMenu}
        />
      )}

      {/* Maximized Node Modal */}
      {maximizedNode && (
        <div className="max-modal-overlay">
          <div className="max-modal-container">

            {/* Title Bar */}
            <div className="max-modal-titlebar">
              <input
                className="max-title-input"
                value={maximizedNode.data.windowLabel || ''}
                placeholder="Window name..."
                onChange={(e) => {
                  const val = e.target.value;
                  setMaximizedNode((prev) => ({ ...prev, data: { ...prev.data, windowLabel: val } }));
                  setNodes((nds) => nds.map((n) =>
                    n.id === maximizedNode.id ? { ...n, data: { ...n.data, windowLabel: val } } : n
                  ));
                }}
              />
              <button
                className="max-modal-close"
                onClick={() => setMaximizedNode(null)}
              >
                <X strokeWidth={4} size={18} color="#202020" />
              </button>
            </div>

            {/* Content Area */}
            <div className="max-modal-body">
              <textarea
                className="max-content-textarea"
                value={maximizedNode.data.label || ''}
                placeholder="✦  Start writing your thoughts here..."
                onChange={(e) => {
                  const val = e.target.value;
                  setMaximizedNode((prev) => ({ ...prev, data: { ...prev.data, label: val } }));
                  setNodes((nds) => nds.map((n) =>
                    n.id === maximizedNode.id ? { ...n, data: { ...n.data, label: val } } : n
                  ));
                }}
              />
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════ SCRIPT PANEL ═══════════════ */}
      {showScriptPanel && (
        <ScriptPanel
          nodes={nodes}
          edges={edges}
          viewport={reactFlowInstance.getViewport()}
          onApply={applyScriptData}
          onClose={() => setShowScriptPanel(false)}
        />
      )}

      {/* Confirm Dialog (for Clear All) */}
      {showConfirmDialog && (
        <ConfirmDialog
          title="Clear All Nodes"
          message="Are you sure you want to delete all nodes and edges? This action cannot be undone."
          onConfirm={confirmClear}
          onCancel={cancelClear}
          confirmText="Yes, Clear All"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}

/**
 * App - Root component
 * Wraps FlowEditor in ReactFlowProvider for context access
 */
export default function App() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}
