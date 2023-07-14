/**
 * Variables Globales
**/
var $TABLA_EMPRESA = null;
var DATA_EMPRESA = [];

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaEmpresa();
});

/**
 * Construir tabla empresas
**/
function ConstruirTablaEmpresa() {

    $TABLA_EMPRESA = $("#tabla-empresas").dataTable({
        "destroy": true,
        "ajax": {
            "url": URL_LISTAR_EMPRESAS_NO_ASIGNADAS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = "";
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        },
        "columns": [
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var checked = (ExisteEmpresa(data)) ? 'checked = "checked"' : "";
                    return '<input type="checkbox" value="' + data + '" onchange="OnChangeSeleccionarEmpresa(this)"  ' + checked + ' />';
                }
            },
            { "data": "Empresa" },
            { "data": "Nit" },
        ]
    });
}

function OnChangeSeleccionarEmpresa(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteEmpresa(id))
            DATA_EMPRESA.push(id);
    } else {
        var tamanoData = DATA_EMPRESA.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_EMPRESA[i] == id) {
                DATA_EMPRESA.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteEmpresa(id) {
    var existe = false;
    var tamanoData = DATA_EMPRESA.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_EMPRESA[i] == id) {
            existe = true;
            break;
        }
    }
    return existe;
}

function OnBeginForm(jqXHR, settings) {
    var tamanoDataEmpresas = DATA_EMPRESA.length;
    if (tamanoDataEmpresas <= 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar minimo una empresa para continuar.");
        return false;
    }

    var data = $(this).serializeObject();
    data["Empresas"] = DATA_EMPRESA;
    data["BancoId"] = $("#BancoId").val();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessForm(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
    if (result.state == true) {
        setTimeout(function () {
            window.location.href = '/Gestion/BancoEmpresas/Listar/' + $("#BancoId").val();
        }, 2000);
    }
}