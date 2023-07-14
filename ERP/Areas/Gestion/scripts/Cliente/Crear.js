/**
 * Variables Globales
 */
var DATA_EMPRESAS = [];
var $TABLA_EMPRESAS = null;

$(function () {
    CrearTablaEmpresa();
    $("#FechaAniversario").datepicker();
});

/**
 * OnchangePais
 * @param {any} e
 * @param {any} urlDepartamentos
 */
function OnchangePais(e, urlDepartamentos) {
    var paisId = $(e).val();
    var parameters = {
        id: paisId
    };
    var $elementListDepartamentos = $("#DepartamentoId");
    Utils._GetDataDropDownList($elementListDepartamentos, urlDepartamentos, parameters);
}

/**
 * OnchangeDepartamento
 * @param {any} e
 * @param {any} url
 */
function OnchangeDepartamento(e, url) {
    var deptoId = $(e).val();
    var parameters = {
        id: deptoId
    };
    var $elementList = $("#CiudadId");
    Utils._GetDataDropDownList($elementList, url, parameters);
}

/**
 * Guardar asociacion
 * @returns {boolean} 
 */
function GuardarAsociacion(dataJson) {
    DATA_EMPRESAS.push(dataJson);

    if ($TABLA_EMPRESA != null)
        $TABLA_EMPRESA = null;

    CrearTablaEmpresa();
    return true;
}

/**
 * Crear tabla Empresas
 * @returns {} 
 */
function CrearTablaEmpresa() {
    $TABLA_EMPRESA = $("#tabla-empresas").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_EMPRESAS,
        "columns": [
            { "data": "Nombre" },
            { "data": "Identificador" },
            {
                "data": "EmpresaId",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="Eliminar" onclick="EliminarEmpresa(' + data + ')" >';
                }
            }
        ]
    });
}

/**
 * Eliminar empresa
 * @param {int} id 
 * @returns {} 
 */
function EliminarEmpresa(id) {
    var longitudDataEmpresa = DATA_EMPRESAS.length;

    for (var i = 0; longitudDataEmpresa > i; i++) {
        if (DATA_EMPRESAS[i]["EmpresaId"] == id) {
            DATA_EMPRESAS.splice(i, 1);
            break;
        }
    }

    if ($TABLA_EMPRESAS != null)
        $TABLA_EMPRESAS.fnDestroy();

    CrearTablaEmpresa();
}

/**
 * OnBeginCrearCliente
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearCliente(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["Empresas"] = DATA_EMPRESAS;
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCrearCliente
 * @param {any} response
 */
function OnCompleteCrearCliente(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (!Validations._IsNull(data)) {
        if (data.state == true)
            Utils._BuilderMessage("success", data.message, RedireccionarListarClientes);
        else
            Utils._BuilderMessage("danger", data.message);
    }
}

/**
 * RedireccionarListarClientes
 */
function RedireccionarListarClientes() {
    window.location.href = URL_LISTAR_EMPRESA_IMPUESTO;
}