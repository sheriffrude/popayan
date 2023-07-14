///Variables globales
var $TABLA_TIPO_RANGO_CANTIDAD = null;

//Onload page
$(function () {
    ConstruirTablaTipoRangoCantidad();
    $("#form-filtro-tabla").submit(RecargarTablaTipoRangoCantidad);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoRangoCantidad() {
    if ($TABLA_TIPO_RANGO_CANTIDAD != null) {
        $TABLA_TIPO_RANGO_CANTIDAD.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoRangoCantidad() {
    $("#input-filtro").val('');
    RecargarTablaTipoRangoCantidad();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoRangoCantidad() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_RANGO_CANTIDAD = $("#tabla-tipo-rango").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_RANGO_CANTIDAD,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_TIPO_RANGO_CANTIDAD)
                    ? '<a href="' + URL_EDITAR_TIPO_RANGO_CANTIDAD + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}