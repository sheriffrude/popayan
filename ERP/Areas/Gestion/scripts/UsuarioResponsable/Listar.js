/**
 *  Variables globales
**/
var $TABLA_USUARIOS_RESPONSABLES = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaUsuarioResponsables();
    $("#form-filtro-tabla").submit(RecargarTablaUsuarioResponsable);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuarioResponsable() {
    if ($TABLA_USUARIOS_RESPONSABLES != null) {
        $TABLA_USUARIOS_RESPONSABLES.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuariosResponsable() {
    $("#input-filtro").val('');
    RecargarTablaUsuarioResponsable();
}

/**
 * Construir tabla
**/
function ConstruirTablaUsuarioResponsables() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS_RESPONSABLES = $("#tabla-usuarios-responsables").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO_RESPONSABLE,
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
            { "data": "DepartamentoTrafico" },
            { "data": "Estado" },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-usuario" onchange="CambiarEstadoUsuarioResponsable(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_RESPONSABLE) ? botonEstado : "";
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

function CambiarEstadoUsuarioResponsable(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_USUARIO_RESPONSABLE,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuarioResponsable();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}