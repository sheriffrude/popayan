///Variables globales
var $TABLA_NOVEDADES = null;
var NOVEDAD = null;

//Onload page
$(function () {
    ConstruirTablaNovedades();
    $("#FechaInicial").datepicker();
    $("#FechaFinal").datepicker();
    $("#form-filtro-tabla").submit(RecargarTablaNovedades);
});

function RecargarTablaNovedades() {
    if ($TABLA_NOVEDADES != null) {
        $TABLA_NOVEDADES.draw();
    }
    return false;
}

function ConstruirTablaNovedades() {
    var $filtro = $("#input-filtro");
    $TABLA_NOVEDADES = $("#tabla-novedades").DataTable({
        "ajax": {
            "url": URL_LISTAR_NOVEDADES,
            "type": "POST",
            "data": function (d) {
                return $.extend({}, d, {
                    "adicional": {
                        filtroTipoNovedadId: $("#NovedadId").val(),
                        filtroFechaInicial: $("#FechaInicial").val(),
                        filtroFechaFinal: $("#FechaFinal").val(),
                    }
                });
            },
        },
        "columns": [
            { "data": "Novedad" },
            { "data": "Observaciones" },
            { "data": "FechaInicial" },
            { "data": "FechaFinal" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var botones = "";
                    var botonEditar = (PERMISO_EDITAR_NOVEDAD) ? '<a href="' + URL_EDITAR_NOVEDAD + '?novedadId=' + full.Id + '&empleadoId=' + full.EmpleadoId + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm m-5" data-execute-onload="OnLoadEditarEmpleadoNovedad">Editar</a>' : "";
                    var botonEliminar = (PERMISO_ELIMINAR_NOVEDAD) ? '<a href="#" onclick="ConfirmarEliminarNovedad(' + data + ')" class="btn btn-danger btn-sm" >Eliminar</a>' : "";
                    return botonEditar + botonEliminar;
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function ConfirmarEliminarNovedad(id) {
    NOVEDAD = id;
    Utils._BuilderConfirmation("Eliminar Novedad", "¿Esta seguro de eliminar la novedad?", "EliminarNovedad");
}

function EliminarNovedad() {
    if (typeof NOVEDAD === "undefined" || NOVEDAD == null) {
        Utils._BuilderMessage("danger", "Ocurrio un error, por favor vuelve a intentarlo.");
        return false;
    }

    var parametros = {
        id: NOVEDAD
    };
    $.ajax({
        url: URL_ELIMINAR_NOVEDAD,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            if (respuesta.state == true)
                Utils._BuilderMessage("success", respuesta.message);
            else
                Utils._BuilderMessage("danger", respuesta.message);
            RecargarTablaNovedades();
        },
        error(xhr, ajaxOptions, thrownError) {
            Utils._BuilderMessage("danger", thrownError);
        }
    });
}