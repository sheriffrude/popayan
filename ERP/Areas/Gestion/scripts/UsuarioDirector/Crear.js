/**
 * Variables Globales
**/
var $TABLA_USUARIOS = null;
var $TABLA_USUARIOS_DIRECTORES = null;

var USUARIO_SELECCIONADO_ID = 0;

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaUsuarios();

    $("#input-buscar-usuarios").on("click", RecargarTablaUsuarios);
    $("#input-buscar-usuarios-directores").on("click", RecargarTablaUsuariosDirectores);
    
    /*if ($filtro = $("#input-filtro-usuarios-directores").val() != "") {
        alert($filtro);
    }*/
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
            "url": URL_LISTAR_USUARIOS_NO_DIRECTORES,
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
 * OnChange Radio Seleccionar Usuario
**/
function OnChangeSeleccionarUsuario(e) {
    USUARIO_SELECCIONADO_ID = $(e).val();
    if ($(e).is(":checked")) {
        $("#UsuarioId").val(USUARIO_SELECCIONADO_ID);
    }
    RecargarTablaUsuariosDirectores();
}
/**
 * Construir tabla usuarios directores
**/
function ConstruirTablaUsuariosDirectores() {
    $filtro = $("#input-filtro-usuarios-directores");
    $TABLA_USUARIOS_DIRECTORES = $("#tabla-usuarios-directores").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIOS_NO_ASIGNADOS_COMO_DIRECTOR,
            "type": "POST",
            "data": function (d) {
                d.id = USUARIO_SELECCIONADO_ID;
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
                    return '<input type="radio" name="radio-usuario-director" value="' + data + '" onchange="OnChangeSeleccionarUsuarioDirector(this)" />';
                }
            },
            { "data": "UserName" },
            { "data": "Nombre" },
            { "data": "Documento" }
        ]
    });
}

function RecargarTablaUsuariosDirectores() {
    //alert("entra");
    if (USUARIO_SELECCIONADO_ID > 0) {
        if ($TABLA_USUARIOS_DIRECTORES != null)
            $TABLA_USUARIOS_DIRECTORES.draw();
        else
            ConstruirTablaUsuariosDirectores();
    }
}

function OnChangeSeleccionarUsuarioDirector(e) {
    if ($(e).is(":checked")) {
        $("#UsuarioDirectorId").val($(e).val());
    }
}