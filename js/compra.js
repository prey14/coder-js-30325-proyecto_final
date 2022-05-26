

// Detalle de la Compra:

const detalleCompra = document.querySelector("#detalleCompra");

let ls = JSON.parse(localStorage.getItem("carrito"));
let subTotalApagar = 0;
let precioEnvio = 0;

function detalleFinal(){
    if(ls == 0 || ls == null || ls == undefined){

        document.querySelector(".btnPaso1Compra").disabled = true;
        document.querySelector(".btnPaso2Compra").disabled = true;
        document.querySelector(".btnPaso3Compra").disabled = true;
        document.querySelector(".btnPaso4Compra").disabled = true;
        document.querySelector(".progress1").style.display="none";
        document.querySelector(".progress2").style.display="none";
        document.querySelector(".progress3").style.display="none";
        document.querySelector(".progress4").style.display="none";
        document.querySelector("#noHayProductos").innerText = `No seleccionaste ningún producto`;
    }else{
        ls.forEach(({nombre,precio,cantidad}) => {
            let tr = document.createElement("tr");
            tr.classList.add("productoEnCarrito");
            if(detalleCompra){
                detalleCompra.innerHTML += `
                    <td class="productoTabla"> ${nombre} </td>
                    <td> $${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(precio)} </td>
                    <td> ${cantidad} </td>
                    <td> $${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(precio * cantidad)} </td>
                `;
            };
        });
        subTotalApagar = (Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(ls.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad), 0)));
        document.querySelector("#subTotalApagar").innerText = `$${subTotalApagar}`;
        document.querySelector(".btnPaso2Compra").disabled = true;
        document.querySelector(".btnPaso3Compra").disabled = true;
        document.querySelector(".btnPaso4Compra").disabled = true;
        document.querySelector(".progress2").style.display="none";
        document.querySelector(".progress3").style.display="none";
        document.querySelector(".progress4").style.display="none";
    }
}
detalleFinal();


//TODO:-------------------------------------------------->


//! PASO Nro 1:

const envios = [{input: "Retiro en el local (Sin costo)", valor: 0, id: "flexRadioDefault1"}, {input: "Envío por Correo Argentino", valor: 500, id: "flexRadioDefault2"}, {input: "Envío por Mensajería Privada", valor: 1000, id: "flexRadioDefault3"}];
     
const grupoEnvios = document.querySelector("#grupoEnvios");

grupoEnvios.innerHTML = envios.map((elemento) => `
<div>
<input type="radio" name="envio" value="${elemento.valor}" id="${elemento.id}"> <label for="${elemento.id}">${elemento.input}</label>
</div>
`).join(" ");


const btnsRadio = document.querySelectorAll('input[name="envio"]');
for(const btnRadio of btnsRadio){
    btnRadio.addEventListener("change", mostrarEnvio);
};

function mostrarEnvio(){
    if (this.checked) {
        document.querySelector("#precioEnvio").innerText = `La forma de envío seleccionada tiene un costo de: $${this.value}.-`;

        precioEnvio = parseInt(this.value);

        document.querySelector(".btnPaso2Compra").disabled = false;
        document.querySelector(".btnPaso3Compra").disabled = true;
        document.querySelector(".btnPaso4Compra").disabled = true;
        document.querySelector(".progress1").style.display="none";
        document.querySelector(".progress2").style="width: 50%";
        document.querySelector(".progress3").style.display="none";
        document.querySelector(".progress4").style.display="none";
    }
};


//?-------------------------------------------------->


//! PASO Nro 2:

const validacionCodigo = document.querySelector("#validacionCodigo");
let valorDescuento = 0;

