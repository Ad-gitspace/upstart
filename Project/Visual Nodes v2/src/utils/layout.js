/**
 * ============================================
 * LAYOUT UTILITIES
 * Uses dagre library to auto-arrange nodes
 * in a clean tree structure
 * ============================================
 */

import dagre from 'dagre';

/**
 * Automatically arranges nodes in a tree layout using dagre
 * 
 * HOW IT WORKS:
 * 1. Create a new directed graph
 * 2. Add all nodes to the graph with their dimensions
 * 3. Add all edges (connections) to the graph
 * 4. Run dagre's layout algorithm
 * 5. Extract the new positions and return updated nodes
 * 
 * @param {Array} nodes - Array of React Flow nodes
 * @param {Array} edges - Array of React Flow edges
 * @param {Object} options - Layout options
 * @returns {Array} - Nodes with updated positions
 */
export function getLayoutedNodes(nodes, edges, options = {}) {
    // Default configuration for the layout
    const {
        direction = 'TB',  // TB = top-to-bottom, LR = left-to-right
        nodeWidth = 180,   // Default node width for spacing
        nodeHeight = 80,   // Default node height for spacing
        rankSep = 80,      // Vertical spacing between ranks (levels)
        nodeSep = 50,      // Horizontal spacing between nodes
    } = options;

    // Create a new dagre graph
    const dagreGraph = new dagre.graphlib.Graph();

    // Set graph properties
    // setDefaultEdgeLabel is required by dagre
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Configure the graph layout
    dagreGraph.setGraph({
        rankdir: direction,  // Direction of the layout
        ranksep: rankSep,    // Space between ranks
        nodesep: nodeSep,    // Space between nodes in same rank
        marginx: 50,         // Left/right margin
        marginy: 50,         // Top/bottom margin
    });

    // Add all nodes to the dagre graph
    // Each node needs an id and dimensions (width, height)
    nodes.forEach((node) => {
        // Use the node's actual dimensions if available, otherwise use defaults
        const width = node.width || nodeWidth;
        const height = node.height || nodeHeight;

        dagreGraph.setNode(node.id, { width, height });
    });

    // Add all edges to the dagre graph
    // Each edge needs a source and target node id
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Run the dagre layout algorithm
    // This calculates optimal positions for all nodes
    dagre.layout(dagreGraph);

    // Extract the new positions and create updated nodes
    const layoutedNodes = nodes.map((node) => {
        // Get the node's position from dagre
        const nodeWithPosition = dagreGraph.node(node.id);

        // dagre gives us center positions, but React Flow uses top-left
        // So we need to offset by half the width/height
        const width = node.width || nodeWidth;
        const height = node.height || nodeHeight;

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - height / 2,
            },
        };
    });

    return layoutedNodes;
}

/**
 * Get the bounds of all nodes
 * Useful for fitting the view after auto-arrange
 * 
 * @param {Array} nodes - Array of nodes
 * @returns {Object} - Bounding box { minX, maxX, minY, maxY }
 */
export function getNodesBounds(nodes) {
    if (nodes.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
        const width = node.width || 180;
        const height = node.height || 80;

        minX = Math.min(minX, node.position.x);
        maxX = Math.max(maxX, node.position.x + width);
        minY = Math.min(minY, node.position.y);
        maxY = Math.max(maxY, node.position.y + height);
    });

    return { minX, maxX, minY, maxY };
}
