/**
 * Variables Globales
 */
var $TABLA_EMPRESAS = null;
var $EMPRESAS = null;

/**
 * OnLoadPage
 */
$(function () {
    CrearTablaEmpresas();    
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
 * RecargarTablaEmpresas
 */
function RecargarTablaEmpresas() {
    if ($TABLA_EMPRESAS != null)
        $TABLA_EMPRESAS.draw();
}

/**
 * Crear tabla Empresasfiltro
 * @returns {} 
 */
function CrearTablaEmpresas() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPRESAS = $("#tabla-empresas").DataTable({
        "ajax": {
            "url": URL_LISTAR_ASOCIACION_CLIENTE_EMPRESAS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
            "dataSrc": function (json) {
                $EMPRESAS = json.data;
                return json.data;
            } 
        }, "columns": [
            { "data": "Nombre" },
            { "data": "Identificador" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    return '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente-empresa" onchange="CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'

                }
            }
        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-cliente-empresa").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function ActualizarTablaEmpresas(dataRows) {
    $TABLA_EMPRESA = $("#tabla-empresas").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": dataRows,
        "columns": [            
            { "data": "Nombre" },
            { "data": "Identificador" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var checked = (full.Estado == true) ? "checked" : "";
                    if (full.Tipo == undefined || full.Tipo == "")
                        return '<input type="checkbox" ' + checked + ' class="boton-desactivar-cliente-empresa" onchange="CambiarEstado(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'
                    else 
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarEmpresa(' + full.EmpresaId + ')" >';
                }
            }
        ],
        "drawCallback": function (settings) {
            $(".boton-desactivar-cliente-empresa").bootstrapToggle({
                on: '',
                off: ''
            });
        }
    });
}

function AplicarFiltroTabla() {
    if ($EMPRESAS != null) {
        var filtro = $("#input-filtro").val().toUpperCase();
        var data = [];

        if (filtro == "") {
            ActualizarTablaEmpresas($EMPRESAS);
        } else {
            var nombre = "";
            var identificador = "";
            for (var i = 0; i < $EMPRESAS.length; i++) {
                nombre = $EMPRESAS[i].Nombre.toUpperCase();
                if (nombre.includes(filtro)) {
                    data.push($EMPRESAS[i]);
                }
                else {
                    identificador = $EMPRESAS[i].Identificador.toUpperCase();
                    if (identificador.includes(filtro))
                        data.push($EMPRESAS[i]);
                }
            }

            ActualizarTablaEmpresas(data);
        }
    }
}

function limpiarFiltro() {
    var filtro = $("#input-filtro").val("");
    ActualizarTablaEmpresas($EMPRESAS);
}

/**
 * Eliminar empresa
 * @param {int} id 
 * @returns {} 
 */
function CambiarEstado(e) {    
    var estado = $(e).is(":checked");
    var id = $(e).val();

    var parametros = {
        Id: id,
        Estado: estado
    };

    RequestHttp._Post(URL_CAMBIAR_ESTADO_ASOCIACION_CLIENTE_EMPRESA, parametros, null, function (data) {
        if (data != null) {
            if (data.state) {
                Utils._BuilderMessage("success", data.message);
                                
                for (var i = 0; i < $EMPRESAS.length; i++) {
                    if ($EMPRESAS[i].Id == parametros.Id)
                        $EMPRESAS[i].Estado = parametros.Estado;
                }

                ActualizarTablaEmpresas($EMPRESAS);
            }                
            else
                Utils._BuilderMessage("danger", data.message);
        }        
    });
}

function agregarEmpresa(dataJson) {
    if (dataJson != undefined) {
        dataJson["Estado"] = true;
        dataJson["Tipo"] = "Nuevo";

        $EMPRESAS.push(dataJson);
        
        ActualizarTablaEmpresas($EMPRESAS);
    }
}

function EliminarEmpresa(data) {     
    for (var i = 0; i < $EMPRESAS.length; i++) {
        if ($EMPRESAS[i].EmpresaId == data) {
            $EMPRESAS.splice(i);
        }
    }

    ActualizarTablaEmpresas($EMPRESAS);
}

/**
 * OnCompleteCrearProveedor
 * @param {any} result
 */
function OnCompleteEditarCliente(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (data != null) {
        if (data.state) {
            Utils._BuilderMessage("success", data.message, "RedireccionarVerCliente");
        } else
            Utils._BuilderMessage("danger", data.message);
    }
}

//Carga previa al submit del formulario de edición
function OnBeginEditarCliente(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["Empresas"] = filtrarEmpresasRegistradas();
    
    settings.data = jQuery.param(data);
    return true;
}

function filtrarEmpresasRegistradas() {
    var data = [];

    if ($EMPRESAS != undefined) {
        for (var i = 0; i < $EMPRESAS.length; i++){
            if ($EMPRESAS[i].Id == -1){
                data.push($EMPRESAS[i]);
            }
        }
    }

    return data;
}

/**
 * RedireccionarVerCliente
 */
function RedireccionarVerCliente() {
    window.location.href = URL_VER_CLIENTE;
}