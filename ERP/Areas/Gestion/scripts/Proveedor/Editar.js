/**
 * Variables Globales
 */
var $TABLA_EMPRESA = null;
var DATA_EMPRESAS = [];
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
    
    //var $form = $(e);
    //$form[0].reset();

    CrearTablaEmpresa();
    return false;
}



/**
 * Cargar Empresas asociadas o agregar empresas
 */
$(function () {
    CrearTablaEmpresa();
   

});

function CrearTablaEmpresa() {

    var id = $("#Id").val();
    $TABLA_EMPRESA = $("#tabla-empresas").DataTable({
        "bDestroy":true,
        "ajax": {
            "url": URL_LISTAR_EMPRESAS_ASOCIADAS_PROVEEDOR,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = null;
                d.id = id;
                return $.extend({}, d, {
                    "adicional": {
                    }
                });
            }
        },
        "columns": [
            { "data": "NombreEmpresa" },
            {"data": "DiaPago",
                "orderable": false,
                "searchable": false,
                "width": "10%",
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
             {
                 "data": "AsociacionId",
                 "orderable": false,
                 "searchable": false,
                 "width": "6%",
                 "render": function (data, type, full, meta) {
                     return '<a href="'+URL_EDITAR_ASOCIACION_EMPRESA_PROVEEDOR+'?id='+data+'" data-toggle="modal" data-target="#"><input type="button" value="Editar" class="btn btn-secondary"></a>';
                 }
             },
            {
                "data": "AsociacionId",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    return '<input type="checkbox" ' + checked + '  class="boton-desactivar-AsociacionEmpresa" onchange="CambiarEstadoAsociacionEmpresa(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">';
                }
            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
            $(".boton-desactivar-AsociacionEmpresa").bootstrapToggle({
                on: '',
                off: ''
            });
        }
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


function OnBeginFormEditarProveedor(jqXHR, settings) {
    var tamanoDataEmpresas = DATA_EMPRESAS.length;
   
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessFormEditarProveedor(result) {

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

//CAMBIA ESTADO DE ASOCIACION EMPRESA/PROVEEDOR

function CambiarEstadoAsociacionEmpresa(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };
    RequestHttp._Post(URL_CAMBIAR_ESTADO_ASOCIACION_EMPRESA, parameters, null, function (response) {
        if (!Validations._IsNull(response)) {
            var tipoRespuesta = (response.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, response.message);
            CrearTablaEmpresa();
        }
    });
}

function OnBeginFormAsociarEmpresaProveedor(jqXHR, settings) {
    var empresaId = $("#EmpresaId").val();
    var diaPago = $("#myoptio1:checked").val();
    if (!Validations._Requerido(empresaId)) {
        Utils._BuilderMessage("danger", "El campo Empresa no puede ser nulo.");
        return false;
    }
    if (!Validations._Requerido(diaPago)) {
        Utils._BuilderMessage("danger", "Debe escoger un dia de pago.");
        return false;
    }
    var data = $(this).serializeObject();
    data['DiaPago'] = diaPago;
    data['EmpresaId'] = empresaId;
    data['Id'] = $("#Id").val();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessFormAsociarEmpresaProveedor(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message, );
    Utils._CloseModal();
    
        CrearTablaEmpresa();
    
}



function OnBeginFormEditarAsociacionEmpresaProveedor(jqXHR, settings) {
    var empresaId = $("#EmpresaId").val();
    var diaPago = $("#myoptio1:checked").val();
    if (!Validations._Requerido(diaPago)) {
        Utils._BuilderMessage("danger", "Debe escoger un dia de pago.");
        return false;
    }
    var data = $(this).serializeObject();
    data['Dias'] = diaPago;
    data['AsociacionId'] = $("#AsociacionId").val();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessFormEditarAsociacionEmpresaProveedor(result) {
    var tipoRespuesta = (result.state == true) ? "success" : "danger";
    Utils._BuilderMessage(tipoRespuesta, result.message);
    Utils._CloseModal();

        CrearTablaEmpresa();
    
}
