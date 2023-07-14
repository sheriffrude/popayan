
/**
 * Variables globales
 */
var $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR = null;
var $TABLA_EMPRESA_PROVEEDOR_DOCUMENTO_LEGAL = null;

/**
 * Onload page
 */
$(function () {

    $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR = $("#form-filtro-tabla-documento-legal");

    ConstruirTablaEmpresaProveedorDocumentoLegal();
});
/**
 * Construye tabla de documento legal
 */
function ConstruirTablaEmpresaProveedorDocumentoLegal() {
    var $filtro = $FORM_FILTRO_TABLA_EMPRESA_PROVEEDOR.find("input[type=search]");
    $TABLA_EMPRESA_PROVEEDOR_DOCUMENTO_LEGAL = $("#tabla-empresa-proveedor-documento-legal").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESA_PROVEEDOR_DOCUMENTO_LEGAL,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {

                    }
                });
            }
        },
        "columns": [

            { "data": "Nit" },
            { "data": "NombreProveedor" },
            { "data": "NombreDocumentoLegal" },
            {
                "data": "DocumentoId",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_DESCARGAR_EMPRESA_PROVEEDOR_DOCUMENTO_LEGAL + '?id=' + data + '" title="Descargar">' +
                        '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                        '</a>';
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}