function codigoDescuento(){
    document.querySelector("#confirmarDescuento").addEventListener("click", ()=>{
        if(validacionCodigo.value == "MagiaPotagia"){
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
                title: "¡¡FELICITACIONES!!",
                imageUrl: "./img/otros/HomeroFeliz.png",
                imageAlt: "imagen de Homero feliz",
                imageWidth: 200,
                imageHeight: 200,
            });

            let valorDescuento = (ls.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad), 0) * 0.20);
            document.querySelector("#descuentoValor").innerText = `¡¡FELICITACIONES!! Obtuviste un descuento del 20% sobre el subtotal de tu compra: $${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format(valorDescuento)}.-`;
            document.querySelector(".btnPaso3Compra").disabled = false;
            document.querySelector(".btnPaso4Compra").disabled = true;
            validacionCodigo.disabled = true;
            document.querySelector("#collapseExample1").disabled = true;
            document.querySelector("#confirmarDescuento").disabled = true;
            document.querySelector("#noConfirmarDescuento").disabled = true;
            document.querySelector(".progress1").style.display="none";
            document.querySelector(".progress2").style.display="none";
            document.querySelector(".progress3").style="width: 75%";
            document.querySelector(".progress4").style.display="none";
            document.querySelector("#flexRadioDefault1").disabled = true;
            document.querySelector("#flexRadioDefault2").disabled = true;
            document.querySelector("#flexRadioDefault3").disabled = true;
    
            subTotalApagar = (ls.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad), 0));
            
            document.querySelector("#saldoFinalApagar").innerText = "$" + Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format((subTotalApagar - valorDescuento + precioEnvio)) + ".-";
        } else{
            Toast = Swal.mixin({
                toast: true,
                position: "top",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true
            })
                Toast.fire({
                icon: "warning",
                title: "Selecciona un descuento válido"
            })
        }
    })
    document.querySelector("#noConfirmarDescuento").addEventListener("click",()=>{
        Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        })
            Toast.fire({
            icon: "warning",
            title: "Lo sentimos, no accediste a ningún descuento"
        })
        document.querySelector(".btnPaso3Compra").disabled = false;
        document.querySelector(".btnPaso4Compra").disabled = true;
        validacionCodigo.disabled = true;
        document.querySelector("#confirmarDescuento").disabled = true;
        document.querySelector("#noConfirmarDescuento").disabled = true;
        document.querySelector(".progress1").style.display="none";
        document.querySelector(".progress2").style.display="none";
        document.querySelector(".progress3").style="width: 75%";
        document.querySelector(".progress4").style.display="none";

        let subTotalApagar = (ls.reduce((acumulador,elemento) => acumulador + (elemento.precio * elemento.cantidad), 0));
        document.querySelector("#saldoFinalApagar").innerText = `$${Intl.NumberFormat({ style: 'currency', currency: 'ARS' }).format((subTotalApagar + precioEnvio))}.-`;

        document.querySelector("#flexRadioDefault1").disabled = true;
        document.querySelector("#flexRadioDefault2").disabled = true;
        document.querySelector("#flexRadioDefault3").disabled = true;
        
    })
};
codigoDescuento();


//?-------------------------------------------------->


//! PASO Nro 3:

let btnRegistrarse = document.querySelector("#btnRegistrarse");
let btnYaTengoUsuario = document.querySelector("#btnYaTengoUsuario");

let registrarse = document.querySelector("#registrarse");
let yaTengoUsuario = document.querySelector("#yaTengoUsuario");
let terminosYcondiciones1 = document.querySelector("#terminosYcondiciones1");
let terminosYcondiciones2 = document.querySelector("#terminosYcondiciones2");

const arrayPersonas = [];

function mostrarRegistrarse(input){
    if(input.value == "Registrarse") {
        registrarse.style.display="block";
        input.value="Volver";
        btnYaTengoUsuario.disabled = true;
    } else {
        registrarse.style.display="none";
        input.value="Registrarse";
        btnYaTengoUsuario.disabled = false;
    }
};

