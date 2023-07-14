/**
 *  Variables globales
**/
var $TABLA_USUARIOS_DIRECTORES = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaDirectores();
    $("#form-filtro-tabla").submit(RecargarTablaUsuarioDirectores);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuarioDirectores() {
    if ($TABLA_USUARIOS_DIRECTORES != null) {
        $TABLA_USUARIOS_DIRECTORES.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuarioDirectores() {
    $("#input-filtro").val('');
    RecargarTablaUsuarioDirectores();
}

/**
 * Construir tabla
**/
function ConstruirTablaDirectores() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS_DIRECTORES = $("#tabla-usuarios-directores").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO_DIRECTOR,
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
            { "data": "NombreDirector" },
            { "data": "DocumentoDirector" },
            { "data": "UserNameDirector" },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-usuario" onchange="CambiarEstadoUsuarioDirector(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_DIRECTOR) ? botonEstado : "";
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

function CambiarEstadoUsuarioDirector(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_USUARIO_DIRECTOR,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuarioDirectores();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}