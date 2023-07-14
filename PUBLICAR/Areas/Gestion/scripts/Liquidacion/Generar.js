var FILE = null;

/**
 * Función de inicialización de datos basicos
 */
function initGenerar() {
    $("#FechaRetiro").datepicker();
    $("#Documento").bind("focusout", ConsultarDatosPersonaPorDocumento);
    $("#Documento").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: URL_CONSULTAR_DOCUMENTOS_PERSONAS,
                type: "POST",
                dataType: "json",
                data: {
                    filtro: request.term
                },
                success: function (resultado) {
                    response(resultado.data);
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            })
        },
        minLength: 5,
        select: function (event, ui) {
            
            ConsultarDatosPersonaPorDocumento(ui.item.id);
        },
        change: function (event, ui) {
            //LimpiarFormulario();
        }
    });
}

/**
  * Consultar datos de persona por documento
 **/
function ConsultarDatosPersonaPorDocumento(personaId) {
    var parametros = {
        id: personaId
    };
    $.ajax({
        url: URL_CONSULTAR_PERSONA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            if (respuesta.state == true) {
                console.log(respuesta);
                var data = respuesta.data;
                $("#PersonaId").val(data.Id);
                $("#NombreCompleto").val(data.NombreCompleto);
            } else {
                Utils._BuilderMessage("danger", respuesta.message);
                $("#Documento").focus();
            }
        }
    });
}

/**
 * OnBeginCrearEmpleado
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginCalcularLiquidacionEmpleado(jqXHR, settings) {
    var data = $(this).serializeObject();
    data["model"] = obtenerDatos();
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCalcularIndemnizacionEmpleado
 * @param {any} response
 */
function OnCompleteCalcularLiquidacionEmpleado(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true)
            Utils._BuilderMessage("success", resultado.message);
        else
            Utils._BuilderMessage("danger", resultado.message);
    }
}

function obtenerDatos() {
    var dataDatosBasicos = {};
    var elements = $(".datos-basicos");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataDatosBasicos[elements[i].name] = elements[i].value;
        }
    }
    return dataDatosBasicos;
}

function generar() {
    $("#generarIndemnizacion").submit()
}