///Variables globales
var $TABLA_TIPO_DOCUMENTO_LEGAL = null;

//Onload page
$(function () {
    ConstruirTablaTipoDocumentoLegal();
    $("#form-filtro-tabla").submit(RecargarTablaTipoDocumentoLegal);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoDocumentoLegal() {
    if ($TABLA_TIPO_DOCUMENTO_LEGAL != null) {
        $TABLA_TIPO_DOCUMENTO_LEGAL.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoDocumentoLegal() {
    $("#input-filtro").val('');
    RecargarTablaTipoDocumentoLegal();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoDocumentoLegal() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_DOCUMENTO_LEGAL = $("#tabla-tipo-documento-legal").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_DOCUMENTO_LEGAL,
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
                    return (PERMISO_EDITAR_TIPO_DOCUMENTO_LEGAL)
                    ? '<a href="' + URL_EDITAR_TIPO_DOCUMENTO_LEGAL + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}