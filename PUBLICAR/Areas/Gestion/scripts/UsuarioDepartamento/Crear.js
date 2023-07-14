/**
 * Variables Globales
**/
var $TABLA_USUARIOS = null;
var $TABLA_DEPARTAMENTOS_TRAFICO = null;
var DATA_DEPARTAMENTOS_TRAFICO = [];

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

function ResetearTablaUsuarios() {
    $("#input-filtro-usuarios").val("");
    RecargarTablaUsuarios();
}

/**
 * OnChange Radio Seleccionar Persona
**/
function OnChangeSeleccionarUsuario(e) {
    var usuarioId = $(e).val();
    if ($(e).is(":checked")) {
        $("#UsuarioId").val(usuarioId);
    }
    RecargarTablaDepartamentosTrafico(usuarioId)
}

/**
 * Construir tabla departamentos trafico
**/
function ConstruirTablaDepartamentosTrafico(usuarioId) {
    $TABLA_DEPARTAMENTOS_TRAFICO = $("#tabla-departamentos-trafico").dataTable({
        "destroy": true,
        "ajax": {
            "url": URL_LISTAR_DEPARTAMENTOS_TRAFICO_ACTIVO_FILTRADO_POR_USUARIO_NO_DEPARTAMENTO + "?id=" + usuarioId,
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
                    var checked = (ExisteDepartamentoTrafico(data)) ? 'checked = "checked"' : "";
                    return '<input type="checkbox" value="' + data + '" onchange="OnChangeSeleccionarDepartamentoTrafico(this)"  ' + checked + ' />';
                }
            },
            { "data": "Nombre" }
        ]
    });
}

function RecargarTablaDepartamentosTrafico(usuarioId) {
    if ($TABLA_DEPARTAMENTOS_TRAFICO != null)
        $TABLA_DEPARTAMENTOS_TRAFICO.fnDestroy();
    ConstruirTablaDepartamentosTrafico(usuarioId)
}

function OnChangeSeleccionarDepartamentoTrafico(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteDepartamentoTrafico(id))
            DATA_DEPARTAMENTOS_TRAFICO.push(id);
    } else {
        var tamanoData = DATA_DEPARTAMENTOS_TRAFICO.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_DEPARTAMENTOS_TRAFICO[i] == id) {
                DATA_DEPARTAMENTOS_TRAFICO.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteDepartamentoTrafico(id) {
    var existe = false;
    var tamanoData = DATA_DEPARTAMENTOS_TRAFICO.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_DEPARTAMENTOS_TRAFICO[i] == id) {
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

    var tamanoDataDeptos = DATA_DEPARTAMENTOS_TRAFICO.length;
    if (tamanoDataDeptos <= 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar minimo un Departamento de Tráfico para continuar.");
        return false;
    }

    var data = $(this).serializeObject();
    data["DepartamentosTrafico"] = DATA_DEPARTAMENTOS_TRAFICO;
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessForm(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
    if (result.state == true) {
        setTimeout(function () {
            window.location.href = '/Gestion/UsuarioDepartamento/Listar';
        }, 2000);
    }
}