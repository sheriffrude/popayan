/**
 *  Variables globales
**/
var $TABLA_USUARIOS_CLIENTES = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaClientes();
    $("#form-filtro-tabla").submit(RecargarTablaUsuarioClientes);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuarioClientes() {
    if ($TABLA_USUARIOS_CLIENTES != null) {
        $TABLA_USUARIOS_CLIENTES.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuariosCliente() {
    $("#input-filtro").val('');
    RecargarTablaUsuarioClientes();
}

/**
 * Construir tabla
**/
function ConstruirTablaClientes() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS_CLIENTES = $("#tabla-usuarios-clientes").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO_CLIENTE,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "Documento" },
            { "data": "UserName" },
            { "data": "Cliente" },
            { "data": "Nit" },
            { "data": "Producto" },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-usuario" onchange="CambiarEstadoUsuarioCliente(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_CLIENTE) ? botonEstado : "";
                    return resultado;
                }
            },
        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-usuario").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function CambiarEstadoUsuarioCliente(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_USUARIO_CLIENTE,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuarioClientes();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}