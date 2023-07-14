//Variable Globales
var $TABLA_PROVEEDOR_SERVICIO = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaProveedorServicio();
    $("#form-filtro-tabla").submit(RecargarTablaProveedorServicio);
});

/**
 * Function para filtrar la tabla ProveedorServicioes
 * @returns {boolean} false
 */
function RecargarTablaProveedorServicio() {
    if ($TABLA_PROVEEDOR_SERVICIO != null) {
        $TABLA_PROVEEDOR_SERVICIO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaProveedorServicio() {
    $("#input-filtro").val('');
    RecargarTablaProveedorServicio();
}

/**
 * Funcion para construir la tabla ProveedorServicioes
 */
function ConstruirTablaProveedorServicio() {
    var $filtro = $("#input-filtro");
    $TABLA_PROVEEDOR_SERVICIO = $("#tabla-proveedor-servicio").DataTable({
        "ajax": {
            "url": URL_LISTAR_PROVEEDOR_SERVICIO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre", },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_PROVEEDOR_SERVICIO) 
                        ? '<a href="' + URL_EDITAR_PROVEEDOR_SERVICIO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}