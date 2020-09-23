// Clase que representa un evento
class Categoria {

    constructor(nombre, productos) {
        this.nombre = nombre;
        this.productos = productos;
    }
    /**
     * Retorna el ID del evento
     */
    get darNombre() {
        return this.nombre;
    }
    /**
     * Retorna el nombre del evento
     */
    get darProductos() {
        return this.productos;
    }
}

var categorias = [];
var productos_carrito = [];
var categoria_seleccionada_actualmente;


function lecturaEventosHTTP(url_inventario) {

    new Promise(function (resolve, reject) {

        let req_inventario = new XMLHttpRequest();
        req_inventario.open("GET", url_inventario);

        req_inventario.onload = function () {
            if (req_inventario.status == 200) {

                var categorias = JSON.parse(req_inventario.response);

                // Se realiza la lectura de las transacciones encontradas en la lectura por HTTP
                for (var categoria in categorias) {
                    var categoria_actual = categorias[categoria];
                    var nombre_categoria_actual = categoria_actual["name"];
                    var productos_categoria_actual = categoria_actual["products"];

                    // Se crean los elementos por DOM
                    const categoria_nueva = document.createElement("button");
                    categoria_nueva.className = "btn";
                    categoria_nueva.textContent = nombre_categoria_actual;

                    var nueva = new Categoria(nombre_categoria_actual, productos_categoria_actual);
                    categorias.push(nueva);

                    categoria_nueva.addEventListener("click", function () { ocultarCartas(); cargarCartas(categoria_nueva.textContent) })


                    const contenido_nav = document.querySelector(".nav");

                    contenido_nav.appendChild(categoria_nueva);


                    function ocultarCartas() {
                        var div_actual = document.getElementsByClassName("card");
                        if (div_actual.length != 0) {
                            for (card in div_actual) {
                                div_actual[card].hidden = true;
                            }
                        }
                    }

                    function cargarCartas(nombre_categoria_deseada) {

                        var tipo = document.getElementById("texto_tipo_actual");
                        tipo.textContent = nombre_categoria_deseada + "";

                        // Se recorren los eventos de la transaccion actual, y se verifica si este existe en el arreglo de eventos.
                        // Se calcula el FN y el TP, dependiendo si hay squirrel o no.
                        var productos_actuales = categorias.find(element => element.nombre == nombre_categoria_deseada).darProductos;

                        for (var i = 0; i < productos_actuales.length; i++) {

                            var nombre_producto_actual = productos_actuales[i]["name"];
                            var descripcion_producto_actual = productos_actuales[i]["description"];
                            var precio_producto_actual = productos_actuales[i]["price"];
                            var imagen_producto_actual = productos_actuales[i]["image"];

                            // Se crean los elementos por DOM
                            const carta_nueva = document.createElement("div");
                            carta_nueva.className = "card";

                            var imagen_carta = document.createElement("img");
                            imagen_carta.className = "card-img-top";
                            imagen_carta.src = imagen_producto_actual;

                            var contenido_carta = document.createElement("div");
                            contenido_carta.className = "card-body";

                            var nombre_carta = document.createElement("h5");
                            nombre_carta.className = "card-title";
                            nombre_carta.textContent = nombre_producto_actual;

                            var descripcion_carta = document.createElement("p");
                            descripcion_carta.className = "card-text";
                            descripcion_carta.textContent = descripcion_producto_actual;

                            var precio_carta = document.createElement("p");
                            precio_carta.className = "price";
                            precio_carta.textContent = "$" + precio_producto_actual;

                            var boton_carta = document.createElement("a");
                            boton_carta.className = "btn btn-primary";
                            boton_carta.textContent = "Add to car";

                            boton_carta.addEventListener("click", function () { aumentarCarrito() })

                            contenido_carta.appendChild(nombre_carta);
                            contenido_carta.appendChild(descripcion_carta);
                            contenido_carta.appendChild(precio_carta);
                            contenido_carta.appendChild(boton_carta);

                            carta_nueva.appendChild(imagen_carta);
                            carta_nueva.appendChild(contenido_carta);

                            const contenido_detalle_comidas = document.querySelector(".detalle_comidas");
                            contenido_detalle_comidas.appendChild(carta_nueva);

                        }
                    }

                    function aumentarCarrito() {

                    }

                    categoria_seleccionada_actualmente = categoria_nueva.textContent;;
                }
                resolve(req_inventario.response);
            }
            else {
                reject(Error(req_inventario.statusText));
            }
        };
        req_inventario.send();
    });
}

/**
 * Se llama el metodo que realiza la lectura y creacion de tablas con la url del ejercicio.
 */
lecturaEventosHTTP("https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json");