let productos = [];

// 1. Cargar los datos desde el archivo JSON
async function cargarProductos() {
    try {
        const respuesta = await fetch('productos.json');
        productos = await respuesta.json();
        mostrarProductos(productos); // Muestra todos al iniciar
    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
    }
}

// 2. Función para dibujar las zapatillas en el HTML
function mostrarProductos(listaProductos) {
    const contenedor = document.getElementById('catalogo');
    contenedor.innerHTML = ''; // Limpiar contenedor

    if (listaProductos.length === 0) {
        contenedor.innerHTML = `<p class="sin-stock">No se encontraron modelos con esos filtros.</p>`;
        return;
    }

    listaProductos.forEach(prod => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta-zapato');
        
        // --- PROCESAR LAS EQUIVALENCIAS DE TALLAS (EUR / CM / US) ---
        const listaTallasConvertidas = prod.tallas.map(tallaEur => {
            let cm = "";
            let us = "";

            // Tabla de conversión para calzado de básquet / urbano
            if (tallaEur === 37.5) { cm = "23.5 cm"; us = "5Y / 6.5W"; }
            else if (tallaEur === 38.5) { cm = "24 cm"; us = "6 US"; }
            else if (tallaEur === 39) { cm = "24.5 cm"; us = "6.5 US"; }
            else if (tallaEur === 40) { cm = "25 cm"; us = "7 US"; }
            else if (tallaEur === 40.5) { cm = "25.5 cm"; us = "7.5 US"; }
            else if (tallaEur === 41) { cm = "26 cm"; us = "8 US"; }
            else if (tallaEur === 42) { cm = "26.5 cm"; us = "8.5 US"; }
            else if (tallaEur === 42.5) { cm = "27 cm"; us = "9 US"; }
            else if (tallaEur === 43) { cm = "27.5 cm"; us = "9.5 US"; }
            else if (tallaEur === 44) { cm = "28 cm"; us = "10 US"; }
            else if (tallaEur === 44.5) { cm = "28.5 cm"; us = "10.5 US"; }
            else if (tallaEur === 45) { cm = "29 cm"; us = "11 US"; }
            else { cm = "-- cm"; us = "-- US"; } // Por si pones una talla que no esté en la lista

            return `${tallaEur} EUR / ${cm} / ${us}`;
        }).join('<br>'); // Separa con un salto de línea si la zapatilla tiene varias tallas

        tarjeta.innerHTML = `
            ${prod.nuevo ? '<span class="etiqueta-nuevo">Nuevo Ingreso 🔥</span>' : ''}
            <img src="${prod.imagen}" alt="${prod.modelo}" style="cursor:pointer;" onclick="document.getElementById('imgGrande').src='${prod.imagen}'; document.getElementById('miLightbox').style.display='flex';">
            <div class="info-zapato">
                <span class="marca">${prod.marca}</span>
                <h2>${prod.modelo}</h2>
                <p class="tallas" style="line-height: 1.4;"><b>Tallas disponibles:</b><br>${listaTallasConvertidas}</p>
                <p class="estado"><b>Estado:</b> ${prod.estado || 'No especificado'}</p>
                <p class="precio">S/. ${prod.precio.toFixed(2)}</p>
                <a href="https://wa.me/51913716006?text=Hola,%20estoy%20interesado%20en%20el%20modelo%20${encodeURIComponent(prod.modelo)}%20en%20código%20${prod.id}" 
                   target="_blank" class="btn-whatsapp">
                   Consultar por WhatsApp
                </a>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// 3. Lógica de los Filtros combinados
function filtrarCatalogo() {
    const busqueda = document.getElementById('buscar').value.toLowerCase();
    const marcaSeleccionada = document.getElementById('filtro-marca').value;
    const tallaSeleccionada = document.getElementById('filtro-talla').value;

    const productosFiltrados = productos.filter(prod => {
        const cumpleBusqueda = prod.modelo.toLowerCase().includes(busqueda);
        const cumpleMarca = marcaSeleccionada === 'todos' || prod.marca === marcaSeleccionada;
        const cumpleTalla = tallaSeleccionada === 'todos' || prod.tallas.includes(parseFloat(tallaSeleccionada));

        return cumpleBusqueda && cumpleMarca && cumpleTalla;
    });

    mostrarProductos(productosFiltrados);
}

// Escuchar los eventos del usuario para filtrar al instante
document.getElementById('buscar').addEventListener('input', filtrarCatalogo);
document.getElementById('filtro-marca').addEventListener('change', filtrarCatalogo);
document.getElementById('filtro-talla').addEventListener('change', filtrarCatalogo);

// Inicializar la app
cargarProductos();