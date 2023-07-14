var $TABLA_LISTAR_SERVICIOS = null;
function onLoadListarServicios() {
    ListarServicios();
}

function ListarServicios() {

    $TABLA_LISTAR_SERVICIOS = $("#tabla-listar-servicio").DataTable({
        "destroy": true,
        "ajax": {
            "url": URL_LISTAR_SERVICIOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = null;
                d.id = $("#ProveedorId").val();
            }
        },
        "columns": [
            { "data": "Nombre" },
              {
                  "data": "Id",
                  "orderable": false,
                  "searchable": false,
                  "width": "20%",
                  "render": function (data, type, full, meta) {
                      return '<input type="button" value="ELIMINAR" class="btn btn-danger" Onclick="EliminarAsociacionServicio(' + data + ')">';
                  }
              },
        ],
        "drawCallback": function (settings) {
        }
    });
}

function EliminarAsociacionServicio(id) {
    var parameters = {
        Id: id
    };
    RequestHttp._Post(URL_ELIMINAR_ASOCIACION_SERVICIO, parameters, null, function (response) {
        if (!Validations._IsNull(response)) {
            var tipoRespuesta = (response.state == true) ? "success" : "danger";
            Utils._BuilderMessage(tipoRespuesta, response.message);
            ListarServicios();
        }
    });
}

function GuardarAsociacionServicios() {
    var servicioId = $("#ServicioId").val();
    if (servicioId == '') {
        Utils._BuilderMessage('danger', 'Seleccione un servicio');
        return false;
    } else {
        var parameters = {
            servicioId: servicioId,
            proveedorId :$("#ProveedorId").val()
        }
        RequestHttp._Post(URL_AGREGAR_SERVICIO, parameters, null, function (response) {
            if (!Validations._IsNull(response)) {
                var tipoRespuesta = (response.state == true) ? "success" : "danger";
                Utils._BuilderMessage(tipoRespuesta, response.message);
                ListarServicios();
            }
        });
    }
}