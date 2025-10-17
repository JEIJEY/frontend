// apiClient.js — Wrapper completo para peticiones API
class ApiClient {
    constructor(baseURL = "http://localhost:3001/api") {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Si hay body y es objeto, lo convertimos a JSON
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        try {
            console.log(`🔄 API Call: ${config.method} ${url}`, config.body ? config.body : '');
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            // Manejar respuestas vacías (como en DELETE)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return null; // Para respuestas sin cuerpo

        } catch (error) {
            console.error('❌ API request failed:', error);
            throw error;
        }
    }

    // Métodos específicos para categorías (según tu backend)
    async getCategorias() {
        return this.request('/categorias');
    }

    async getCategoriaById(id) {
        return this.request(`/categorias/${id}`);
    }

    async createCategoria(categoriaData) {
        return this.request('/categorias', {
            method: 'POST',
            body: categoriaData
        });
    }

    async updateCategoria(id, categoriaData) {
        return this.request(`/categorias/${id}`, {
            method: 'PUT',
            body: categoriaData
        });
    }

    async deleteCategoria(id) {
        return this.request(`/categorias/${id}`, {
            method: 'DELETE'
        });
    }

    // Métodos genéricos
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body });
    }

    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Instancia global para usar en toda la aplicación
const apiClient = new ApiClient();
export default apiClient;