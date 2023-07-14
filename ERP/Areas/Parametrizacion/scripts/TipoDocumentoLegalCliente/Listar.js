///Variables globales
var $TABLA_TIPO_DOCUMENTO_LEGAL_CLIENTE = null;

//Onload page
$(function () {
    ConstruirTablaTipoDocumentoLegalCliente();
    $("#form-filtro-tabla").submit(RecargarTablaTipoDocumentoLegalCliente);
});

/**
 * Recargar Tabla
 */
function RecargarTablaTipoDocumentoLegalCliente() {
    if ($TABLA_TIPO_DOCUMENTO_LEGAL_CLIENTE != null) {
        $TABLA_TIPO_DOCUMENTO_LEGAL_CLIENTE.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaTipoDocumentoLegalCliente() {
    $("#input-filtro").val('');
    RecargarTablaTipoDocumentoLegalCliente();
}

/**
 * Construir tabla
 */
function ConstruirTablaTipoDocumentoLegalCliente() {
    var $filtro = $("#input-filtro");
    $TABLA_TIPO_DOCUMENTO_LEGAL_CLIENTE = $("#tabla-tipo-documento-legal-cliente").DataTable({
        "ajax": {
            "url": URL_LISTAR_TIPO_DOCUMENTO_LEGAL_CLIENTE,
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
                    return (PERMISO_EDITAR_TIPO_DOCUMENTO_LEGAL_CLIENTE)
                    ? '<a href="' + URL_EDITAR_TIPO_DOCUMENTO_LEGAL_CLIENTE + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}