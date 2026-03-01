/**
 * ============================================
 * GRAPH HELPER UTILITIES
 * Functions for traversing and analyzing the
 * node graph - especially for recursive
 * path selection
 * ============================================
 */

/**
 * Recursively finds ALL descendant nodes from a starting node
 * 
 * HOW THE RECURSIVE ALGORITHM WORKS:
 * ───────────────────────────────────
 * 
 * Imagine you have this tree:
 * 
 *        A (start)
 *       / \
 *      B   C
 *     /   / \
 *    D   E   F
 * 
 * When you call getDescendants('A', edges):
 * 
 * 1. We look for all edges where A is the source
 *    → Found: A→B and A→C
 *    → Children of A: [B, C]
 * 
 * 2. Now we RECURSIVELY call getDescendants for each child:
 *    
 *    getDescendants('B', edges):
 *    → Found: B→D, children: [D]
 *    → getDescendants('D', edges) returns [] (no children)
 *    → Returns [D]
 *    
 *    getDescendants('C', edges):
 *    → Found: C→E and C→F, children: [E, F]
 *    → getDescendants('E', edges) returns []
 *    → getDescendants('F', edges) returns []
 *    → Returns [E, F]
 * 
 * 3. Final result: [B, C, D, E, F] - all descendants!
 * 
 * The 'visited' Set prevents infinite loops if there are cycles:
 * If A→B→C→A (a cycle), we would get stuck forever.
 * But once we visit A, we add it to 'visited' and skip it next time.
 * 
 * @param {string} nodeId - The starting node ID
 * @param {Array} edges - All edges in the graph
 * @param {Set} visited - Tracks visited nodes (prevents infinite loops)
 * @returns {Array} - Array of all descendant node IDs
 */
export function getDescendants(nodeId, edges, visited = new Set()) {
    // STEP 1: Check if we've already visited this node
    // This prevents infinite loops in graphs with cycles
    if (visited.has(nodeId)) {
        return [];
    }

    // Mark this node as visited
    visited.add(nodeId);

    // STEP 2: Find all edges where this node is the SOURCE
    // These edges point to this node's children
    const childEdges = edges.filter((edge) => edge.source === nodeId);

    // STEP 3: Extract the child node IDs from those edges
    const childIds = childEdges.map((edge) => edge.target);

    // STEP 4: For each child, recursively find THEIR descendants
    // Then combine everything into one array
    let allDescendants = [...childIds];

    for (const childId of childIds) {
        // Get all descendants of this child
        const grandchildren = getDescendants(childId, edges, visited);
        // Add them to our results
        allDescendants = [...allDescendants, ...grandchildren];
    }

    return allDescendants;
}

/**
 * Find all edges that connect the selected nodes
 * 
 * This is used to highlight the "path" edges when
 * a node and its descendants are selected
 * 
 * @param {Array} selectedNodeIds - Array of selected node IDs
 * @param {Array} edges - All edges in the graph
 * @returns {Array} - Edge IDs that connect selected nodes
 */
export function getConnectedEdgeIds(selectedNodeIds, edges) {
    // Create a Set for O(1) lookup performance
    const selectedSet = new Set(selectedNodeIds);

    // An edge is "connected" if BOTH its source AND target
    // are in the selected nodes set
    const connectedEdges = edges.filter((edge) => {
        return selectedSet.has(edge.source) && selectedSet.has(edge.target);
    });

    // Return just the IDs
    return connectedEdges.map((edge) => edge.id);
}

/**
 * Generate a unique ID for new nodes
 * Uses timestamp + random string for uniqueness
 * 
 * @returns {string} - Unique node ID
 */
export function generateNodeId() {
    return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate position for a new child node
 * Places it below and slightly offset from the parent
 * 
 * @param {Object} parentNode - The parent node object
 * @param {Array} existingNodes - All existing nodes (to avoid overlap)
 * @param {number} childIndex - Which child this is (0, 1, 2...)
 * @returns {Object} - Position { x, y }
 */
export function calculateChildPosition(parentNode, existingNodes, childIndex = 0) {
    // Basic positioning: below parent, offset horizontally
    const verticalGap = 120;
    const horizontalOffset = 150;

    // Start position based on parent
    const baseX = parentNode.position.x;
    const baseY = parentNode.position.y + (parentNode.height || 80) + verticalGap;

    // Offset based on child index (-1, 0, 1 pattern for 3 children)
    const offsetX = (childIndex - 0.5) * horizontalOffset;

    return {
        x: baseX + offsetX,
        y: baseY,
    };
}

/**
 * Find parent nodes of a given node
 * (Nodes that have edges pointing TO this node)
 * 
 * @param {string} nodeId - Node to find parents of
 * @param {Array} edges - All edges
 * @returns {Array} - Parent node IDs
 */
export function getParentIds(nodeId, edges) {
    return edges
        .filter((edge) => edge.target === nodeId)
        .map((edge) => edge.source);
}

/**
 * Find child nodes of a given node
 * (Nodes that this node has edges pointing to)
 * 
 * @param {string} nodeId - Node to find children of
 * @param {Array} edges - All edges
 * @returns {Array} - Child node IDs
 */
export function getChildIds(nodeId, edges) {
    return edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => edge.target);
}

/**
 * Find the shortest directed path between two nodes using BFS
 * @param {string} sourceId - Starting node ID
 * @param {string} targetId - Destination node ID
 * @param {Array} edges - All edges in graph
 * @returns {Array|null} Array of node IDs forming path, or null if no path
 */
export function findPathBFS(sourceId, targetId, edges) {
    if (sourceId === targetId) return [sourceId];

    // Create an adjacency list from edges
    const adj = {};
    for (const edge of edges) {
        if (!adj[edge.source]) adj[edge.source] = [];
        adj[edge.source].push(edge.target);
    }

    // Queue stores paths: [node1, node2, ...]
    const queue = [[sourceId]];
    const visited = new Set([sourceId]);

    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];

        if (node === targetId) {
            return path;
        }

        const neighbors = adj[node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }

    return null; // No path found
}
