///Variables globales
var $TABLA_TIPO_RESERVA = null;

//Onload page
$(function () {
    ConstruirTablaTipoReserva();
    $("#form-filtro-tabla").submit(RecargarTablaTipoReserva);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoReserva() {
    if ($TABLA_TIPO_RESERVA != null) {
        $TABLA_TIPO_RESERVA.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoReserva() {
    $("#input-filtro").val('');
    RecargarTablaTipoReserva();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoReserva() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_RESERVA = $("#tabla-tipo-reserva").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_RESERVA,
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
                    return (PERMISO_EDITAR_TIPO_RESERVA)
                        ? '<a href="' + URL_EDITAR_TIPO_RESERVA + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}