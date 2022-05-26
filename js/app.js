

// Variables globales:

const contenedorProductos = document.querySelector("#contenedor-productos");
const contenedorCarrito = document.querySelector("#carrito-contenedor");
const contadorCarrito = document.querySelector("#contadorCarrito");
const precioTotal = document.querySelector("#precioTotal");
const selectProductos = document.querySelector("#selectProductos");
const search = document.querySelector("#search");

let carritoDeCompras = [];

let stockGlobal = []; //Esta es la variable global del Fetch

const stockFetch = async () => {
    try {
        const res = await fetch ("./js/stock.json")
        const stock = await res.json()
        stock.forEach(e => {
            stockGlobal.push(e);
        })
    } catch (error) {
        console.log(error);
    }
}
stockFetch();


// flitro
let botoncitoFiltro = document.querySelector("#botoncito");

function mostrarProductosFiltro(array){
    contenedorProductos.innerHTML = "";
    array.forEach(elemento => {
        let div = document.createElement("div");
        div.classList.add("producto","col");
        div.innerHTML += `
        <div class="card" style="width: 42rem;">
            <img src=${elemento.img} class="card-img-top" alt="${elemento.tipo} ${elemento.nombre}">
            <div class="card-body">
                <h5 class="card-title">${elemento.nombre}</h5>
                <p class="card-text">${elemento.info}</p>
                <p>Precio: $${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(elemento.precio)}.-</p>
                <a id="agregar${elemento.id}" class="btn btn-success">Agregar al carrito <i><img src="./img/iconos/agregarB.png" alt="ícono de Agregar Carrito"></i></a>
            </div>
        </div>
        `;
        contenedorProductos.appendChild(div);
        let btnAgregarA = document.getElementById(`agregar${elemento.id}`);
        btnAgregarA.addEventListener("click",() => {
            agregarAlCarrito(elemento.id);
        });
    });
};


const filtro = () => {
    if(botoncitoFiltro){
        botoncitoFiltro.addEventListener("click",() => {
            if(selectProductos.value === "all"){
                mostrarProductosFiltro(stockGlobal);
            } else{
                mostrarProductosFiltro(stockGlobal.filter(elemento => elemento.tipo === selectProductos.value));
            }
        })
    }
}
filtro();


// buscador
const buscador = () => {
    if(search){
        search.addEventListener("keyup",()=>{
            contenedorProductos.innerHTML = "";  
            let texto = search.value.toLowerCase();
            
            fetch("./js/stock.json")
            .then((response) => response.json())
            .then((stock) => {
                stock.forEach(({id,nombre,tipo,info,precio,img}) => {
                    let name = nombre.toLowerCase();
                    if(name.indexOf(texto) !== -1){
                        let div = document.createElement("div");
                        div.classList.add("producto","col");
                        div.innerHTML += `
                        <div class="card" style="width: 42rem;">
                            <img src=${img} class="card-img-top" alt="${tipo} ${nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${nombre}</h5>
                                <p class="card-text">${info}</p>
                                <p>Precio: $${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(precio)}.-</p>
                                <a id="agregar${id}" class="btn btn-success btnAgregar">Agregar al carrito <i><img src="./img/iconos/agregarB.png" alt="ícono de Agregar Carrito"></i></a>
                            </div>
                        </div>
                        `;
                        contenedorProductos.appendChild(div);
                        let botonAgregar = document.getElementById(`agregar${id}`);
                        botonAgregar.addEventListener("click",() => {
                            agregarAlCarrito(id);
                        })
                    }
                })
                contenedorProductos.innerHTML === "" && (contenedorProductos.innerHTML += `<h3>Lo sentimos. Ese producto no lo tenemos a la venta...</h3>`);
            })
        })
    }
};
buscador();


// Ecommerce:

