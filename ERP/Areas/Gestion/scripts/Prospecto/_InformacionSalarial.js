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
    }
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
    if (dataInfoSalarial["RegistroDistribucion"]) dataInfoSalarial["DistribucionSalarial"] = $DATA_UNIDADES_PORCENTAJE;
    return dataInfoSalarial;
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
    if (empresa <= 0 || porcentaje.length <= 0) {
        Utils._BuilderMessage('info', 'Debe seleccionar la empresa y el porcentaje');
        return false;
    }
    var unidadDeNegocio = $("#UnidadNegocioId").val();

    var countUnidades = $DATA_UNIDADES_PORCENTAJE.length;
    for (var i = 0; i < countUnidades; i++) {
        if ($DATA_UNIDADES_PORCENTAJE[i]['UnidadNegocioId'] == unidadDeNegocio) {
            Utils._BuilderMessage('info', 'Esta unidad de negocio ya se encuentra en el listado');
            return false;
        }
    }
    var jsonUnidades = {
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
    $("#EmpresaSalarioId").val("");
    $("#UnidadNegocioSalarioId").val("");
    $("#PorcentajeSalario").val("");
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
            { "data": "Empresa" },
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

function actualizarTotalSalarial() {
    var salario = parseInt($("#ValorSalario").val());
    var beneficio = parseInt($("#ValorBeneficioPrestacional").val());
    var alimentacion = parseInt($("#BonosAlimentacion").val());
    var otros = parseInt($("#Otros").val());
    var auxilioTransporte = parseInt($("#AuxilioTransporte").val());
    var total = 0;
    if (!isNaN(salario)) total += salario;
    if (!isNaN(beneficio)) total += beneficio;
    if (!isNaN(alimentacion)) total += alimentacion;
    if (!isNaN(otros)) total += otros;
    if (!isNaN(auxilioTransporte)) total += auxilioTransporte;
    $("#ValorTotal").val(total);

}