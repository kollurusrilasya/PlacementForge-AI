
const API_BASE_URL = import.meta.env.VITE_API_URL

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('placement_forge_token')

    const headers = {
        ...options.headers,
    }

    // Don't set JSON Content-Type for FormData uploads
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }

    // Attach JWT token automatically
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    let response

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        })
    } catch (error) {
        throw new Error(
            'Unable to connect to the server. Please check your internet connection.'
        )
    }

    // Safely parse backend response
    let data = {}

    try {
        data = await response.json()
    } catch {
        data = {}
    }

    // Handle API errors
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('placement_forge_token')
            localStorage.removeItem('placement_forge_user')
    
            // Redirect to landing page
            window.location.replace('/')
        }
    
        const error = new Error(
            data.message || `Request failed with status ${response.status}`
        )
    
        error.status = response.status
    
        throw error
    }

    return data
}
