/**
 * Variables Globales
**/
var $TABLA_USUARIOS = null;
var $TABLA_CLIENTES = null;
var $TABLA_PRODUCTOS = null;

var USUARIO_SELECCIONADO_ID = 0;
var CLIENTE_SELECCIONADO_ID = 0;
var DATA_PRODUCTO = [];

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
    RecargarTablaCliente();
}

/**
 * Construir tabla cliente
**/
function ConstruirTablaCliente() {
    $TABLA_CLIENTES = $("#tabla-clientes").DataTable({
        "ajax": {
            "url": URL_LISTAR_CLIENTES,
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
                    return '<input type="radio" name="radio-cliente" value="' + data + '" onchange="OnChangeSeleccionarCliente(this)" />';
                }
            },
            { "data": "Cliente" },
            { "data": "Nit" }
        ]
    });
}

function RecargarTablaCliente() {
    if (USUARIO_SELECCIONADO_ID > 0) {
        if ($TABLA_CLIENTES != null)
            $TABLA_CLIENTES.draw();
        else
            ConstruirTablaCliente();
    }
}

function OnChangeSeleccionarCliente(e) {
    CLIENTE_SELECCIONADO_ID = $(e).val();
    if ($(e).is(":checked")) {
        $("#ClienteId").val(CLIENTE_SELECCIONADO_ID);
    }
    RecargarTablaProducto();
}

/**
 * Construir tabla prodctos
**/
function ConstruirTablaProducto() {
    $TABLA_PRODUCTOS = $("#tabla-productos").DataTable({
        "ajax": {
            "url": URL_LISTAR_PRODUCTOS,
            "type": "POST",
            "data": function (d) {
                d.id = CLIENTE_SELECCIONADO_ID;
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
                    var checked = (ExisteProducto(data)) ? 'checked = "checked"' : "";
                    return '<input type="checkbox" value="' + data + '" onchange="OnChangeSeleccionarProducto(this)"  ' + checked + ' />';
                }
            },
            { "data": "Producto" },
        ]
    });
}

function RecargarTablaProducto() {
    if (CLIENTE_SELECCIONADO_ID > 0 && USUARIO_SELECCIONADO_ID > 0) {
        if ($TABLA_PRODUCTOS != null)
            $TABLA_PRODUCTOS.draw();
        else
            ConstruirTablaProducto();
    }
}

function OnChangeSeleccionarProducto(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteProducto(id))
            DATA_PRODUCTO.push(id);
    } else {
        var tamanoData = DATA_PRODUCTO.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_PRODUCTO[i] == id) {
                DATA_PRODUCTO.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteProducto(id) {
    var existe = false;
    var tamanoData = DATA_PRODUCTO.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_PRODUCTO[i] == id) {
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

    var tamanoProductos = DATA_PRODUCTO.length;
    if (tamanoProductos <= 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar minimo un Producto continuar.");
        return false;
    }

    var data = $(this).serializeObject();
    data["Productos"] = DATA_PRODUCTO;
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessForm(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
    if (result.state == true) {
        setTimeout(function () {
            window.location.href = '/Gestion/UsuarioCliente/Listar';
        }, 2000);
    }
}