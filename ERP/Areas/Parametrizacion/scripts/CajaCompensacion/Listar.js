/**
 * Variables Globales
**/
var $TABLA_CAJA_COMPENSACION = null;

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaCajaCompensacion();
    $("#form-filtro-tabla").submit(RecargarTablaCajaCompensacion);
});

/**
 * Recargar tabla
**/
function RecargarTablaCajaCompensacion() {
    if ($TABLA_CAJA_COMPENSACION != null) {
        $TABLA_CAJA_COMPENSACION.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaCajaCompensacion() {
    $("#input-filtro").val('');
    RecargarTablaCajaCompensacion();
}

/**
 * Construir tabla
**/
function ConstruirTablaCajaCompensacion() {
    var $filtro = $("#input-filtro");
    $TABLA_CAJA_COMPENSACION = $("#tabla-caja-compensacion").DataTable({
        "ajax": {
            "url": URL_LISTAR_CAJA_COMPENSACION,
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
            {
                "data": "Pais",
                "width": "20%",
            },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_CAJA_COMPENSACION)
                    ? '<a href="' + URL_EDITAR_CAJA_COMPENSACION + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}