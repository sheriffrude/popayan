var $TABLA_CAMPANA = null;
$(function () {

   // ListarParametros();
});

function CambiarTag(i) {
    if (i == 0) {
   
        $("#adicionar").addClass("hidden");
        $("#asociar").removeClass("hidden");
    } else {
        $("#asociar").addClass("hidden");
        $("#adicionar").removeClass("hidden");
    }

}




function OnchangePais(e) {
    var empresaId = $(e).val();
    if (empresaId > 0) {
        var parameters = {
            id: empresaId
        };
        var $elementListClientes = $("#ClienteId");
        Utils._GetDataDropDownList($elementListClientes, URL_CLIENTES, parameters);

    }
}


function OnchangeEmpresa(e) {
    var empresaId = $(e).val();
    if (empresaId > 0) {
        var parameters = {
            id: empresaId
        };
        var $elementListClientes = $("#CrearClienteId");
        Utils._GetDataDropDownList($elementListClientes, URL_CLIENTES, parameters);

    }
}


function OnBeginCrearCampana(jqXHR, settings) {

    var data = $(this).serializeObject();
    data['CrearClienteId'] = $("#CrearClienteId").val();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessCrearCampana(resultado) {

    alert("aadfasfasfd");
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
}


function CargarListaCampana() {

    if ($TABLA_CAMPANA != null) {
        $TABLA_CAMPANA.fnDestroy();
    }
    ListarCampana();
}

//Lista las campañas
function ListarCampana() {
  
    $("#Table-Campanas").removeClass("hidden");
    var empresaId = $("#EmpresaId").val();
    var clienteId = $("#ClienteId").val();
    if (empresaId == 0 || clienteId == 0) {
        Utils._BuilderMessage("danger", " Debe seleccionar todos los parametros de busqueda");
    } else {
       

        $TABLA_CAMPANA = $("#tabla-campana").DataTable({
            "bDestroy": true,
            "ajax": {
                "url": URL_LISTAR_CAMPANA,
                "type": "POST",
                "data": function (d) {
                    d.empresaId = empresaId;
                    d.clienteId = clienteId;
                },

            }, "columns": [
                 { "data": "Id" },
                { "data": "Nombre" },
                  {
                      "data": "Id",
                      "orderable": false,
                      "searchable": false,
                      "width": "5%",
                      "render": function (data, type, full, meta) {
                          return (PERMISO_EDITAR_CAMPANA == true)
                                  ? '<a href="' + URL_EDITAR_CAMPANA + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                              : "";

                      }
                  },
                 {
                     "data": "Estado",
                     "orderable": false,
                     "searchable": false,
                     "width": "5%",
                     "render": function (data, type, full, meta) {
                         var resultado = "";
                         var checked = (data == true) ? "checked" : "";
                         return (TRA_ELIMINAR_CAMPANA == true)
                                 ?
                              resultado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-persona" onchange="CambiarEstadoCampana(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + full.Id + '">'
                         :"";
                       

                     }
                 },
               

            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
                $(".boton-desactivar-persona").bootstrapToggle({
                    on: '',
                    off: ''
                });
            }
        });

    }
}

function CambiarEstadoCampana(e) {
    var estado = ($(e).is(":checked") == true);
    var id = $(e).val();
    var parameters = {
        Id: id,
        Estado: estado
    };
    $.ajax({
        url: URL_CAMBIAR_ESTADO_CAMPANA,
        type: "POST",
        dataType: "json",
        data: parameters,
        success: function (data, text) {
            var tipoRespuesta = (data.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, data.message);
        },
        error: function(request, status, error) {
            Utils._BuilderMessage("danger", error);
        }
    });
}


function OnBeginEditarCampana(jqXHR, settings) {
   
    var data = $(this).serializeObject();
    settings.data = jQuery.param(data);
    return true;
}

function OnSuccessEditarCampana(resultado) {

    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";
    }
  
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    Utils._CloseModal();
    ListarCampana();
}