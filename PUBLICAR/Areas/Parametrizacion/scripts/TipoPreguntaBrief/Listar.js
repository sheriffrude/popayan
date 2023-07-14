///Variables globales
var $TABLA_TIPO_PREGUNTA_BRIEF = null;

//Onload page
$(function () {
    ConstruirTablaTipoPreguntaBrief();
    $("#form-filtro-tabla").submit(RecargarTablaTipoPreguntaBrief);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoPreguntaBrief() {
    if ($TABLA_TIPO_PREGUNTA_BRIEF != null) {
        $TABLA_TIPO_PREGUNTA_BRIEF.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoPreguntaBrief() {
    $("#input-filtro").val('');
    RecargarTablaTipoPreguntaBrief();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoPreguntaBrief() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_PREGUNTA_BRIEF = $("#tabla-tipo-pregunta").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_PREGUNTA_BRIEF,
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
                    return (PERMISO_EDITAR_TIPO_PREGUNTA_BRIEF)
                    ? '<a href="' + URL_EDITAR_TIPO_PREGUNTA_BRIEF + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}