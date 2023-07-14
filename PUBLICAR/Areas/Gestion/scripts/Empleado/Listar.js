/**
 * Variables globales
 */
var $TABLA_EMPLEADOS = null;
var $TABLA_PROSPECTOS = null;
var FILTRO_UNIDAD_NEGOCIO_ID = 0;
var FILTRO_AREA_ID = 0;
var FILTRO_CARGO_ID = 0;

/**
 * OnLoad Page
 */
$(function () {
    ConstruirTablaEmpleado();
    $("#form-filtro-tabla").submit(RecargarTablaEmpleado);

    $("#tabs-empleados-prospectos a").on("click", function () { OnClickTab(this) });
});

/**
 * OnClickTab
 * @param {any} e
 */
function OnClickTab(e) {
    //e.preventDefault();
    var tab = $(e).attr("data-number-tab");
    if (tab == 2) {
        if ($TABLA_PROSPECTOS == null)
            ConstruirTablaProspectos()
    }
}

/**
 * RecargarTablaEmpleado
 */
function RecargarTablaEmpleado() {
    if ($TABLA_EMPLEADOS != null) {
        $TABLA_EMPLEADOS.draw();
    }
    return false;
}

/**
 * ConstruirTablaEmpleado
 */
function ConstruirTablaEmpleado() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPLEADOS = $("#tabla-empleados").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_LISTAR_EMPLEADO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                        filtroUnidadNegocioId: FILTRO_UNIDAD_NEGOCIO_ID,
                        filtroAreaId: FILTRO_AREA_ID,
                        filtroCargoId: FILTRO_CARGO_ID
                    }
                });
            },
        }, "columns": [
            {
                "data": "Documento"
            },
            {
                "data": "NombreCompleto",
                "render": function (data, type, full, meta) {
                    return (PERMISO_VER_EMPLEADO == true)
                        ? '<a href="' + URL_VER_EMPLEADO + '?id=' + full.Id + '" class= "btn btn-secondary" >' + data + '</a>'
                        : data;
                }
            },
            {
                "data": "Cargo"
            },
            {
                "data": "FechaIngreso"
            },
            {
                "data": "FechaRetiro"
            },
            {
                "data": "UnidadNegocio"
            },
            {
                "data": "Area"
            },
            {
                "data": "Estado",
                "render": function (data, type, full, meta) {
                    return (data == true) ? "Activo" : "Inactivo";
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    if (PERMISO_RETIRAR_EMPLEADO == true && full.Estado == true)
                        return '<a href="' + URL_RETIRAR_EMPLEADO + '?id=' + data + '" data-toggle="modal" data-target="#" data-execute-onload="OnLoadRetirar" class="btn btn-danger btn-sm" >Retirar</a>';
                    else if (PERMISO_REINTEGRAR_EMPLEADO == true && full.Estado == false)
                        return '<a href="' + URL_REINTEGRAR_EMPLEADO + '?id=' + data + '" data-toggle="modal" data-target="#" data-execute-onload="OnLoadReintegrar" class="btn btn-success btn-sm" >Reintegrar</a>';
                    return null;
                }
            },
            /*
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return '<a href="' + URL_FLUJO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Flujo</a>';
                }
            },
            */
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

/**
 * Evento de selección de unidad de negocio
 * @param {any} e
 */
function OnchangeUnidadNegocioInfoLaboral(e) {
    var areaData = $("#AreaAuxId").val();
    var unidadNegocioId = $(e).val();
    if (unidadNegocioId > 0) {
       
        var parameters = {
            id: unidadNegocioId
        };
        var $elementList = $("#AreaId");
        Utils._GetDropDownList($elementList, URL_CAMBIO_UNIDAD_NEGOCIO, parameters, true, areaData);

        FILTRO_UNIDAD_NEGOCIO_ID = unidadNegocioId;
        if ($TABLA_EMPLEADOS != null) {
            $TABLA_EMPLEADOS.draw();
        }
    }
}


function OnChangeArea(e) {
    var id = $(e).val();
    if (typeof id === "undefined" || id === "") {
        id = 0;
    }

    FILTRO_AREA_ID = id;

    if ($TABLA_EMPLEADOS != null) {
        $TABLA_EMPLEADOS.draw();
    }
}


function OnChangeCargo(e) {
    var id = $(e).val();
    if (typeof id === "undefined" || id === "") {
        id = 0;

    }
    FILTRO_CARGO_ID = id;

    if ($TABLA_EMPLEADOS != null) {
        $TABLA_EMPLEADOS.draw();
    }
}