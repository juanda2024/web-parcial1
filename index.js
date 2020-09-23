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

class productos_ordenados {
    constructor(nombre, descripcion, precio_unidad) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio_unidad = precio_unidad;
        this.cantidad_unidades = 1;
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
    get darDescripcion() {
        return this.descripcion;
    }

    get darPrecioUnidad() {
        return this.precio_unidad;
    }

    get darCantidadUnidades() {
        return this.cantidad_unidades;
    }
    aumentarUnidades(cantidad) {
        this.cantidad_unidades = cantidad + 1;
    }
}

var categorias = [];
var productos_carrito = [];
var categoria_seleccionada_actualmente;
var total_dinero_cuenta = 0;


function lecturaEventosHTTP(url_inventario) {

    new Promise(function (resolve, reject) {

        let req_inventario = new XMLHttpRequest();
        req_inventario.open("GET", url_inventario);

        req_inventario.onload = function () {
            if (req_inventario.status == 200) {

                var categorias = JSON.parse(req_inventario.response);

                var carrito = document.getElementById("carrito");
                carrito.addEventListener("click", function () { ocultarCartas(); cargarCarrito() })

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


                    function cargarCarrito() {

                        document.getElementById("detalle_carrito").hidden = false;

                        var tipo = document.getElementById("texto_tipo_actual");
                        tipo.textContent = "Order detail";

                        const div_row = document.createElement("div");

                        const tabla = document.createElement("table");
                        tabla.className = "table table-striped";

                        const head_tabla = document.createElement("thead");
                        const tr_head_tabla = document.createElement("tr");


                        const item_th_tr_head_tabla = document.createElement("th");
                        item_th_tr_head_tabla.textContent = "item";
                        const qty_th_tr_head_tabla = document.createElement("th");
                        qty_th_tr_head_tabla.textContent = "Qty.";
                        const description_th_tr_head_tabla = document.createElement("th");
                        description_th_tr_head_tabla.textContent = "Description";
                        const Uprice_th_tr_head_tabla = document.createElement("th");
                        Uprice_th_tr_head_tabla.textContent = "Unit Price";
                        const amount_th_tr_head_tabla = document.createElement("th");
                        amount_th_tr_head_tabla.textContent = "Amount";

                        tr_head_tabla.appendChild(item_th_tr_head_tabla);
                        tr_head_tabla.appendChild(qty_th_tr_head_tabla);
                        tr_head_tabla.appendChild(description_th_tr_head_tabla);
                        tr_head_tabla.appendChild(Uprice_th_tr_head_tabla);
                        tr_head_tabla.appendChild(amount_th_tr_head_tabla);

                        head_tabla.appendChild(tr_head_tabla);

                        tabla.appendChild(head_tabla);

                        const body_tabla = document.createElement("tbody");

                        for (var i = 0; i < productos_carrito.length; i++) {

                            const fila_actual = document.createElement("tr");

                            const item_th_tr_body_tabla = document.createElement("th");
                            item_th_tr_body_tabla.textContent = (i + 1);

                            const qty_th_tr_body_tabla = document.createElement("td");
                            qty_th_tr_body_tabla.textContent = productos_carrito[i].darCantidadUnidades;

                            const descripcion_th_tr_body_tabla = document.createElement("td");
                            descripcion_th_tr_body_tabla.textContent = productos_carrito[i].darDescripcion;

                            const Uprice_th_tr_body_tabla = document.createElement("td");
                            Uprice_th_tr_body_tabla.textContent = productos_carrito[i].darPrecioUnidad;

                            const amount_th_tr_body_tabla = document.createElement("td");
                            total_dinero_cuenta = total_dinero_cuenta + parseFloat(productos_carrito[i].darCantidadUnidades * productos_carrito[i].darPrecioUnidad);
                            amount_th_tr_body_tabla.textContent = " " + parseFloat(productos_carrito[i].darCantidadUnidades * productos_carrito[i].darPrecioUnidad);

                            fila_actual.appendChild(item_th_tr_body_tabla);
                            fila_actual.appendChild(qty_th_tr_body_tabla);
                            fila_actual.appendChild(descripcion_th_tr_body_tabla);
                            fila_actual.appendChild(Uprice_th_tr_body_tabla);
                            fila_actual.appendChild(amount_th_tr_body_tabla);

                            body_tabla.appendChild(fila_actual);
                        }
                        tabla.appendChild(body_tabla);
                        div_row.appendChild(tabla);

                        document.getElementById("detalle_carrito").appendChild(div_row);

                        const row2 = document.createElement("div");
                        row2.className = "row";

                        const div_total = document.createElement("div");
                        div_total.className = "col-2 div_total";

                        const p_total = document.createElement("p");
                        p_total.className = "total_carrito";

                        p_total.textContent = "Total: " + "$" + total_dinero_cuenta;

                        const div_botones = document.createElement("div");
                        div_botones.className = "col opciones_usuario";

                        const btn_cancelar = document.createElement("button");
                        btn_cancelar.type = "button"
                        btn_cancelar.className = "btn btn_cancel";
                        btn_cancelar.textContent = "Cancel";

                        const div_divider = document.createElement("div");
                        div_divider.className = "divider";


                        const btn_confirmar = document.createElement("button");
                        btn_confirmar.type = "button"
                        btn_confirmar.className = "btn btn_confirm";
                        btn_confirmar.textContent = "Confirm order";

                        btn_cancelar.addEventListener("click", function () { popup() });
                        btn_confirmar.addEventListener("click", function () { confirmarOrden() });

                        div_botones.appendChild(btn_cancelar);
                        div_botones.appendChild(div_divider);
                        div_botones.appendChild(btn_confirmar);

                        div_total.appendChild(p_total);

                        row2.appendChild(div_total);
                        row2.appendChild(div_botones);

                        document.getElementById("detalle_carrito").appendChild(row2);

                    }

                    function popup() {
                        const popup = document.createElement("div");
                        popup.className = "modal";
                        popup.id = "myModal";

                        const pop1 = document.createElement("div");
                        pop1.className = "modal-content row";

                        const div1 = document.createElement("div");
                        div1.className = "row"

                        const cl1 = document.createElement("div");
                        cl1.className = "col"

                        const div2 = document.createElement("div");
                        div2.className = "row"

                        const cl2 = document.createElement("div");
                        cl2.className = "col"
                        cl2.style.display = "flex";
                        cl2.style.justifyContent = "flex-end";
                        cl2.style.alignItems = "flex-end";

                        const span = document.createElement("span");
                        span.className = "close";
                        span.textContent = "X";

                        const h3 = document.createElement("h3");
                        h3.textContent = "Cancel the order";

                        const p1 = document.createElement("p");
                        p1.textContent = "Are you sure about cancelling the order?";

                        const btn_cancelar = document.createElement("button");
                        btn_cancelar.type = "button"
                        btn_cancelar.className = "btn btn_confirm";
                        btn_cancelar.textContent = "Yes, I want to cancel the order.";
                        btn_cancelar.style.width = "250px";


                        btn_cancelar.addEventListener("click", function () { cancelarCompras(); salirPopup() })

                        const div_divider = document.createElement("div");
                        div_divider.className = "divider";

                        const btn_confirmar = document.createElement("button");
                        btn_confirmar.type = "button"
                        btn_confirmar.className = "btn btn_cancel";
                        btn_confirmar.textContent = "No, I want to continue adding products";
                        btn_confirmar.style.width = "400px";

                        btn_confirmar.addEventListener("click", function () { salirPopup() })

                        cl1.appendChild(span);
                        cl1.appendChild(h3);
                        cl1.appendChild(p1);
                        cl2.appendChild(btn_cancelar);
                        cl2.appendChild(btn_confirmar);

                        div1.appendChild(cl1);
                        div2.appendChild(cl2);

                        pop1.appendChild(div1);
                        pop1.appendChild(div2);

                        popup.appendChild(pop1);

                        document.getElementById("detalle_popup").appendChild(popup);

                        var modal = document.getElementById("myModal");

                        var spanF = document.getElementsByClassName("close")[0];

                        modal.style.display = "block";

                        spanF.onclick = function () {
                            modal.style.display = "none";
                        }

                        window.onclick = function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        }

                        function salirPopup() {
                            spanF.click();
                        }

                    }

                    function cancelarCompras() {
                        ocultarCartas();
                        total_dinero_cuenta = 0;
                        productos_carrito = [];
                    }

                    function confirmarOrden() {
                        ocultarCartas();
                        total_dinero_cuenta = 0;
                        for (let i = 0; i < productos_carrito.length; i++) {
                            console.log(productos_carrito[i]);
                            console.log("- - - - - - - - - -")
                        }
                        productos_carrito = [];
                    }

                    function ocultarCartas() {
                        var div_carrito_tablas = document.getElementsByClassName("table");
                        if (div_carrito_tablas.length != 0) {
                            for (list in div_carrito_tablas) {
                                div_carrito_tablas[list].hidden = true;
                            }
                        }

                        var div_carrito_botones = document.getElementsByClassName("opciones_usuario");
                        if (div_carrito_botones.length != 0) {
                            for (list in div_carrito_botones) {
                                div_carrito_botones[list].hidden = true;
                            }
                        }

                        var div_carrito_total = document.getElementsByClassName("div_total");
                        if (div_carrito_total.length != 0) {
                            for (list in div_carrito_total) {
                                div_carrito_total[list].hidden = true;
                            }
                        }

                        total_dinero_cuenta = 0;
                        var div_cards = document.getElementsByClassName("card");
                        if (div_cards.length != 0) {
                            for (card in div_cards) {
                                div_cards[card].hidden = true;
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
                            nombre_carta.textContent = nombre_producto_actual + ".";

                            var descripcion_carta = document.createElement("p");
                            descripcion_carta.className = "card-text";
                            descripcion_carta.textContent = descripcion_producto_actual;

                            var precio_carta = document.createElement("p");
                            precio_carta.className = "price";
                            precio_carta.textContent = "$" + precio_producto_actual;

                            if (precio_carta.textContent.split(".")[1].length != 2) {
                                precio_carta.textContent = "$" + precio_producto_actual + "0";
                            }

                            var boton_carta = document.createElement("a");
                            boton_carta.className = "btn btn-primary";
                            boton_carta.textContent = "Add to car";

                            contenido_carta.appendChild(nombre_carta);
                            contenido_carta.appendChild(descripcion_carta);
                            contenido_carta.appendChild(precio_carta);
                            contenido_carta.appendChild(boton_carta);

                            carta_nueva.appendChild(imagen_carta);
                            carta_nueva.appendChild(contenido_carta);

                            carta_nueva.addEventListener("click", function () {
                                aumentarCarrito(new productos_ordenados(carta_nueva.textContent.split(".")[0],
                                    carta_nueva.textContent.split("$")[0].replace(carta_nueva.textContent.split(".")[0] + ".", ""),
                                    (carta_nueva.textContent.split("$")[1].split(".")[0] + "." + carta_nueva.textContent.split("$")[1].split(".")[1].substring(0, 2))))
                            })

                            function aumentarCarrito(nueva_orden) {
                                encontrado = false;
                                for (i in productos_carrito) {
                                    if (productos_carrito[i].darNombre == nueva_orden.darNombre) {
                                        encontrado = true;
                                        nueva_orden.aumentarUnidades(productos_carrito[i].darCantidadUnidades);
                                        productos_carrito[i] = nueva_orden;
                                    }
                                }
                                if (encontrado == false) {
                                    nueva_orden.aumentarUnidades(0);
                                    productos_carrito.push(nueva_orden);
                                }
                                var contador_carrito = document.getElementById("cantidadCarrito");
                                contador_carrito.textContent = productos_carrito.length + " items";
                            }

                            const contenido_detalle_comidas = document.querySelector(".detalle_comidas");
                            contenido_detalle_comidas.appendChild(carta_nueva);

                        }
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