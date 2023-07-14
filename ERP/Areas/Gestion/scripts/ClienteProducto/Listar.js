/**
 * Variables Globales
 */
var $TABLA_CLIENTE_PRODUCTO = null;
var FILTRO_CLIENTE = null;
var FILTRO_PRODUCTO = null;
var CLIENTE_PRODUCTO = [];

/**
 * Recargar Tabla Cliente Productos
 */
$(function () {
    ConstruirTablaClienteProductos();
});

/**
 * Recargar Tabla Cliente Productos
 */
function RecargarTablaClienteProductos() {
    if ($TABLA_CLIENTE_PRODUCTO != null) {
        $TABLA_CLIENTE_PRODUCTO.draw();
    } else {
        ConstruirTablaClienteProductos();
    }
    
}

/**
 * ConstruirTablaClienteProductos
 */
function ConstruirTablaClienteProductos() {

    var $filtro = $("#input-filtro");

    $TABLA_CLIENTE_PRODUCTO = $("#tabla-cliente-producto").DataTable({
        "ajax": {
            "url": URL_CLIENTE_PRODUCTO,
            "type": "POST",
            "dataType": "JSON",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.clienteId = FILTRO_CLIENTE;
                d.productoId = FILTRO_PRODUCTO
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Cliente" },
            { "data": "Producto" },
            { "data": "Fee" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_CLIENTE_PRODUCTO_EDITAR + '?id=' + data + '" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#" >Editar</a>';
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente-producto" onchange="CambiarEstadoClienteProducto(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'
                    var resultado = botonEstado;
                    return resultado;

                }
            }
        ],
        "drawCallback": function (settings) {

            Utils._BuilderModal();
            $(".boton-desactivar-cliente-producto").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

/**
 * OnChangeCliente
 * @param {any} e
 * @param {any} urlProductos
 */
function OnChangeCliente(e, urlProductos) {

    var id = $(e).val();
    var $elementListProductos = $("#FiltroProductoId");

    if (Validations._IsNull(id)) {
        id = null;
        Utils._ClearDropDownList($elementListProductos);
    } else {
        var parameters = {
            id: id
        };

        Utils._GetDropDownList($elementListProductos, urlProductos, parameters);
    }
    FILTRO_CLIENTE = id;
    FILTRO_PRODUCTO = null;
}

/**
 * OnChangeProducto
 * @param {any} e
 */
function OnChangeProducto(e) {
    var id = $(e).val();
    if (Validations._IsNull(id))
        id = null;

    FILTRO_PRODUCTO = id;
}

/**
 * CambiarEstadoClienteProducto
 * @param {any} e
 */
function CambiarEstadoClienteProducto(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };

    RequestHttp._Post(URL_CAMBIAR_ESTADO_CLIENTES_PRODUCTO, parameters, null, function (data) {
        if (!Validations._IsNull(data)) {
            var tipoMensaje = "danger";
            if (data.state) {
                tipoMensaje = "success";
                RecargarTablaClienteProductos();
            }
            Utils._BuilderMessage(tipoMensaje, data.message);
        }
    });
}