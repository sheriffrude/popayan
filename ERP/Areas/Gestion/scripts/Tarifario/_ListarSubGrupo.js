/**
 * Variables globales
 */
var $TABLA_TARIFARIO_SUBGRUPO = null;
var $FORM_FILTRO_TABLA_SUBGRUPO = null;

/**
 * Onload page
 */
$(function () {

    $FORM_FILTRO_TABLA_SUBGRUPO = $("#form-filtro-tabla-subgrupo");

    $FORM_FILTRO_TABLA_SUBGRUPO.on("submit", FiltrarTablaTarifarioSubGrupo);

    ConstruirTablaTarifarioSubGrupo();

    
});

/**
 * Filtrar tabla tarifario subgrupo
 * @returns {boolean} 
 */
function FiltrarTablaTarifarioSubGrupo() {
    if ($TABLA_TARIFARIO_SUBGRUPO != null) {
        $TABLA_TARIFARIO_SUBGRUPO.draw();
    }
    return false;
}


/**
 * Construye tabla de subgrupo
 */
function ConstruirTablaTarifarioSubGrupo() {
    var $filtro = $FORM_FILTRO_TABLA_SUBGRUPO.find("input[type=search]");
    $TABLA_TARIFARIO_SUBGRUPO = $("#tabla-tarifario-subgrupo").DataTable({
        "ajax": {
            "url": URL_LISTAR_TARIFARIO_SUBGRUPO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                        EmpresaId: $("#EmpresaId").val()
                    }
                });
            }
        },
        "columns": [
            { "data": "NombreGrupo" },
            { "data": "SubNombre" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {

                    var botonEditar = '<a href="' + URL_EDITAR_TARIFARIO_SUBGRUPO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                    var botonEliminar = '<button onclick="EliminarEmpresaImpuesto(' + data + ')" class="btn btn-danger btn-sm " >ELIMINAR</button>'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_TARIFARIO_SUBGRUPO) ? botonEditar : "";
                    resultado += (PERMISO_ELIMINAR_TARIFARIO_SUBGRUPO) ? botonEliminar : "";
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
 * Eliminar subgrupo
 * @param {int} id 
 */
function EliminarSubGrupo(id) {
    var parameters = {
        id: id
    };

    $.ajax({
        url: URL_ELIMINAR_TARIFARIO_SUBGRUPO,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            if ($TABLA_TARIFARIO_SUBGRUPO != null) {
                $TABLA_TARIFARIO_SUBGRUPO.draw();
            }
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}