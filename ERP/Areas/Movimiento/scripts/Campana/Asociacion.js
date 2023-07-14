var EMPRESAID = 0;
var CLIENTEID = 0;
var $TABLA_OTS = null;
var ARRAY_OT = [];
var ARRAY_OT_MOSTRAR = [];

var $TABLA_OT_SELECCIONADO = null;
function OnchangeAsociarEmpresa(e) {
    var empresaId = $(e).val();
    EMPRESAID = empresaId;

    if (empresaId > 0) {
        var parameters = {
            id: empresaId
        };
        var $elementListClientes = $("#AsociarClienteId");
        Utils._GetDataDropDownList($elementListClientes, URL_CLIENTES, parameters);

    }
}

function OnchangeCliente(e) {
    var clienteId = $(e).val();
    CLIENTEID = clienteId;
    if (clienteId > 0) {
        var parameters = {
            clienteId: clienteId,
            empresaId: EMPRESAID
        };
        var $elementListClientes = $("#AsociarCampanaId");
        Utils._GetDataDropDownList($elementListClientes, URL_CAMPANAS, parameters);

    }
}

function OnChangeEstadoCampana(e) {
    var estado = $(e).val();

    CLIENTEID = $("#AsociacionClienteIdCampana").val();
    if (CLIENTEID > 0) {
        var parameters = {
            clienteId: CLIENTEID,
            empresaId: EMPRESAID,
            estadoId: estado
        };
        var $elementListClientes = $("#AsociacionCampanaId");
        Utils._GetDataDropDownList($elementListClientes, URL_CAMPANAS_ESTADO, parameters);

    }
}