function mostrarYaTengoUsuario(input){
    if(input.value == "Ya tengo Usuario") {
        yaTengoUsuario.style.display="block";
        input.value="Volver";
        btnRegistrarse.disabled = true;
    } else {
        yaTengoUsuario.style.display="none";
        input.value="Ya tengo Usuario";
        btnRegistrarse.disabled = false;
    }
};

document.querySelector("#registrarse").addEventListener("submit", nuevoUsuario);
function nuevoUsuario (val){
    val.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const apellido = document.querySelector("#apellido").value;
    const dni = document.querySelector("#dni").value;
    const correo = document.querySelector("#correo").value;
    const domicilio = document.querySelector("#domicilio").value;
    const cp = document.querySelector("#cp").value;
            
    const persona = {nombre,apellido,dni,correo,domicilio,cp};

    arrayPersonas.push(persona);
    localStorage.setItem("arrayPersonas", JSON.stringify(arrayPersonas));

    btnRegistrarse.disabled = true;
    document.querySelector("#nUsuario").disabled = true;
    terminosYcondiciones1.style.display="block";
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: 'success',
        title: 'Usuario registrado con Éxito!'
    })
};

function buscarUsuario(val){
    val.preventDefault();
    
    const dniBuscar = document.querySelector("#dniBuscar").value;
    const arrayParaBuscar = JSON.parse(localStorage.getItem("arrayPersonas"));
    const resultadoBuscar = arrayParaBuscar.find(person => person.dni == dniBuscar);

    let textoPersonaEncontrada;
    if (resultadoBuscar != undefined || resultadoBuscar != null){
        textoPersonaEncontrada = `
            <h2>${resultadoBuscar.nombre} ${resultadoBuscar.apellido}</h2>
        `;
        terminosYcondiciones2.style.display="block";
    }else{
        textoPersonaEncontrada = "El usuario ingresado no existe. Por favor regístrese para continuar";
    }
    document.querySelector("#personaEncontrada").innerHTML = textoPersonaEncontrada;
}
document.querySelector("#btnBuscarUsuario").addEventListener("click", buscarUsuario);

/*
Este botón lo dejé por si quisiera borrar más facilmente los usuarios del localStorage
* document.querySelector("#borrarPersonas").addEventListener("click", ()=>{
*     localStorage.removeItem("arrayPersonas");
* });
*/

document.querySelector("#terminosYcondiciones1").addEventListener("click", async ()=>{
    const { value: accept } = await Swal.fire({
        title: 'Estás por finalizar la compra',
        input: 'checkbox',
        inputValue: 1,
        inputPlaceholder:
            'Para eso necesitamos que aceptes las condiciones legales',
        confirmButtonText:
            'Continue <i class="fa fa-arrow-right"></i>',
        inputValidator: (result) => {
          return !result && 'Debes aceptar los términos y condiciones para poder continuar con el pago'
        }
    })
    if (accept) {
        Swal.fire('¡Muchas gracias!')
    }
    btnYaTengoUsuario.disabled = true;
    document.querySelector("#terminosYcondiciones1").disabled = true;
    document.querySelector(".btnPaso4Compra").disabled = false;
    btnBuscarUsuario.disabled = true;
    document.querySelector(".progress1").style.display="none";
    document.querySelector(".progress2").style.display="none";
    document.querySelector(".progress3").style.display="none";
    document.querySelector(".progress4").style="width: 100%";
})

document.querySelector("#terminosYcondiciones2").addEventListener("click", async ()=>{
    const { value: accept } = await Swal.fire({
        title: 'Estás por finalizar la compra',
        input: 'checkbox',
        inputValue: 1,
        inputPlaceholder:
            'Para eso necesitamos que aceptes las condiciones legales',
        confirmButtonText:
            'Continue <i class="fa fa-arrow-right"></i>',
        inputValidator: (result) => {
          return !result && 'Debes aceptar los términos y condiciones para poder continuar con el pago'
        }
    })
    if (accept) {
        Swal.fire('¡Muchas gracias!')
    }
    btnYaTengoUsuario.disabled = true;
    document.querySelector("#terminosYcondiciones2").disabled = true;
    document.querySelector(".btnPaso4Compra").disabled = false;
    btnBuscarUsuario.disabled = true;
    document.querySelector(".progress1").style.display="none";
    document.querySelector(".progress2").style.display="none";
    document.querySelector(".progress3").style.display="none";
    document.querySelector(".progress4").style="width: 100%";
})


