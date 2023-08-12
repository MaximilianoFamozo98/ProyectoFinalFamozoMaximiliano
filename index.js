

function productos() {
    fetch(`https://apimocha.com/bebidas/elpajaro`)
        .then(resultado => resultado.json())
        .then(data => {
            const productosprox = data;
            productosprox.forEach(producto => {
                const cardHTML = `
                    <div class="card imagen" style="width: 18rem;">
                        <img src="${producto.imagen}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text text-center">${producto.descripcion}</p>
                            <p class="card-text">${producto.precio} $</p>
                            <button class="btn btn-primary agregar-carrito" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Agregar al carrito</button>
                        </div>
                    </div>
                `;
                document.querySelector(".divdisplay").innerHTML += cardHTML;
            });

            const botonesAgregar = document.querySelectorAll('.agregar-carrito');
            botonesAgregar.forEach(boton => {
                boton.addEventListener('click', agregarAlCarrito);

            });

        });

}

const carrito = [];

function agregarAlCarrito(event) {
    const id = event.target.getAttribute('data-id');
    const nombre = event.target.getAttribute('data-nombre');
    const precio = parseFloat(event.target.getAttribute('data-precio'));
    Swal.fire({
        title: '¡Producto agregado al carrito!',
        text: 'Click en aceptar para seguir comprando!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    })

    const productoEnCarrito = carrito.find(item => item.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
}

function actualizarCarrito() {
    const carritoContainer = document.querySelector('.carrito-container');
    carritoContainer.innerHTML = '';

    carrito.forEach(item => {
        carritoContainer.innerHTML += `
            <div class="carrito-item">
                <span>${item.nombre}</span>
                <button class="btn btn-sm btn-info" onclick="restarProducto('${item.id}')">-</button>
                <span>Cantidad: ${item.cantidad}</span>
                <button class="btn btn-sm btn-info" onclick="sumarProducto('${item.id}')">+</button>
                <span>Precio: ${item.precio * item.cantidad} $</span>
            </div>
        `;
    });

    carritoContainer.innerHTML += `
        <button class="btn btn-danger" onclick="vaciarCarrito()">Vaciar Carrito</button>
        <button class="btn btn-success" onclick="finalizarCompra()">Finalizar Compra</button>
    `;
}

function sumarProducto(id) {
    const productoEnCarrito = carrito.find(item => item.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
        actualizarCarrito();
    }
}

function restarProducto(id) {
    const productoEnCarrito = carrito.find(item => item.id === id);
    if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad -= 1;
        actualizarCarrito();
    }
}

function vaciarCarrito() {
    carrito.length = 0;
    actualizarCarrito();
}

function finalizarCompra() {
    Swal.fire({
        title: '¡Compra finalizada!',
        text: 'Gracias por tu compra.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    })
    vaciarCarrito();
}

productos();