function ConstruirTablaOt() {
    var $filtro = $("#input-filtro");
    $TABLA_OTS = $("#tabla-asociar-campana").DataTable({
        "ajax": {
            "url": URL_LISTAR_OTS,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = $filtro.val();
                d.clienteId = CLIENTEID;
                d.empresaId = EMPRESAID;
            }
        },
        "columns": [
              {
                  "data": "Id",
                  "orderable": false,
                  "searchable": false,
                  "render": function (data, type, full, meta) {
                      return '<input type="radio" name="opcion-tarea" id="' + data + '" onclick="SeleccionarOt(this)" data_id="' + data + '" data-cod="' + full.Codigo + '" data_ref="' + full.Referencia + '" class="custom-radio" />' +
                          '<label for="' + data + '" class="custom-radio-label"></label>';

                  }
              },
            { "data": "Ejecutivo" },
            { "data": "Codigo" },
            { "data": "Referencia" }

        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function SeleccionarOt(e) {
    var otId = $(e).attr('data_id');
    var codigo = $(e).attr('data-cod');
    var referencia = $(e).attr('data_ref');

    var tam = ARRAY_OT_MOSTRAR.length;
    if (tam == 0) {
        var object = {
            id: otId,
            codigo: codigo,
            ref: referencia
        };
        ARRAY_OT_MOSTRAR.push(object);
        console.info(ARRAY_OT_MOSTRAR);
        ContruirTablaOt();
        return false;
    } else {
        for (var i = 0; i < tam; i++) {
            if (ARRAY_OT_MOSTRAR[i]['id'] == otId) {
                Utils._BuilderMessage('danger', 'La Ot ya ha sido seleccionada.');
                return false;
            }
        }
        var object = {
            id: otId,
            codigo: codigo,
            ref: referencia
        };
        ARRAY_OT_MOSTRAR.push(object);
    }
    ContruirTablaOt();
}



function ContruirTablaOt() {
    //$("#MostrarLista_ot_seleccionada").removeClass('hidden');
    $TABLA_OT_SELECCIONADO = $("#tabla-ot_seleccionada").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": ARRAY_OT_MOSTRAR,
        "columns": [
             {
                 "data": "id",
                 "orderable": false,
                 "searchable": false,
                 "render": function (data, type, full, meta) {
                     return '<input type="radio" name="opcion-ot" id="ot_seleccionada_' + data + '" onclick="EliminarOt(this)" data_id="' + data + '" data-cod="' + full.Codigo + '" data_ref="' + full.Referencia + '" class="custom-radio" />' +
                         '<label for="ot_seleccionada_' + data + '" class="custom-radio-label"></label>';

                 }
             },
            { "data": "codigo" },
            { "data": "ref" }
        ]
    });

}


function OnchangePaisAsociacion(e) {
    var empresaId = $(e).val();
    if (empresaId > 0) {
        var parameters = {
            id: empresaId
        };
        var $elementListClientes = $("#AsociacionClienteId");
        Utils._GetDataDropDownList($elementListClientes, URL_CLIENTES, parameters);

    }
}

function EliminarOt(e) {
  
    var otId = $(e).attr('data_id');
    var tam = ARRAY_OT_MOSTRAR.length;
    for (var i = 0; i < tam; i++) {
        if (otId == ARRAY_OT_MOSTRAR[i]['id']) {
            ARRAY_OT_MOSTRAR.splice(i, 1);
            break;
        }
    }

    if ($TABLA_OT_SELECCIONADO != null) {
        $TABLA_OT_SELECCIONADO.fnDestroy();
    }
    ContruirTablaOt();
}


function OnBeginCreearAsociacion(jqXHR, settings) {

    var tam = ARRAY_OT_MOSTRAR.length;
   
    for (var i = 0; i < tam; i++) {
        ARRAY_OT[i] = ARRAY_OT_MOSTRAR[i]['id'];
    }

    var data = $(this).serializeObject();
    data['AsociarCampanaId'] = $("#AsociarCampanaId").val();
    data['ListaOt'] = ARRAY_OT;
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrearAsociacion(resultado) {
    APROBACIONID = (resultado.data);
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
}


function OnchangePaisAsociacionCampana(e) {
    var empresaId = $(e).val();
    EMPRESAID = empresaId;

    if (empresaId > 0) {
        var parameters = {
            id: empresaId
        };
        var $elementListClientes = $("#AsociacionClienteIdCampana");
        Utils._GetDataDropDownList($elementListClientes, URL_CLIENTES, parameters);

    }
}

var $TABLA_ASOCIACION = null;

//Lista las campañas
function ListarAsociaciones() {

    $("#Table-Asociacion").removeClass("hidden");
    var campanaId = $("#AsociacionCampanaId").val();
    if (EMPRESAID == 0 || CLIENTEID == 0) {
        Utils._BuilderMessage("danger", " Debe seleccionar todos los parametros de busqueda");
    } else {


        $TABLA_ASOCIACION = $("#tabla-Asociacion").DataTable({
            "bDestroy": true,
            "ajax": {
                "url": URL_LISTAR_ASOCIACION,
                "type": "POST",
                "data": function (d) {
                    d.empresaId = EMPRESAID;
                    d.clienteId = CLIENTEID;
                    d.campanaId = campanaId;

                },

            }, "columns": [
                 {
                     "data": "Id",
                     "orderable": false,
                     "searchable": false,
                     "width": "5%",
                     "render": function (data, type, full, meta) {
                         return (TRA_ELIMINAR_ASOCIACION == true)
                                 ?
                            '<a href="#" class="btn btn-secondary btn-sm" onclick="Confirmar(' + data + ')">Eliminar</a>'
                             : "";
                     }
                 },
                { "data": "Ejecutivo" },
                { "data": "Ot" },
                { "data": "Referencia" },
                { "data": "Fecha" },
                { "data": "Hora" }
              
            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
             
            }
        });

    }
}

var OTID = 0;
function Confirmar(id) {
    OTID = id;
    Utils._BuilderConfirmation("Eliminar Novedad", "¿Esta seguro de eliminar la novedad?", "EliminarAsociacion");
}

function EliminarAsociacion() {
    if (typeof OTID === "undefined" || OTID == null || OTID == 0) {
        Utils._BuilderMessage("danger", "Ocurrio un error, por favor vuelve a intentarlo.");
        return false;
    }

    var parametros = {
        id: OTID
    };
    $.ajax({
        url: URL_ELIMINAR_CAMPANA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            if (respuesta.state == true)
                Utils._BuilderMessage("success", respuesta.message);
            else
                Utils._BuilderMessage("danger", respuesta.message);
            ListarAsociaciones();
        },
        error(xhr, ajaxOptions, thrownError) {
            Utils._BuilderMessage("danger", thrownError);
        }
    });
}