//?-------------------------------------------------->


//! PASO Nro 4:

let pagoTransferencia = document.getElementById("pagoTransferencia")
let pagoTarjeta = document.getElementById("pagoTarjeta")

const btnTransferencia = document.querySelector("#btnTransferencia")
const btnTarjeta = document.querySelector("#btnTarjeta")

const botonesPago = document.querySelector(".botonesPago");

function mostrarTransferencia(input){
    if(input.value == "Depósito o Transferencia") {
        pagoTransferencia.style.display="block";
        input.value="Volver";
        btnTarjeta.disabled = true;
    } else {
        pagoTransferencia.style.display="none";
        input.value="Depósito o Transferencia";
        btnTarjeta.disabled = false;
    }
}

function mostrarTarjeta(input){
    if(input.value == "Tarjeta de crédito") {
        pagoTarjeta.style.display="block";
        input.value="Volver";
        btnTransferencia.disabled = true;
    } else {
        pagoTarjeta.style.display="none";
        input.value="Tarjeta de crédito";
        btnTransferencia.disabled = false;
    }
}

//* Forma de pago: Depósito o transferencia:

const yaPague = document.querySelector(".yaPague");
const muchasGracias = document.querySelector(".muchasGracias");
muchasGracias.disabled = true;

yaPague.addEventListener("click", async ()=>{
    const { value: file } = await Swal.fire({
        title: 'Envíe la imagen de su comprobante, por favor',
        input: 'file',
        inputAttributes: {
            'accept': 'image/*',
            'aria-label': 'imagen del comprobante'
        }
    })
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            Swal.fire({
                title: 'Su operación está siendo procesada. En las próximas 24hs usted recibirá un correo con la confirmación de la transacción. Muchas gracias!',
                imageUrl: "./img/otros/homeroNerd.png",
                imageWidth: 350,
                imageHeight: 200,
                imageAlt: 'imagen de homero nerd',
                
            })
            btnTransferencia.disabled = true;
            yaPague.disabled = true;
            muchasGracias.disabled = false;
            muchasGracias.addEventListener("click", ()=>{
                carritoDeCompras.length = 0;
                localStorage.removeItem("carrito");
                window.location.href = "./index.html";
            })
        }
        reader.readAsDataURL(file)
    }
})

//* Forma de pago: Tarjeta de crédito:

const yaPague2 = document.querySelector(".yaPague2");
const muchasGracias2 = document.querySelector(".muchasGracias2");
muchasGracias2.disabled = true;

yaPague2.addEventListener("click", (val)=>{

    val.preventDefault();

    Swal.fire({
        title: 'Su operación está siendo procesada. En las próximas 24hs usted recibirá un correo con la confirmación de la transacción. Muchas gracias!',
        imageUrl: "./img/otros/homeroNerd.png",
        imageWidth: 350,
        imageHeight: 200,
        imageAlt: 'imagen de homero nerd'
    })
    muchasGracias2.disabled = false;
    btnTarjeta.disabled = true;
    yaPague2.disabled = true;
    muchasGracias2.addEventListener("click", ()=>{
        carritoDeCompras.length = 0;
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
    })
})

