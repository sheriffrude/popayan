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
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-empresa" onchange="CambiarEstadoBancoEmpresa(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_BANCO_EMPRESA) ? botonEstado : "";
                    return resultado;
                }
            },
        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-empresa").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function CambiarEstadoBancoEmpresa(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_BANCO_EMPRESA,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaBancoEmpresas();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}