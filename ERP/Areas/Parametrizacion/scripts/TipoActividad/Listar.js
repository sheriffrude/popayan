/**
 * Variables Globales
**/
var $TABLA_TIPO_ACTIVIDADS = null;

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaTipoActividad();
    $("#form-filtro-tabla").submit(RecargarTablaTipoActividad);
});

/**
 * Recargar tabla
**/
function RecargarTablaTipoActividad() {
    if ($TABLA_TIPO_ACTIVIDADS != null) {
        $TABLA_TIPO_ACTIVIDADS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoActividad() {
    $("#input-filtro").val('');
    RecargarTablaTipoActividad();
}

/**
 * Construir tabla
**/
function ConstruirTablaTipoActividad() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_ACTIVIDADS = $("#tabla-tipo-actividad").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_ACTIVIDAD,
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
            { "data": "Categoria", },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_TIPO_ACTIVIDAD)
                    ? '<a href="' + URL_EDITAR_TIPO_ACTIVIDAD + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}