

const carritoAbrir = document.getElementById("boton-carrito");
const carritoCerrar = document.getElementById("carritoCerrar");
const contenedorModal = document.getElementsByClassName("modal-contenedor")[0];
const modalCarrito = document.getElementsByClassName("modal-carrito")[0];
const carritoVaciar = document.getElementById("carritoVaciar");
const carritoComprar = document.querySelector("carritoComprar");

carritoAbrir.addEventListener("click", ()=> {
    contenedorModal.classList.toggle("modal-active")
});
carritoCerrar.addEventListener("click", ()=> {
    contenedorModal.classList.toggle("modal-active")
});
contenedorModal.addEventListener("click", ()=>{
    carritoCerrar.click()
});
modalCarrito.addEventListener("click", (e)=>{
    e.stopPropagation()
});


carritoVaciar.addEventListener("click", ()=>{
    if(Object.keys(carritoDeCompras).length === 0){
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          })
          Toast.fire({
            icon: "warning",
            title: "Aún no tienes productos en el carrito"
          })
    }else{
        Swal.fire({
            title: "¿Estás seguro que deseas vaciar el carrito?",
            text: "(Te lo advertimos... Si decides continuar harás llorar a Homero)",
            background: "rgb(180, 226, 174)",
            imageUrl: "./img/otros/HomeroTriste.JPG",
            imageWidth: 300,
            imageHeight: 300,
            imageAlt: "imagen de Homero triste",
            showCancelButton: true,
            cancelButtonText: "No, mejor no!",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Si, lo siento!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Productos eliminados",
                    background: "rgb(180, 226, 174)",
                    imageUrl: "./img/otros/HomeroLlorando.gif",
                    imageWidth: 250,
                    imageHeight: 250,
                    imageAlt: "gif Homero llorando",
                    text: "(Hiciste llorar a Homero)",
                    confirmButtonColor: "green",
                    confirmButtonText: "Adiós!"
                })
            carritoDeCompras.length = 0
            contenedorCarrito.innerHTML = ""
            actualizarCarrito();
            localStorage.removeItem("carrito");
            carritoCerrar.click();
            }
        })
    }
});