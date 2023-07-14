var $DATA_UNIDADES_PORCENTAJE = [];
var $TABLA_UNIDADES_PORCENTAJE = null;
var COUNT_TABLA = 0;

/**
 * Función de inicio de  informacion salarial
 */
function initInformacionSalarial() {
    $DATA_UNIDADES_PORCENTAJE = [];
    $TABLA_UNIDADES_PORCENTAJE = null;
    COUNT_TABLA = 0;
    $("#registra-distribucion-salarial").hide();
    CrearTablaUnidadesPorcentaje();

}

/**
 * Evento al checkear si registra distribución de pago
 */
function clickDistribucionSalarial(e) {
    if ($('#DistribucionPago').is(':checked')) {
        $("#registra-distribucion-salarial").show();
    }
    else {
        $("#registra-distribucion-salarial").hide();
        $DATA_UNIDADES_PORCENTAJE = [];
        limpiaDistribucion();
        CrearTablaUnidadesPorcentaje();
    }
}
function limpiaDistribucion() {
    $("#ObservacionesSalario").val("");
    $("#EmpresaSalarioId").val("");
    $("#UnidadNegocioSalarioId").val("");
    $("#PorcentajeSalario").val("");
}

/**
 * Función que prepara los elemento a registrar
 * @param {any} jqXHR
 * @param {any} settings
 */
function obtenerInformacionSalarial() {
    var dataInfoSalarial = {};
    var elements = $(".info-salarial");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataInfoSalarial[elements[i].name] = elements[i].value;
        }
    }
    dataInfoSalarial["RegistroDistribucion"] = $('#DistribucionPago').is(':checked');
    if (dataInfoSalarial["RegistroDistribucion"]) {
        dataInfoSalarial["DistribucionSalarial"] = $DATA_UNIDADES_PORCENTAJE;
        dataInfoSalarial["TotalPorcentaje"] = PorcentajeTotal();
    }

    return dataInfoSalarial;
}

/**
 * Evento de selección de pais
 * @param {any} e
 */
function OnchangePaisInfoSalarial(e) {
    var pais = $(e).val();
    if (pais > 0) {
        var parameters = {
            id: pais
        };
        var $elementList = $("#DepartamentoSalarioId");
        Utils._GetDropDownList($elementList, URL_CONSULTAR_DEPARTAMENTOS_PAIS, parameters);
    }
}

/**
 * Evento de selección de pais
 * @param {any} e
 */
function OnchangeDeptoInfoSalarial(e) {
    var depto = $(e).val();
    if (depto > 0) {
        var parameters = {
            id: depto
        };
        var $elementList = $("#CiudadSalarioId");
        Utils._GetDropDownList($elementList, URL_CONSULTAR_CIUDADES_DEPARTAMENTO, parameters);
    }
}

/**
 * Evento de selección de pais
 * @param {any} e
 */
function OnchangeMpioInfoSalarial(e) {
    var empresa = $(e).val();
    if (empresa > 0) {
        var parameters = {
            id: empresa
        };
        var $elementList = $("#EmpresaSalarioId");
        Utils._GetDropDownList($elementList, URL_CONSULTAR_EMPRESAS_CIUDAD, parameters);
    }
}

/**
 * Evento de selección de empresa
 * @param {any} e
 */
function OnchangeEmpresaInfoSalarial(e) {
    var unidadNegocioId = $(e).val();
    if (unidadNegocioId > 0) {
        var parameters = {
            id: unidadNegocioId
        };
        var $elementList = $("#UnidadNegocioSalarioId");
        Utils._GetDropDownList($elementList, URL_CONSULTAR_UNIDADES_NEGOCIO_EMPRESA, parameters);
    }
}

/**
 * Agrega correo al listado temporal
 */
