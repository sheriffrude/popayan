var FILE = null;

/**
 * Función de inicialización de datos basicos
 */
function initDatosBasicos() {
    $("#FechaNacimiento").datepicker({ maxDate: '0' });
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
                var data = respuesta.data;
                $("#TipoDocumentoId").val(data.TipoDocumentoId);
                $("#PrimerNombre").val(data.PrimerNombre);
                $("#SegundoNombre").val(data.SegundoNombre);
                $("#PrimerApellido").val(data.PrimerApellido);
                $("#SegundoApellido").val(data.SegundoApellido);
                $("#SexoId").val(data.SexoId);
                $("#FechaNacimiento").val(data.FechaNacimiento);
                $("#Correo").val(data.Correo);
                $("#Direccion").val(data.Direcciones);
                $("#Telefono").val(data.Telefonos);
                $("#Celular").val(data.Celulares);
                $("#RHId").val(data.RHId);
                $("#EstadoCivilId").val(data.EstadoCivilId);
                if (data.Foto != null) {
                    $("#content-imagen").removeClass("hide");
                    $("#Foto").attr("src", data.Foto);
                    $("#foto-view").attr("src", data.Foto);
                }
                else {
                    $("#content-imagen").addClass("hide");
                }
            } else {
                Utils._BuilderMessage("danger", respuesta.message);
                $("#Documento").focus();
            }
        }
    });
}

/**
 * UploadFile
 * @param {any} e
 */
function UploadFile(e) {
    RequestHttp._UploadFile(e, URL_UPLOAD, function (data) {
        if (data != null) {
            FILE = {
                'Name': data.Name,
                'Path': data.Path
            };
            $("#Foto").attr("src", data.Url);
            $("#foto-view").attr("src", data.Url);
            $("#content-foto").removeClass("hide");
        }
    });
}


/**
 * Función de obtener los datos básicos
 * @param {any} data
 */
function obtenerDatosBasicos() {
    var dataDatosBasicos = {};
    var elements = $(".datos-basicos");
    var countElements = elements.length;
    for (var i = 0; i < countElements; i++) {
        if (elements[i].id != undefined) {
            dataDatosBasicos[elements[i].name] = elements[i].value;
        }
    }
    dataDatosBasicos["Foto"] = FILE;
    dataDatosBasicos["FotoSrc"] = $("#foto-view").attr("src");
    return dataDatosBasicos;
}