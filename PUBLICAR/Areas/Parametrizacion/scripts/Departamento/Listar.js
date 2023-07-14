/**
 * Variables Globales
**/
var $TABLA_DEPARTAMENTOS = null;

/**
 * OnLoad Page
**/
$(function () {
    ConstruirTablaDepartamentos();
    $("#form-filtro-tabla").submit(RecargarTablaDepartamentos);
});

/**
 * Recargar tabla
**/
function RecargarTablaDepartamentos() {
    if ($TABLA_DEPARTAMENTOS != null) {
        $TABLA_DEPARTAMENTOS.draw();
    }
    return false;
}

/**
 * Function para resetear la tabla
 * @returns {boolean} false
 */
function ResetearTablaDepartamento() {
    $("#input-filtro").val('');
    RecargarTablaDepartamentos();
}

/**
 * Construir tabla
**/
function ConstruirTablaDepartamentos() {
    var $filtro = $("#input-filtro");
    $TABLA_DEPARTAMENTOS = $("#tabla-departamentos").DataTable({
        "ajax": {
            "url": URL_LISTAR_DEPARTAMENTO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            { "data": "Pais", },
            {
                "data": "Estado",
                "render": function (data, type, full, meta) {
                    return (data == 1)
                        ? 'Activo'
                        : "Inactivo";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_DEPARTAMENTO)
                    ? '<a href="' + URL_EDITAR_DEPARTAMENTO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                    : "";
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}