function mostrarProductos () {
    if(contenedorProductos){
        contenedorProductos.innerHTML = "";
        fetch("./js/stock.json")
        .then((response) => response.json())
        .then((stock) => {
            stock.forEach(({id,nombre,tipo,info,precio,img}) => {
                let div = document.createElement("div");
                div.classList.add("producto","col");
                div.innerHTML += `
                <div class="card" style="width: 42rem;">
                    <img src=${img} class="card-img-top" alt="${tipo} ${nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${nombre}</h5>
                        <p class="card-text">${info}</p>
                        <p>Precio: $${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(precio)}.-</p>
                        <a id="agregar${id}" class="btn btn-success btnAgregar">Agregar al carrito <i><img src="./img/iconos/agregarB.png" alt="ícono de Agregar Carrito"></i></a>
                    </div>
                </div>
                `;
                contenedorProductos.appendChild(div);
                let btnAgregar = document.getElementById(`agregar${id}`);
                btnAgregar.addEventListener("click",() => {
                    agregarAlCarrito(id);
                })
            })
        })
    }
};

function agregarAlCarrito(id){
    let agregado = carritoDeCompras.find(elemento => elemento.id == id);
    if(agregado){
        agregado.cantidad ++;
        document.getElementById(`und${agregado.id}`).innerHTML =` <td id=und${agregado.id}>${agregado.cantidad}</td>`
        actualizarCarrito();
        alertHomero();
    }else{
        let productoAgregar = stockGlobal.find(elemento => elemento.id == id)
        productoAgregar.cantidad = 1
        carritoDeCompras.push(productoAgregar)
        actualizarCarrito();
        mostrarCarrito(productoAgregar);
        alertHomero();
    }
    localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
};

function mostrarCarrito(productoAgregar){
    let tr = document.createElement("tr");
    tr.classList.add("productoEnCarrito");
    tr.innerHTML = `
        <td class="productoTabla">${productoAgregar.nombre}</td>
        <td>$${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(productoAgregar.precio)}.-</td>
        <td id="und${productoAgregar.id}">${productoAgregar.cantidad}</td>
        <td><button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i><img src="./img/iconos/basura.png" alt="ícono de Basura"></i></button></td>
    `;
    if(contenedorCarrito){
        contenedorCarrito.appendChild(tr);
        let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`);
        btnEliminar.addEventListener("click",() => {
            if(productoAgregar.cantidad == 1){
                btnEliminar.parentElement.parentElement.remove();
                carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id);
                actualizarCarrito();
                localStorage.setItem("carrito", JSON.stringify(carritoDeCompras));
            }else{
                productoAgregar.cantidad --;
                document.getElementById(`und${productoAgregar.id}`).innerHTML =` <td id=und${productoAgregar.id}>${productoAgregar.cantidad}</td>`;
                actualizarCarrito();
                localStorage.setItem('carrito', JSON.stringify(carritoDeCompras));
            }
            toastHomero();
        });
    };
};

function actualizarCarrito(){
    if(contadorCarrito){
        contadorCarrito.innerText = carritoDeCompras.reduce((acumulador,elemento) => acumulador + elemento.cantidad, 0)
        precioTotal.innerText = Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(carritoDeCompras.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad), 0)) + ".-";
    }
};

function recuperar(){
    let recuperarLocalStorage = JSON.parse(localStorage.getItem("carrito"));

    if(recuperarLocalStorage){
        recuperarLocalStorage.forEach(elemento => {
            mostrarCarrito(elemento);
            carritoDeCompras.push(elemento);
            actualizarCarrito();
        });
    };
};


//!Librerías utilizadas!!!
function alertHomero(){
    Swal.fire({
        position: "top-end",
        title: "El producto fue añadido al carrito",
        width: "24rem",
        background: "rgb(180, 226, 174)",
        imageUrl: "./img/otros/homero-carrito-sf.png",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "imagen de Homero con vestido",
        showCancelButton: true,
        cancelButtonColor: "green",
        cancelButtonText: "Seguir comprando",
        confirmButtonColor: "green",
        timerProgressBar: true,
        timer: 4000,
        confirmButtonText: "Ir al carrito",
    }).then((result) => {
        if (result.isConfirmed){
            contenedorModal.classList.toggle("modal-active")
        }
    });
};
function toastHomero(){
    Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: "rgb(180, 226, 174)",
        didOpen: (toast) => {
           toast.addEventListener('mouseenter', Swal.stopTimer)
           toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });
    Toast.fire({
        title: "Producto eliminado",
        imageUrl: "./img/otros/homero-doh.png",
        imageAlt: "imagen de Homero d'oh",
        imageWidth: 150,
        imageHeight: 200,
    });
};


// Acá finalmente llamamos a las funciones!!!
mostrarProductos(stockGlobal);
recuperar();
