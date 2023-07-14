/**
 *  Variables globales
**/
var $TABLA_USUARIOS_PERMISOS = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaUsuariosPermisos();
    $("#form-filtro-tabla").submit(RecargarTablaUsuariosPermisos);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuariosPermisos() {
    if ($TABLA_USUARIOS_PERMISOS != null) {
        $TABLA_USUARIOS_PERMISOS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuariosPermisos() {
    $("#input-filtro").val('');
    RecargarTablaUsuariosPermisos();
}

/**
 * Construir tabla
**/
function ConstruirTablaUsuariosPermisos() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS_PERMISOS = $("#tabla-usuarios-permisos").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO_PERMISO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "Estado" },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-usuario" onchange="CambiarEstadoUsuario(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_PERMISO) ? botonEstado : "";
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

function CambiarEstadoUsuario(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_USUARIO_PERMISO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuariosPermisos();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}