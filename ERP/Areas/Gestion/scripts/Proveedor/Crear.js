/**
 * Variables Globales
 */
var DATA_OPCIONES = [];
var $TABLA_EMPRESA = null;
var DATA_EMPRESAS = [];
var $TABLA_EMPRESAS = null;
var CONTADOR_EMPRESAS = null;

$("#FechaConstitucion").datepicker({ maxDate: '0' });

function OnchangePais(e, urlDepartamentos) {
    var paisId = $(e).val();
    var parameters = {
        id: paisId
    };
    var $elementListDepartamentos = $("#ParDepartamentoId");
    Utils._GetDataDropDownList($elementListDepartamentos, urlDepartamentos, parameters);
}

function OnchangeDepartamento(e, url) {
    var deptoId = $(e).val();
    var parameters = {
        id: deptoId
    };
    var $elementList = $("#ParCiudadId");
    Utils._GetDataDropDownList($elementList, url, parameters);
}


/**
 * Guardar asociacion
 * @returns {boolean} 
 */
function GuardarAsociacion(e) {

    $(e).validate();

    var empresaId = $("#EmpresaId").val();
    var empresaNombre = $("#EmpresaId option:selected").text();
    var diaPago = $("#myoptio1:checked").val();
    if (!Validations._Requerido(empresaNombre)) {
        Utils._BuilderMessage("danger", "El campo Empresa no puede ser nulo.");
        return false;
    }
    if (!Validations._Requerido(diaPago)) {
        Utils._BuilderMessage("danger", "Debe escoger un dia de pago.");
        return false;
    }
    var tamanoDataEmpresas = DATA_EMPRESAS.length;
    for (var i = 0; i < tamanoDataEmpresas; i++) {
        if (DATA_EMPRESAS[i]["EmpresaNombre"] == empresaNombre) {
            Utils._BuilderMessage("danger", "Ya asocio esta empresa.");
            return false;
        }
    }
    
    var jsonEmpresa = {
        EmpresaId: empresaId,
        EmpresaNombre: empresaNombre,
        DiaPago: diaPago
    };

    DATA_EMPRESAS.push(jsonEmpresa);
    RecargarTablaEmpresas();
    CrearTablaEmpresa();


}

/**
 * Crear tabla empresas
 * @returns {} 
 */
function CrearTablaEmpresa() {
    console.info(DATA_EMPRESAS);
    $TABLA_EMPRESA = $("#tabla-empresas").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_EMPRESAS,
        //define the columns and set the data property for each column
        "columns": [
            {
                "data": "EmpresaNombre",
                "orderable": false
            },
            {
                "data": "DiaPago"
                
            },
            
            {
                "data": "id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarEmpresa(' + data + ')" >';
                }
            }
        ]
    });

}

function RecargarTablaEmpresas() {
    var tamanoDataEmpresas = DATA_EMPRESAS.length;
    for (var i = 0; i < tamanoDataEmpresas; i++) {
        DATA_EMPRESAS[i]["id"] = i;
    }
    if ($TABLA_EMPRESA != null) {
        $TABLA_EMPRESA.fnDestroy();
        CrearTablaEmpresa();
    }
}

/**
 * Eliminar empresa
 * @param {int} id 
 * @returns {} 
 */
function EliminarEmpresa(id) {
    var tamanoDataEmpresa = DATA_EMPRESAS.length;

    var posicionPregunta = 0;
    for (var i = 0; tamanoDataEmpresa > i; i++) {
        if (DATA_EMPRESAS[i]["id"] == id) {
            posicionEmpresa = i;
            break;
        }
    }

    DATA_EMPRESAS.splice(posicionEmpresa, 1);
    RecargarTablaEmpresas();

    CrearTablaEmpresa();
}

function OnBeginFormCrearProveedor(jqXHR, settings) {

    var tamanoDataEmpresas = DATA_EMPRESAS.length;
    if (tamanoDataEmpresas <= 0) {
        Utils._BuilderMessage("danger", "Debe adicionar minimo una asociación de empresa para continuar.");
        return false;
    }
    console.info(DATA_EMPRESAS);
    var data = $(this).serializeObject();
    data["Empresas"] = DATA_EMPRESAS;
    console.info(data);
    settings.data = jQuery.param(data);
    return true;

}

function OnSuccessFormCrearProveedor(result) {

    var tipoRespuesta = (result.state == true) ? "success" : "danger";

    if (result.state == true) {
        Utils._BuilderMessage(tipoRespuesta, result.message, "creacionExitosa");
    } else {
        Utils._BuilderMessage(tipoRespuesta, result.message);
    }
}

function creacionExitosa() {
    window.location = redireccion;
}