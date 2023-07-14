///Variables globales
var $TABLA_TIPO_DOCUMENTO_LEGAL_PRVD = null;

//Onload page
$(function () {
    ConstruirTablaTipoDocumentoLegalProveedor();
    $("#form-filtro-tabla").submit(RecargarTablaTipoDocumentoLegalProveedor);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoDocumentoLegalProveedor() {
    if ($TABLA_TIPO_DOCUMENTO_LEGAL_PRVD != null) {
        $TABLA_TIPO_DOCUMENTO_LEGAL_PRVD.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoDocumentoLegalProveedor() {
    $("#input-filtro").val('');
    RecargarTablaTipoDocumentoLegalProveedor();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoDocumentoLegalProveedor() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_DOCUMENTO_LEGAL_PRVD = $("#tabla-tipo-documento-legal").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_DOCUMENTO_LEGAL_PRVD,
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
                    return (PERMISO_EDITAR_TIPO_DOCUMENTO_LEGAL_PRVD)
                        ? '<a href="' + URL_EDITAR_TIPO_DOCUMENTO_LEGAL_PRVD + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}