const tarjeta = document.querySelector('#tarjeta'),
	  btnAbrirFormulario = document.querySelector('#btn-abrir-formulario'),
	  formulario = document.querySelector('#formulario-tarjeta'),
	  numeroTarjeta = document.querySelector('#tarjeta .numero'),
	  nombreTarjeta = document.querySelector('#tarjeta .nombre'),
	  logoMarca = document.querySelector('#logo-marca'),
	  firma = document.querySelector('#tarjeta .firma p'),
	  mesExpiracion = document.querySelector('#tarjeta .mes'),
	  yearExpiracion = document.querySelector('#tarjeta .year');
	  ccv = document.querySelector('#tarjeta .ccv');

// * Volteamos la tarjeta para mostrar el frente.
const mostrarFrente = () => {
	if(tarjeta.classList.contains('active')){
		tarjeta.classList.remove('active');
	}
}

// * Rotacion de la tarjeta
tarjeta.addEventListener('click', () => {
	tarjeta.classList.toggle('active');
});

// * Boton de abrir formulario
btnAbrirFormulario.addEventListener('click', () => {
	btnAbrirFormulario.classList.toggle('active');
	formulario.classList.toggle('active');
});

// * Select del mes generado dinamicamente.
for(let i = 1; i <= 12; i++){
	let opcion = document.createElement('option');
	opcion.value = i;
	opcion.innerText = i;
	formulario.selectMes.appendChild(opcion);
}

// * Select del año generado dinamicamente.
const yearActual = new Date().getFullYear();
for(let i = yearActual; i <= yearActual + 8; i++){
	let opcion = document.createElement('option');
	opcion.value = i;
	opcion.innerText = i;
	formulario.selectYear.appendChild(opcion);
}

// * Input numero de tarjeta
formulario.inputNumero.addEventListener('keyup', (e) => {
	let valorInput = e.target.value;

	formulario.inputNumero.value = valorInput
	// Eliminamos espacios en blanco
	.replace(/\s/g, '')
	// Eliminar las letras
	.replace(/\D/g, '')
	// Ponemos espacio cada cuatro numeros
	.replace(/([0-9]{4})/g, '$1 ')
	// Elimina el ultimo espaciado
	.trim();

	numeroTarjeta.textContent = valorInput;

	if(valorInput == ''){
		numeroTarjeta.textContent = '#### #### #### ####';

		logoMarca.innerHTML = '';
	}

	if(valorInput[0] == 4){
		logoMarca.innerHTML = '';
		const imagen = document.createElement('img');
		imagen.src = 'img/otros/tarjeta/logo/visa.png';
		logoMarca.appendChild(imagen);
	} else if(valorInput[0] == 5){
		logoMarca.innerHTML = '';
		const imagen = document.createElement('img');
		imagen.src = 'img/otros/tarjeta/logo/mastercard.png';
		logoMarca.appendChild(imagen);
	}

	// Volteamos la tarjeta para que el usuario vea el frente.
	mostrarFrente();
});

// * Input nombre de tarjeta
formulario.inputNombre.addEventListener('keyup', (e) => {
	let valorInput = e.target.value;

	formulario.inputNombre.value = valorInput.replace(/[0-9]/g, '');
	nombreTarjeta.textContent = valorInput;
	firma.textContent = valorInput;

	if(valorInput == ''){
		nombreTarjeta.textContent = 'RIVER PLATE';
	}

	mostrarFrente();
});

// * Select mes
formulario.selectMes.addEventListener('change', (e) => {
	mesExpiracion.textContent = e.target.value;
	mostrarFrente();
});

// * Select Año
formulario.selectYear.addEventListener('change', (e) => {
	yearExpiracion.textContent = e.target.value.slice(2);
	mostrarFrente();
});

// * CCV
formulario.inputCCV.addEventListener('keyup', () => {
	if(!tarjeta.classList.contains('active')){
		tarjeta.classList.toggle('active');
	}

	formulario.inputCCV.value = formulario.inputCCV.value
	// Eliminar los espacios
	.replace(/\s/g, '')
	// Eliminar las letras
	.replace(/\D/g, '');

	ccv.textContent = formulario.inputCCV.value;
});