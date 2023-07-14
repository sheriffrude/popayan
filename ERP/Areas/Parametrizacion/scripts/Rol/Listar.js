//Variable Globales
var $TABLA_ROLES = null;

/**
 * Onload page
 */
$(function () {
    ConstruirTablaRoles();
    $("#form-filtro-tabla").submit(RecargarTablaRoles);
});

/**
 * Function para filtrar la tabla Paises
 * @returns {boolean} false
 */
function RecargarTablaRoles() {
    if ($TABLA_ROLES != null) {
        $TABLA_ROLES.draw();
    }
    return false;
}

/**
 * RecargarTablaRolesPage
 */
function RecargarTablaRolesPage() {
    if ($TABLA_ROLES != null) {
        $TABLA_ROLES.draw("page");
    }
    return false;
}

/**
 * Function para resetear la tabla Paises
 * @returns {boolean} false
 */
function ResetearTablaRoles() {
    $("#input-filtro").val('');
    RecargarTablaRoles();
}

/**
 * Funcion para construir la tabla Paises
 */
function ConstruirTablaRoles() {
    var $filtro = $("#input-filtro");
    $TABLA_ROLES = $("#tabla-roles").DataTable({
        "ajax": {
            "url": URL_LISTAR_ROLES,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_ROL)
                        ? '<a href="' + URL_EDITAR_ROL + '/' + data + '" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    return '<input type="checkbox" ' + checked + ' class="boton-desactivar-rol" onchange="CambiarEstadoRol(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'
                }
            }
        ],
        "drawCallback": function (settings) {
            //Utils._BuilderModal();
            $(".boton-desactivar-rol").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

/**
 * CambiarEstadoRol
 * @param {any} e
 */
function CambiarEstadoRol(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };

    RequestHttp._Post(URL_CAMBIAR_ESTADO_ROL, parameters, null, function (data) {
        if (!Validations._IsNull(data)) {
            var tipoMensaje = "danger";
            if (data.state) {
                tipoMensaje = "success";
                RecargarTablaRolesPage();
            }
            Utils._BuilderMessage(tipoMensaje, data.message);
        }
    });
}