function agregarUnidadPorcentaje() {
    var empresa = $("#EmpresaSalarioId").val();
    var porcentaje = $("#PorcentajeSalario").val();
    var unidadNegocio = $("#UnidadNegocioSalarioId").val().trim().length;
    if (empresa <= 0 || porcentaje.length <= 0 || unidadNegocio <= 0) {
        Utils._BuilderMessage('info', 'Debe registrar la empresa, la unidad de negocio y el porcentaje');
        return;
    }
    var countUnidades = $DATA_UNIDADES_PORCENTAJE.length;
    var cantidadPorcentaje = porcentaje != "" ? parseFloat(porcentaje) : 0;
    for (var i = 0; i < countUnidades; i++) {
        if ($DATA_UNIDADES_PORCENTAJE[i]['UnidadNegocioId'] == unidadNegocio && $DATA_UNIDADES_PORCENTAJE[i]['EmpresaId'] == empresa) {
            Utils._BuilderMessage('info', 'La unidad de negocio y empresa ya fueron seleccionados. Cambie e intente nuevamente');
            return false;
        }
        cantidadPorcentaje += parseFloat($DATA_UNIDADES_PORCENTAJE[i]["Porcentaje"]);
        if (cantidadPorcentaje > 100) {
            Utils._BuilderMessage('info', 'El porcentaje ingresado no puede superar el 100%. Verifique e intente nuevamente');
            return false;
        }
    }
    var jsonUnidades = {
        Pais: $("#PaisSalarioId").find('option:selected').text(),
        Departamento: $("#DepartamentoSalarioId").find('option:selected').text(),
        Ciudad: $("#CiudadSalarioId").find('option:selected').text(),
        EmpresaId: $("#EmpresaSalarioId").val(),
        Empresa: $("#EmpresaSalarioId").find('option:selected').text(),
        UnidadNegocioId: $("#UnidadNegocioSalarioId").val(),
        UnidadNegocio: $("#UnidadNegocioSalarioId").find('option:selected').text(),
        Porcentaje: $("#PorcentajeSalario").val(),
        Id: COUNT_TABLA
    };

    $DATA_UNIDADES_PORCENTAJE.push(jsonUnidades);

    if ($TABLA_UNIDADES_PORCENTAJE != null)
        $TABLA_UNIDADES_PORCENTAJE = null;

    CrearTablaUnidadesPorcentaje();
    limpiaDistribucion();
    COUNT_TABLA++;
}

/**
 * Evento que crea por jquery la tabla temporal de correos
 */
function CrearTablaUnidadesPorcentaje() {
    $TABLA_UNIDADES_PORCENTAJE = $("#tabla-unidades-porcentaje").dataTable({
        "bFilter": false,
        "bLengthChange": false,
        "destroy": true,
        "serverSide": false,
        "data": $DATA_UNIDADES_PORCENTAJE,
        "columns": [
            { "data": "EmpresaId", "visible": false },
            { "data": "Empresa" },
            { "data": "UnidadNegocioId", "visible": false },
            { "data": "UnidadNegocio" },
            { "data": "Porcentaje" },
            {
                "data": "UnidadNegocioId",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarUnidadPorcentaje(' + data + ')" >';
                }
            }
        ]
    });
}

function PorcentajeTotal() {
    var countUnidades = $DATA_UNIDADES_PORCENTAJE.length;
    var cantidadPorcentaje = 0;
    for (var i = 0; i < countUnidades; i++) {
        cantidadPorcentaje += parseFloat($DATA_UNIDADES_PORCENTAJE[i]["Porcentaje"]);
    }
    return cantidadPorcentaje;
}

function EliminarUnidadPorcentaje(id) {
    var longitudUnidadesPorcentaje = $DATA_UNIDADES_PORCENTAJE.length;
    for (var i = 0; longitudUnidadesPorcentaje > i; i++) {
        if ($DATA_UNIDADES_PORCENTAJE[i]["UnidadNegocioId"] == id) {
            $DATA_UNIDADES_PORCENTAJE.splice(i, 1);
            break;
        }
    }
    if ($TABLA_UNIDADES_PORCENTAJE != null)
        $TABLA_UNIDADES_PORCENTAJE.fnDestroy();
    CrearTablaUnidadesPorcentaje();
}
