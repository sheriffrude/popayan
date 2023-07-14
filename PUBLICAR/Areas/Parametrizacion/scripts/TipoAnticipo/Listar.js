///Variables globales
var $TABLA_TIPO_ANTICIPO = null;

//Onload page
$(function () {
    ConstruirTablaTipoAnticipo();
    $("#form-filtro-tabla").submit(RecargarTablaTipoAnticipo);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoAnticipo() {
    if ($TABLA_TIPO_ANTICIPO != null) {
        $TABLA_TIPO_ANTICIPO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoAnticipo() {
    $("#input-filtro").val('');
    RecargarTablaTipoAnticipo();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoAnticipo() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_ANTICIPO = $("#tabla-tipo-anticipo").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_ANTICIPO,
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
                    return (PERMISO_EDITAR_TIPO_ANTICIPO)
                    ? '<a href="' + URL_EDITAR_TIPO_ANTICIPO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}