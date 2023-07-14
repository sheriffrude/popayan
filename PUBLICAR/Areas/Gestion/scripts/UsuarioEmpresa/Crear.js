/**
 * Variables Globales
**/
var $TABLA_USUARIOS = null;
var $TABLA_EMPRESA = null;
var DATA_EMPRESA = [];

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaUsuarios();

    $("#input-buscar-usuarios").on("click", RecargarTablaUsuarios);
});

function RecargarTablaUsuarios() {
    if ($TABLA_USUARIOS != null)
        $TABLA_USUARIOS.draw();
}

/**
 * Construir tabla usuarios
**/
function ConstruirTablaUsuarios() {
    $filtro = $("#input-filtro-usuarios");
    $TABLA_USUARIOS = $("#tabla-usuarios").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIOS_ACTIVOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
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
                    return '<input type="radio" name="checkbox-usuario" value="' + data + '" onchange="OnChangeSeleccionarUsuario(this)" />';
                }
            },
            { "data": "UserName" },
            { "data": "Nombre" },
            { "data": "Documento" },
        ]
    });
}

/**
 * OnChange Radio Seleccionar Persona
**/
function OnChangeSeleccionarUsuario(e) {
    var usuarioId = $(e).val();
    if ($(e).is(":checked")) {
        $("#UsuarioId").val(usuarioId);
    }
    RecargarTablaEmpresas(usuarioId)
}

/**
 * Construir tabla empresas
**/
function ConstruirTablaEmpresa(usuarioId) {

    $TABLA_EMPRESA = $("#tabla-empresas").dataTable({
        "destroy": true,
        "ajax": {
            "url": URL_LISTAR_EMPRESAS_NO_ASIGNADAS + "?id=" + usuarioId,
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

function RecargarTablaEmpresas(usuarioId) {

    if ($TABLA_EMPRESA != null)
        $TABLA_EMPRESA.fnDestroy();

    ConstruirTablaEmpresa(usuarioId);

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
    var usuarioId = $("#UsuarioId").val();
    if (usuarioId == 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar una Usuario para continuar.");
        return false;
    }

    var tamanoDataEmpresas = DATA_EMPRESA.length;
    if (tamanoDataEmpresas <= 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar minimo una empresa para continuar.");
        return false;
    }

    var data = $(this).serializeObject();
    data["Empresas"] = DATA_EMPRESA;
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessForm(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
    if (result.state == true) {
        setTimeout(function () {
            window.location.href = '/Gestion/UsuarioEmpresa/Listar';
        }, 2000);
    }
}