
var $TABLA_CORREOS_EDIT = null;
var $DATA_CORREOS_EDIT = [];
var COUNT_TABLA = 0;

/**
 * Función de inicializar el modal
 */
function initEditarImpuesto() {
    $TABLA_CORREOS_EDIT = null;
    $DATA_CORREOS_EDIT = [];
    COUNT_TABLA = 0;
    $("#FechaVencimiento").datepicker({ minDate: '0' });
}

/**
 * OnCompleteImpuestoEmpresa
 * @param {any} response
 */
function OnCompleteEditarImpuestoEmpresa(response) {
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
function OnBeginEditarImpuestoEmpresa(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["CorreosElectronicos"] = $DATA_CORREOS_EDIT;
    settings.data = jQuery.param(data);
    return true;
}

/**
 * Función que contruye la visualización de la tabla de correos
 * @param {any} url
 */
function ConstruirTablaCorreos(url) {
    $TABLA_CORREOS_EDIT = $("#tabla-correos-notificacion-editar").dataTable({
        "ajax": {
            "url": url,
            "type": "POST",
            "dataSrc": function (json) {
                $DATA_CORREOS_EDIT = json.data;
                return json.data;
            }
        }, "columns": [
            { "data": "Text" },
            {
                "data": "Value",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCorreoEditar(' + data + ')" >';
                }
            }
        ]
    });
}

/**
 * Función de agregar al listado temporar un nuevo correo electronico
 */
function agregarCorreoImpuestoEditar() {
    var correoNotificacionImpuesto = $("#CorreoNotificacion").val();

    if (correoNotificacionImpuesto != undefined &&
        correoNotificacionImpuesto != null &&
        correoNotificacionImpuesto != '') {

        var verificacionCorreo = Validations._Email(correoNotificacionImpuesto);
        if (verificacionCorreo) Utils._BuilderMessage('info', "El correo eléctronico registrado no es valido");
        else {
            var countCorreos = $DATA_CORREOS_EDIT.length;
            for (var i = 0; i < countCorreos; i++) {
                if ($DATA_CORREOS_EDIT[i]['Text'] == correoNotificacionImpuesto) {
                    Utils._BuilderMessage('info', 'Esta correo ya se encuentra en el listado');
                    return false;
                }
            }
            var jsonCorreo = {
                Text: correoNotificacionImpuesto,
                Value: COUNT_TABLA
            };

            $DATA_CORREOS_EDIT.push(jsonCorreo);

            if ($TABLA_CORREOS_EDIT != null)
                $TABLA_CORREOS_EDIT = null;

            ActualizarTablaCorreos($DATA_CORREOS_EDIT);
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
 * Función de actualizar el listado de correos
 * @param {any} dataRows
 */
function ActualizarTablaCorreos(dataRows) {
    $TABLA_CORREOS_EDIT = $("#tabla-correos-notificacion-editar").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": dataRows,
        "columns": [
            { "data": "Text" },
            {
                "data": "Value",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCorreoEditar(' + data + ')" >';
                }
            }
        ]
    });
}

/**
 * Función que elimina correos del listado de correos
 * @param {any} id
 */
function EliminarCorreoEditar(id) {
    for (var i = 0; i < $DATA_CORREOS_EDIT.length; i++) {
        if ($DATA_CORREOS_EDIT[i]["Value"] == id) {
            $DATA_CORREOS_EDIT.splice(i, 1);
        }
    }
    ActualizarTablaCorreos($DATA_CORREOS_EDIT);
}

function RedireccionarListarClientes() {
    window.location.href = URL_LISTAR_EMPRESA_IMPUESTO;
}