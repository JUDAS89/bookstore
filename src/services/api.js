export async function getLibros() {
    const response = await fetch('/libros.json');
    if (!response.ok) {
      throw new Error('Error al obtener los libros');
    }
    return response.json();
  }
  
  // Agregar otras funciones para las solicitudes a la API según sea necesario
  