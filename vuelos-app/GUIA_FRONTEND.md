# 🚀 Guía de Integración Frontend - Backend

## 📋 Resumen del Proyecto

Este es un backend FastAPI para gestionar inventario de catering con las siguientes funcionalidades:
- **Productos** (`/products`)
- **Lotes** (`/lotes`)
- **Items de Lote** (`/lot-items`)
- **Asignaciones** (`/assignments`)

## 🔧 Configuración Inicial

### 1. Instalar Dependencias

```powershell
# Activar el entorno virtual
.\.venv\Scripts\Activate.ps1

# Las dependencias ya están instaladas, pero si necesitas reinstalar:
pip install fastapi uvicorn[standard] sqlalchemy asyncpg psycopg2-binary alembic pydantic-settings
```

### 2. Configurar Base de Datos

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
DB_USER=tu_usuario
DB_USER_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_tu_base_de_datos
```

### 3. Ejecutar Migraciones (si usas la base de datos)

```powershell
alembic upgrade head
```

### 4. Iniciar el Servidor

```powershell
# Modo desarrollo con auto-reload
uvicorn src.main:app --reload --host 127.0.0.1 --port 8002

# O usando el intérprete del entorno virtual directamente
.\.venv\Scripts\python.exe -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8002
```

El servidor estará disponible en: **http://localhost:8002**

## 📚 Documentación Automática

FastAPI genera documentación interactiva automáticamente:
-- **Swagger UI**: http://localhost:8002/docs
-- **ReDoc**: http://localhost:8002/redoc

## 🌐 CORS (Conexión con Frontend)

El backend ya está configurado con CORS para permitir peticiones desde el navegador. Por defecto, acepta peticiones desde cualquier origen (`["*"]`).

**Para producción**, cambia `CORS_ALLOWED_ORIGINS` en `.env`:
```env
CORS_ALLOWED_ORIGINS=["http://localhost:3000", "https://tu-dominio.com"]
```

## 💻 Ejemplos de Integración Frontend

### Configuración Base

```javascript
// Crea un archivo api.js o similar en tu frontend
const API_BASE_URL = 'http://localhost:8002';

// Headers comunes
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
```

### 1. Listar Productos

```javascript
async function getProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const products = await response.json();
    console.log('Productos:', products);
    return products;
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
}
```

### 2. Crear un Producto

```javascript
async function createProduct(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(productData),
    });
    
    if (response.status === 409) {
      // Producto duplicado
      const error = await response.json();
      throw new Error('El producto ya existe: ' + JSON.stringify(error));
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const newProduct = await response.json();
    console.log('Producto creado:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
}

// Ejemplo de uso:
const producto = {
  product_code: 'PROD001',
  name: 'Café Expresso',
  description: 'Café de calidad premium',
  // Agrega los campos que necesites según tu schema
};

createProduct(producto);
```

### 3. Obtener un Producto por ID

```javascript
async function getProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'GET',
      headers: headers,
    });
    
    if (response.status === 404) {
      console.log('Producto no encontrado');
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    throw error;
  }
}
```

### 4. Actualizar un Producto

```javascript
async function updateProduct(productId, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(updates),
    });
    
    if (response.status === 404) {
      throw new Error('Producto no encontrado');
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    console.error('Error actualizando producto:', error);
    throw error;
  }
}

// Ejemplo de uso:
updateProduct('uuid-del-producto', { name: 'Nuevo Nombre' });
```

### 5. Eliminar un Producto

```javascript
async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (response.status === 404) {
      throw new Error('Producto no encontrado');
    }
    
    if (response.status === 204) {
      console.log('Producto eliminado exitosamente');
      return true;
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error eliminando producto:', error);
    throw error;
  }
}
```

### 6. Trabajar con Lotes

```javascript
// Listar lotes
async function getLotes() {
  const response = await fetch(`${API_BASE_URL}/lotes`);
  return response.json();
}

// Crear lote
async function createLote(loteData) {
  const response = await fetch(`${API_BASE_URL}/lotes`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(loteData),
  });
  return response.json();
}

// Obtener detalles completos de un lote
async function getLoteDetailed(loteId) {
  const response = await fetch(`${API_BASE_URL}/lotes/${loteId}/detailed`);
  return response.json();
}

