///Variables globales
var $TABLA_TIPO_PAGO = null;

//Onload page
$(function () {
    ConstruirTablaTipoPago();
    $("#form-filtro-tabla").submit(RecargarTablaTipoPago);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoPago() {
    if ($TABLA_TIPO_PAGO != null) {
        $TABLA_TIPO_PAGO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoPago() {
    $("#input-filtro").val('');
    RecargarTablaTipoPago();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoPago() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_PAGO = $("#tabla-tipo-pago").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_PAGO,
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
                    return (PERMISO_EDITAR_TIPO_PAGO)
                    ? '<a href="' + URL_EDITAR_TIPO_PAGO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}