var $DATA_CORREOS = [];
var $TABLA_CORREOS = null;
var COUNT_TABLA = 0;
/**
 * Función de inicialización 
 */
function initCrearImpuesto() {
    $DATA_CORREOS = [];
    $TABLA_CORREOS = null;
    COUNT_TABLA = 0;
    $("#listado-correos").hide();
    $("#FechaVencimiento").datepicker({ minDate: '0' });
}

/**
 * OnCompleteImpuestoEmpresa
 * @param {any} response
 */
function OnCompleteCrearImpuestoEmpresa(response) {
    var data = RequestHttp._ValidateResponse(response);
    if (!Validations._IsNull(data)) {
        if (data.state == true) {
            Utils._BuilderMessage("success", data.message, 'RedireccionarListarClientes');
            RecargarTablaImpuestos();
            Utils._CloseModal();
        }
        else
            Utils._BuilderMessage("danger", data.message);
    }
}

/**
 * Función que prepara los elemento a registrar
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCrearImpuestoEmpresa(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["CorreosElectronicos"] = $DATA_CORREOS;
    settings.data = jQuery.param(data);
    return true;
}

/**
 * Agrega correo al listado temporal
 */
function agregarCorreoImpuesto() {
    var correoNotificacionImpuesto = $("#CorreoNotificacion").val();

    if (correoNotificacionImpuesto != undefined &&
        correoNotificacionImpuesto != null &&
        correoNotificacionImpuesto != '') {

        var verificacionCorreo = Validations._Email(correoNotificacionImpuesto);
        if (verificacionCorreo) Utils._BuilderMessage('info', "El correo eléctronico registrado no es valido");
        else {
            var countCorreos = $DATA_CORREOS.length;
            for (var i = 0; i < countCorreos; i++) {
                if ($DATA_CORREOS[i]['Text'] == correoNotificacionImpuesto) {
                    Utils._BuilderMessage('info', 'Esta correo ya se encuentra en el listado');
                    return false;
                }
            }
            var jsonCorreo = {
                Text: correoNotificacionImpuesto,
                Value: COUNT_TABLA
            };

            $DATA_CORREOS.push(jsonCorreo);

            if ($TABLA_CORREOS != null)
                $TABLA_CORREOS = null;

            CrearTablaCorreosElectronicos();
            $("#CorreoNotificacion").val("");
            $("#listado-correos").show();
            COUNT_TABLA++;
        }
    }
    else {
        Utils._BuilderMessage('info', "Para añadir el correo eléctronico debe digitarlo en el campo CORREO DE NOTIFICACIÓN (*)");
    }
}

/**
 * Evento que crea por jquery la tabla temporal de correos
 */
function CrearTablaCorreosElectronicos() {
    $TABLA_CORREOS = $("#tabla-correos-notificacion").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": $DATA_CORREOS,
        "columns": [
            { "data": "Text" },
            {
                "data": "Value",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCorreo(' + data + ')" >';
                }
            }
        ]
    });
}

function EliminarCorreo(id) {
    var longitudDataCorreo = $DATA_CORREOS.length;
    for (var i = 0; longitudDataCorreo > i; i++) {
        if ($DATA_CORREOS[i]["Value"] == id) {
            $DATA_CORREOS.splice(i, 1);
            break;
        }
    }
    if ($TABLA_CORREOS != null)
        $TABLA_CORREOS.fnDestroy();
    CrearTablaCorreosElectronicos();
}

function RedireccionarListarClientes() {
    window.location.href = URL_LISTAR_EMPRESA_IMPUESTO;
}