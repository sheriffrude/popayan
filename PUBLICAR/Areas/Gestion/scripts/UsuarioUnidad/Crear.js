/**
 * Variables Globales
**/
var $TABLA_USUARIOS = null;
var $TABLA_EMPRESAS = null;
var $TABLA_UNIDADES = null;

var USUARIO_SELECCIONADO_ID = 0;
var EMPRESA_SELECCIONADO_ID = 0;
var DATA_UNIDAD = [];

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
                    return '<input type="radio" name="radio-usuario" value="' + data + '" onchange="OnChangeSeleccionarUsuario(this)" />';
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
    USUARIO_SELECCIONADO_ID = $(e).val();
    if ($(e).is(":checked")) {
        $("#UsuarioId").val(USUARIO_SELECCIONADO_ID);
    }
    RecargarTablaEmpresa();
}

/**
 * Construir tabla empresa
**/
function ConstruirTablaEmpresa() {
    $TABLA_EMPRESAS = $("#tabla-empresas").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESAS,
            "type": "POST",
            "data": function (d) {
                d.id = USUARIO_SELECCIONADO_ID;
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
                    return '<input type="radio" name="radio-empresa" value="' + data + '" onchange="OnChangeSeleccionarEmpresa(this)" />';
                }
            },
            { "data": "Empresa" },
            { "data": "Nit" }
        ]
    });
}

function RecargarTablaEmpresa() {
    if (USUARIO_SELECCIONADO_ID > 0) {
        if ($TABLA_EMPRESAS != null)
            $TABLA_EMPRESAS.draw();
        else
            ConstruirTablaEmpresa();
    }
}

function OnChangeSeleccionarEmpresa(e) {
    EMPRESA_SELECCIONADO_ID = $(e).val();
    if ($(e).is(":checked")) {
        $("#EmpresaId").val(EMPRESA_SELECCIONADO_ID);
    }
    RecargarTablaUnidad();
}

/**
 * Construir tabla unidades
**/
function ConstruirTablaUnidades() {
    $TABLA_UNIDADES = $("#tabla-unidades").DataTable({
        "ajax": {
            "url": URL_LISTAR_UNIDADES,
            "type": "POST",
            "data": function (d) {
                d.id = EMPRESA_SELECCIONADO_ID;
                d.id2 = USUARIO_SELECCIONADO_ID;
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
                    var checked = (ExisteUnidad(data)) ? 'checked = "checked"' : "";
                    return '<input type="checkbox" value="' + data + '" onchange="OnChangeSeleccionarUnidad(this)"  ' + checked + ' />';
                }
            },
            { "data": "Unidad" },
        ]
    });
}

function RecargarTablaUnidad() {
    if (EMPRESA_SELECCIONADO_ID > 0 && USUARIO_SELECCIONADO_ID > 0) {
        if ($TABLA_UNIDADES != null)
            $TABLA_UNIDADES.draw();
        else
            ConstruirTablaUnidades();
    }
}

function OnChangeSeleccionarUnidad(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteUnidad(id))
            DATA_UNIDAD.push(id);
    } else {
        var tamanoData = DATA_UNIDAD.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_UNIDAD[i] == id) {
                DATA_UNIDAD.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteUnidad(id) {
    var existe = false;
    var tamanoData = DATA_UNIDAD.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_UNIDAD[i] == id) {
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

    var tamanoProductos = DATA_UNIDAD.length;
    if (tamanoProductos <= 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar minimo una unidad de negocio.");
        return false;
    }

    var data = $(this).serializeObject();
    data["Unidades"] = DATA_UNIDAD;
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessForm(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
    if (result.state == true) {
        setTimeout(function () {
            window.location.href = '/Gestion/UsuarioUnidad/Listar';
        }, 2000);
    }
}