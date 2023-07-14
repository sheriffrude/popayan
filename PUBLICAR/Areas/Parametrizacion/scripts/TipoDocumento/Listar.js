///Variables globales
var $TABLA_TIPO_DOCUMENTO = null;

//Onload page
$(function () {
    ConstruirTablaTipoDocumento();
    $("#form-filtro-tabla").submit(RecargarTablaTipoDocumento);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoDocumento() {
    if ($TABLA_TIPO_DOCUMENTO != null) {
        $TABLA_TIPO_DOCUMENTO.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoDocumento() {
    $("#input-filtro").val('');
    RecargarTablaTipoDocumento();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoDocumento() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_DOCUMENTO = $("#tabla-tipo-documento").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_DOCUMENTO,
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
                    return (PERMISO_EDITAR_TIPO_DOCUMENTO)
                    ? '<a href="' + URL_EDITAR_TIPO_DOCUMENTO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}