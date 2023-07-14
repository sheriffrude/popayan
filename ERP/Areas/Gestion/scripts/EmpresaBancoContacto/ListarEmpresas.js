/**
 *  Variables globales
**/
var $TABLA_BANCOS_EMPRESAS = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaEmpresas();
    $("#form-filtro-tabla").submit(RecargarTablaBancoEmpresas);
});

/**
 * Recargar tabla
**/
function RecargarTablaBancoEmpresas() {
    if ($TABLA_BANCOS_EMPRESAS != null) {
        $TABLA_BANCOS_EMPRESAS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaBancoEmpresa() {
    $("#input-filtro").val('');
    RecargarTablaBancoEmpresas();
}

/**
 * Construir tabla
**/
function ConstruirTablaEmpresas() {
    var $filtro = $("#input-filtro");
    $TABLA_BANCOS_EMPRESAS = $("#tabla-bancos-empresas").DataTable({
        "ajax": {
            "url": URL_LISTAR_BANCO_EMPRESA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Banco" },
            { "data": "NitBanco" },
            { "data": "Empresa" },
            { "data": "NitEmpresa" },
            {
                "data": "EmpresaId",
                "orderable": false,
                "searchable": false,
                "width": "12%",
                "render": function (data, type, full, meta) {
                    var botonDocumento = '<a href="' + URL_CONTACTO_BANCO_EMPRESA + '/' + data + '?bancoId=' + full.BancoId + '" class="btn btn-secondary" >Contactos</a>'
                    var resultado = botonDocumento;
                    return resultado;
                }
            },
        ],
    });
}
