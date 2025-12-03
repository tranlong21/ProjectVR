/**
 * Utility functions for user authentication and authorization
 */

/**
 * Check if user has a specific role
 * Backend returns:
 * {
 *   "roles": ["ROLE_ADMIN"]
 * }
 *
 * @param {Object} user - User object
 * @param {string} roleName - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, roleName) => {
    if (!user || !roleName) return false;

    // Preferred backend format: roles = array
    if (Array.isArray(user.roles)) {
        return user.roles.includes(roleName);
    }

    // Fallback: some systems return single role
    if (typeof user.role === "string") {
        return user.role === roleName;
    }

    if (typeof user.roles === "string") {
        return user.roles === roleName;
    }

    return false;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user) => {
    return hasRole(user, "ROLE_ADMIN") || hasRole(user, "ADMIN");
};

/**
 * Check whether user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

/**
 * Return current stored user object
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

/**
 * Get username display
 */
export const getUserDisplayName = (user) => {
    if (!user) return "Guest";
    return user.username || user.name || user.email || "User";
};
