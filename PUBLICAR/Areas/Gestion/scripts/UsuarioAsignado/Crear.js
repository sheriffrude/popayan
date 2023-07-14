/**
 * Variables Globales
**/
var $TABLA_USUARIOS = null;
var $TABLA_DEPARTAMENTOS_TRAFICO = null;
var $TABLA_USUARIOS_ASIGNADOS = null;

var USUARIO_SELECCIONADO_ID = 0;
var DEPTO_TRAFICO_SELECCIONADO_ID = 0;
var ARRAY_USUARIO_ID = [];

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaUsuarios();
    ConstruirTablaDepartamentosTrafico();
    $("#input-buscar-usuarios").on("click", RecargarTablaUsuarios);
    $("#input-buscar-usuarios-asignados").on("click", RecargarTablaUsuariosAsignados);
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


function ResetearTablaUsuarios() {
    $("#input-filtro-usuarios").val("");
    RecargarTablaUsuarios();
}

/**
 * OnChange Radio Seleccionar Persona
**/
function OnChangeSeleccionarUsuario(e) {
    USUARIO_SELECCIONADO_ID = $(e).val();
    if ($(e).is(":checked")) {
        $("#UsuarioId").val(USUARIO_SELECCIONADO_ID);
    }
    RecargarTablaUsuariosAsignados();
}

/**
 * Construir tabla departamentos trafico
**/
function ConstruirTablaDepartamentosTrafico() {

    $TABLA_DEPARTAMENTOS_TRAFICO = $("#tabla-departamentos-trafico").DataTable({
        "ajax": {
            "url": URL_LISTAR_DEPARTAMENTOS_TRAFICO_ACTIVOS,
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
                    return '<input type="radio" name="radio-depto-trafico" value="' + data + '" onchange="OnChangeSeleccionarDepartamentoTrafico(this)" />';
                }
            },
            { "data": "Nombre" }
        ]
    });
}

function RecargarTablaDepartamentosTrafico() {
    if ($TABLA_DEPARTAMENTOS_TRAFICO != null)
        $TABLA_DEPARTAMENTOS_TRAFICO.draw();
}

function OnChangeSeleccionarDepartamentoTrafico(e) {

    DEPTO_TRAFICO_SELECCIONADO_ID = $(e).val();
    if ($(e).is(":checked")) {
        $("#DepartamentoTraficoId").val(DEPTO_TRAFICO_SELECCIONADO_ID);
    }

    RecargarTablaUsuariosAsignados();
}

/**
 * Construir tabla departamentos trafico
**/
function ConstruirTablaUsuariosAsignados() {

    $filtro = $("#input-filtro-usuarios-asignados");
    $TABLA_USUARIOS_ASIGNADOS = $("#tabla-usuarios-asignados").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIOS_NO_ASIGNADOS,
            "type": "POST",
            "data": function (d) {
                d.id = DEPTO_TRAFICO_SELECCIONADO_ID;
                d.usuarioId = USUARIO_SELECCIONADO_ID;
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
                    return '<input type="checkbox"  id="' + data + '" onclick="SeleccionarItem(' + data + ')" />';
                }
            },
            { "data": "UserName" },
            { "data": "Nombre" },
            { "data": "Documento" }
        ]
    });
}

function RecargarTablaUsuariosAsignados() {

    if (DEPTO_TRAFICO_SELECCIONADO_ID > 0 && USUARIO_SELECCIONADO_ID > 0) {
        if ($TABLA_USUARIOS_ASIGNADOS != null)
            $TABLA_USUARIOS_ASIGNADOS.draw();
        else
            ConstruirTablaUsuariosAsignados();
    }
}

function OnChangeSeleccionarUsuarioAsignado(e) {
    if ($(e).is(":checked")) {
        $("#UsuarioAsignadoId").val($(e).val());
    }
}

function SeleccionarItem(id) {

    var tam = ARRAY_USUARIO_ID.length;
    for (i = 0; i < tam; i++) {
        if (ARRAY_USUARIO_ID[i] == id) {
            ARRAY_USUARIO_ID.splice(i, 1);
            return false;
        }
    }
    ARRAY_USUARIO_ID.push(id);
}


/**
 * OnBeginCrear
 * @param {any} jqXHR
 * @param {any} settings
*/
function OnBeginCrear(jqXHR, settings) {

    var data = $(this).serializeObject();

    var tamano = ARRAY_USUARIO_ID.length;
    if (tamano <= 0) {
        Utils._BuilderMessage("warning", 'Debe seleccionar al menos un usuario para asignar');
        return false;
    }

    data["AsignadosId"] = ARRAY_USUARIO_ID;
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrear(resultado) {

    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
}
