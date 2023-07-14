///Variables globales
var $TABLA_TIPO_DOCUMENTO_LEGAL_EMPRESA = null;

//Onload page
$(function () {
    ConstruirTablaTipoDocumentoLegalEmpresa();
    $("#form-filtro-tabla").submit(RecargarTablaTipoDocumentoLegalEmpresa);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoDocumentoLegalEmpresa() {
    if ($TABLA_TIPO_DOCUMENTO_LEGAL_EMPRESA != null) {
        $TABLA_TIPO_DOCUMENTO_LEGAL_EMPRESA.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoDocumentoLegalEmpresa() {
    $("#input-filtro").val('');
    RecargarTablaTipoDocumentoLegalEmpresa();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoDocumentoLegalEmpresa() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_DOCUMENTO_LEGAL_EMPRESA = $("#tabla-tipo-documento-legal-empresa").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_DOCUMENTO_LEGAL_EMPRESA,
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
                    return (PERMISO_EDITAR_TIPO_DOCUMENTO_LEGAL_EMPRESA)
                    ? '<a href="' + URL_EDITAR_TIPO_DOCUMENTO_LEGAL_EMPRESA + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}