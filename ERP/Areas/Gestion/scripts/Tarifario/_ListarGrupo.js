/**
 * Variables globales
 */
var $TABLA_TARIFARIO_GRUPO = null;
var $FORM_FILTRO_TABLA_GRUPO = null;

/**
 * Onload page
 */
$(function () {
    $FORM_FILTRO_TABLA_GRUPO = $("#form-filtro-tabla-grupo");

    $FORM_FILTRO_TABLA_GRUPO.on("submit", FiltrarTablaTarifarioGrupo);

    ConstruirTablaTarifarioGrupo();
});

/**
 * Filtrar tabla tarifario grupo
 * @returns {boolean} 
 */
function FiltrarTablaTarifarioGrupo() {
    if ($TABLA_TARIFARIO_GRUPO != null) {
        $TABLA_TARIFARIO_GRUPO.draw();
    }
    return false;
}

/**
 * Construye tabla de grupos
 */
function ConstruirTablaTarifarioGrupo() {
    var $filtro = $FORM_FILTRO_TABLA_GRUPO.find("input[type=search]");
    $TABLA_TARIFARIO_GRUPO = $("#tabla-tarifario-grupo").DataTable({
        "ajax": {
            "url": URL_LISTAR_TARIFARIO_GRUPO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "Nombre" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {

                    var botonEditar = '<a href="' + URL_EDITAR_TARIFARIO_GRUPO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                    var botonEliminar = '<button onclick="EliminarGrupo(' + data + ')" class="btn btn-danger btn-sm " >ELIMINAR</button>'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_TARIFARIO_GRUPO) ? botonEditar : "";
                    resultado += (PERMISO_ELIMINAR_TARIFARIO_GRUPO) ? botonEliminar : "";
                    return resultado;
                }


            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

/**
 * Eliminar grupo
 * @param {int} id 
 */
function EliminarGrupo(id) {
    var parameters = {
        id: id
    };

    $.ajax({
        url: URL_ELIMINAR_TARIFARIO_GRUPO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            if ($TABLA_TARIFARIO_GRUPO != null) {
                $TABLA_TARIFARIO_GRUPO.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}