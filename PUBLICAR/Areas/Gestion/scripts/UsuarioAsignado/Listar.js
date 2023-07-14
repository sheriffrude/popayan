/**
 *  Variables globales
**/
var $TABLA_USUARIOS_ASIGNADOS = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaAsignados();
    $("#form-filtro-tabla").submit(RecargarTablaUsuarioAsignados);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuarioAsignados() {
    if ($TABLA_USUARIOS_ASIGNADOS != null) {
        $TABLA_USUARIOS_ASIGNADOS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuarioAsignado() {
    $("#input-filtro").val('');
    RecargarTablaUsuarioAsignados();
}

/**
 * Construir tabla
**/
function ConstruirTablaAsignados() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS_ASIGNADOS = $("#tabla-usuarios-asignados").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO_ASIGNADO,
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
            { "data": "NombreAsignado" },
            { "data": "DocumentoAsignado" },
            { "data": "UserNameAsignado" },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-usuario" onchange="CambiarEstadoUsuarioAsignado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_ASIGNADO) ? botonEstado : "";
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

function CambiarEstadoUsuarioAsignado(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_USUARIO_ASIGNADO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuarioAsignados();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}