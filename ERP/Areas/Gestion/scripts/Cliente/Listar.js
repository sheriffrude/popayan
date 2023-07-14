/**
 * Variables Globales
 */
var $TABLA_CLIENTES = null;

/**
 * OnLoadPage
 */
$(function () {
    ConstruirTablaClientes();
});

/**
 * RecargarTablaClientes
 */
function RecargarTablaClientes() {
    if ($TABLA_CLIENTES != null)
        $TABLA_CLIENTES.draw();
}

/**
 * ConstruirTablaClientes
 */
function ConstruirTablaClientes() {
    var $filtro = $("#input-filtro");
    $TABLA_CLIENTES = $("#tabla-Clientes").DataTable({
        "ajax": {
            "url": URL_LISTAR_CLIENTES,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nit" },
            {
                "data": "NombreComercial",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_VER_DETALLE_CLIENTES + '/' + full.Id + '" class="btn btn-secondary">' + data + '</a>';
                }
            },
            { "data": "Telefonos" },
            { "data": "Direccion" },
            { "data": "Ciudad" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "12%",
                "render": function (data, type, full, meta) {
                    var botonDocumento = '<a href="' + URL_ADMINISTRACION + '/' + data + '" class="btn btn-secondary" >Administrar</a>'
                    var resultado = botonDocumento;
                    return resultado;
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    return '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente" onchange="CambiarEstadoCliente(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $(".boton-desactivar-cliente").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

/**
 * Cambiar estado  proveedor
 * @param {int} id 
 */
function CambiarEstadoCliente(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };

    RequestHttp._Post(URL_CAMBIAR_ESTADO_CLIENTES, parameters, null, function (data) {
        if (!Validations._IsNull(data)) {
            var tipoMensaje = "danger";
            if (data.state) {
                tipoMensaje = "success";
                RecargarTablaClientes();
            }
            Utils._BuilderMessage(tipoMensaje, data.message);
        }
    });
}