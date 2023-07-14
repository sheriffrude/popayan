/**
 *  Variables globales
**/
var $TABLA_USUARIOS = null;

/**
 * Onload page
**/
$(function () {
    ConstruirTablaUsuarios();
    $("#form-filtro-tabla").submit(RecargarTablaUsuarios);
});

/**
 * Recargar tabla
**/
function RecargarTablaUsuarios() {
    if ($TABLA_USUARIOS != null) {
        $TABLA_USUARIOS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaUsuarios() {
    $("#input-filtro").val('');
    RecargarTablaUsuarios();
}

/**
 * Construir tabla
**/
function ConstruirTablaUsuarios() {
    var $filtro = $("#input-filtro");
    $TABLA_USUARIOS = $("#tabla-usuarios").DataTable({
        "ajax": {
            "url": URL_LISTAR_USUARIO,
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
            { "data": "Rol" },
            { "data": "EsDirector" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_USUARIO)
                        ? '<a href="' + URL_EDITAR_USUARIO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (PERMISO_LISTAR_USUARIO_PERMISO)
                        ? '<a href="' + URL_PERMISO_USUARIO + '?id=' + data + '" class="btn btn-secondary btn-sm" >Permisos</a>'
                        : "";
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}