///Variables globales
var $TABLA_TIPO_DOCUMENTO_LEGAL_EMP = null;

//Onload page
$(function () {
    ConstruirTablaTipoDocumentoLegalEmp();
    $("#form-filtro-tabla").submit(RecargarTablaTipoDocumentoLegalEmp);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoDocumentoLegalEmp() {
    if ($TABLA_TIPO_DOCUMENTO_LEGAL_EMP != null) {
        $TABLA_TIPO_DOCUMENTO_LEGAL_EMP.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoDocumentoLegalEmp() {
    $("#input-filtro").val('');
    RecargarTablaTipoDocumentoLegalEmp();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoDocumentoLegalEmp() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_DOCUMENTO_LEGAL_EMP = $("#tabla-tipo-documento-legal-emp").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_DOCUMENTO_LEGAL_EMP,
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
                    return (PERMISO_EDITAR_TIPO_DOCUMENTO_LEGAL_EMP)
                    ? '<a href="' + URL_EDITAR_TIPO_DOCUMENTO_LEGAL_EMP + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}