// Listar items de un lote
async function getLoteItems(loteId) {
  const response = await fetch(`${API_BASE_URL}/lotes/${loteId}/items`);
  return response.json();
}
```

## 🎯 Ejemplo Completo con React

```jsx
import { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
  const response = await fetch('http://localhost:8002/products');
      
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
  const response = await fetch('http://localhost:8002/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.status === 409) {
        alert('El producto ya existe');
        return;
      }

      if (!response.ok) {
        throw new Error('Error al crear producto');
      }

      const newProduct = await response.json();
      setProducts([...products, newProduct]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - {product.product_code}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
```

## 📱 Ejemplo con Axios (alternativa a fetch)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Listar productos
export const getProducts = () => api.get('/products');

// Crear producto
export const createProduct = (data) => api.post('/products', data);

// Obtener producto
export const getProduct = (id) => api.get(`/products/${id}`);

// Actualizar producto
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data);

// Eliminar producto
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Uso en componente:
// const { data } = await getProducts();
```

## 🔍 Manejo de Errores

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // Manejo específico por código de estado
    switch (response.status) {
      case 404:
        throw new Error('Recurso no encontrado');
      case 409:
        throw new Error('Conflicto: El recurso ya existe');
      case 422:
        const validationError = await response.json();
        throw new Error('Error de validación: ' + JSON.stringify(validationError));
      case 500:
        throw new Error('Error interno del servidor');
    }
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    // Para DELETE que retorna 204 No Content
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
}
```

## 📊 Estructura de Respuestas

### Producto (ProductRead)
```json
{
  "id": "uuid-aqui",
  "product_code": "PROD001",
  "name": "Nombre del producto",
  "description": "Descripción",
  "created_at": "2025-10-25T10:00:00",
  "updated_at": "2025-10-25T10:00:00"
}
```

### Error de Validación (422)
```json
{
  "detail": [
    {
      "loc": ["body", "product_code"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Error de Conflicto (409)
```json
{
  "error_code": "PRODUCT_DUPLICATE",
  "detail": "The provided product_code already exists."
}
```

## 🚀 Tips de Producción

1. **Variables de entorno en frontend**:
   ```javascript
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002';
   ```

2. **Interceptores para autenticación** (si agregas auth):
   ```javascript
   const token = localStorage.getItem('token');
   headers['Authorization'] = `Bearer ${token}`;
   ```

3. **Retry logic para peticiones fallidas**:
   ```javascript
   async function fetchWithRetry(url, options, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fetch(url, options);
       } catch (error) {
         if (i === retries - 1) throw error;
         await new Promise(r => setTimeout(r, 1000 * (i + 1)));
       }
     }
   }
   ```

## 🔐 Próximos Pasos Recomendados

1. **Autenticación**: Agregar JWT tokens para proteger endpoints
2. **Rate Limiting**: Limitar peticiones por IP
3. **Logging**: Implementar logging estructurado
4. **Tests**: Agregar tests para los endpoints
5. **Validación**: Revisar y ajustar los schemas de Pydantic según necesites

## 📞 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/products` | Listar productos |
| POST | `/products` | Crear producto |
| GET | `/products/{id}` | Obtener producto |
| PATCH | `/products/{id}` | Actualizar producto |
| DELETE | `/products/{id}` | Eliminar producto |
| GET | `/lotes` | Listar lotes |
| POST | `/lotes` | Crear lote |
| GET | `/lotes/{id}` | Obtener lote |
| GET | `/lotes/{id}/detailed` | Lote con detalles |
| PATCH | `/lotes/{id}` | Actualizar lote |
| DELETE | `/lotes/{id}` | Eliminar lote |
| GET | `/lotes/{id}/items` | Items de un lote |
| POST | `/lot-items` | Agregar item a lote |
| PATCH | `/lot-items/{id}` | Actualizar item |
| DELETE | `/lot-items/{id}` | Eliminar item |
| POST | `/assignments` | Crear asignación |
| GET | `/assignments/{id}` | Obtener asignación |
| PATCH | `/assignments/{id}` | Actualizar asignación |
| DELETE | `/assignments/{id}` | Eliminar asignación |

¡Listo! Con esta guía deberías poder conectar tu frontend con el backend sin problemas. 🎉
