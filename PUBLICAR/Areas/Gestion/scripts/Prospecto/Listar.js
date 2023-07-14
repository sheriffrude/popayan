
var FILTRO_UNIDAD_NEGOCIO_PROS_ID = 0;
var FILTRO_AREA_PROS_ID = 0;

//Onload page
$(function () {
});

/**
 * Recargar tabla prospectos
 */
function RecargarTablaProspectos() {
    if ($TABLA_PROSPECTOS != null) {
        $TABLA_PROSPECTOS.draw();
    }
    return false;
}

function ConstruirTablaProspectos() {
    var $filtroProspecto = $("#input-filtro-prospectos");
    $TABLA_PROSPECTOS = $("#tabla-prospectos").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_LISTAR_PROSPECTOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtroProspecto.val();
                return $.extend({}, d, {
                    "adicional": {
                        filtroUnidadNegocioId: FILTRO_UNIDAD_NEGOCIO_PROS_ID,
                        filtroAreaId: FILTRO_AREA_PROS_ID,
                    }
                });
            },
        }, "columns": [
            { "data": "Nombre", "width": "20%" },
            { "data": "TipoDocumento", "width": "20%" },
            { "data": "Documento", "width": "20%" },
            { "data": "Sexo", "width": "20%" },
            { "data": "Telefono", "width": "20%" },
            { "data": "Celular", "width": "20%" },
            { "data": "Cargo", "width": "20%" },
            { "data": "ModalidadPago", "width": "20%" },
            { "data": "Salario", "width": "20%" },
        {
            "data": "Id",
            "width": "20%",
            "orderable": false,
            "searchable": false,
            "render": function (data, type, full, meta) {
                var botones = "";
                var botonEditar = (PERMISO_EDITAR_PROSPECTO) ? '<a href="' + URL_EDITAR_PROSPECTO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm m-5" >Editar</a>' : "";
                var botonDetalle = (PERMISO_VER_CUADRO_COSTOS) ? '<a href="' + URL_VER_CUADRO_COSTOS + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm m-5" >Ver cuadro costos</a>' : "";
                return botonEditar + botonDetalle;
            }
        },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function EliminarProspecto(id) {
    var parametros = {
        Id: id,
        EmpresaId: $("#EmpresaId").val()
    };
    $.ajax({
        url: URL_ELIMINAR_PROSPECTO,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            if (respuesta.state == true) {
                Utils._BuilderMessage("success", respuesta.message);
                RecargarTablaProspectos();
            } else {
                Utils._BuilderMessage("danger", respuesta.message);
            }
        }
    });
}

/**
 * Evento de selección de unidad de negocio
 * @param {any} e
 */
function OnchangeUnidadNegocioProspecto(e) {
    var areaData = $("#AreaAuxId").val();
    var unidadNegocioId = $(e).val();
    if (unidadNegocioId > 0) {

        var parameters = {
            id: unidadNegocioId
        };
        var $elementList = $("#AreaProspectoId");
        Utils._GetDropDownList($elementList, URL_CAMBIO_UNIDAD_NEGOCIO, parameters, true, areaData);

        FILTRO_UNIDAD_NEGOCIO_PROS_ID = unidadNegocioId;
        if ($TABLA_EMPLEADOS != null) {
            $TABLA_PROSPECTOS.draw();
        }
    }
}

/**
 * 
 * @param {any} e
 */
function OnChangeAreaProspecto(e) {
    var id = $(e).val();
    if (typeof id === "undefined" || id === "") {
        id = 0;
    }

    FILTRO_AREA_PROS_ID = id;

    if ($TABLA_PROSPECTOS != null) {
        $TABLA_PROSPECTOS.draw();
    }
}
