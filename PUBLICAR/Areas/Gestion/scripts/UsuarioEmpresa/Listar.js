/**
 *  Variables globales
**/
var $TABLA_USUARIOS_EMPRESAS = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaEmpresas();
    $("#form-filtro-tabla").submit(RecargarTablaUsuarioEmpresas);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuarioEmpresas() {
    if ($TABLA_USUARIOS_EMPRESAS != null) {
        $TABLA_USUARIOS_EMPRESAS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuariosEmpresa() {
    $("#input-filtro").val('');
    RecargarTablaUsuarioEmpresas();
}

/**
 * Construir tabla
**/
function ConstruirTablaEmpresas() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS_EMPRESAS = $("#tabla-usuarios-empresas").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO_EMPRESA,
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
            { "data": "Empresa" },
            { "data": "Nit" },
            {
                "data": "Defecto",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Si') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-defecto" onchange="CambiarEmpresaPorDefecto(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_EMPRESA) ? botonEstado : "";
                    return resultado;
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (data == 'Activado') ? "checked" : "";
                    var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-empresa" onchange="CambiarEstadoUsuarioEmpresa(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_USUARIO_EMPRESA) ? botonEstado : "";
                    return resultado;
                }
            },
        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-empresa").bootstrapToggle({
                on: '',
                off: ''
            });
            $(".boton-desactivar-defecto").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function CambiarEstadoUsuarioEmpresa(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        estado: estado
    };
    $.ajax({
        url: URL_EDITAR_USUARIO_EMPRESA,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuarioEmpresas();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}

function CambiarEmpresaPorDefecto(e) {
    var defecto = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        id: id,
        defecto: defecto
    };
    $.ajax({
        url: URL_EDITAR_EMPRESA_DEFECTO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
            RecargarTablaUsuarioEmpresas();
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}