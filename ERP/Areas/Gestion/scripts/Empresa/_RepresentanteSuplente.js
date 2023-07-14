var Empresa_RepresentanteLegalSuplente = {
    IMAGE: {},
    IMAGE_PATH: null,
    OnLoad: function () {
        Empresa_RepresentanteLegalSuplente.CambiarDocumento(true);

        $("#FechaNacimientoSuplente").datepicker({ maxDate: '0' });

        $("#DocumentoSuplente").autocomplete({
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
                Empresa_RepresentanteLegalSuplente.ConsultarDatosPersona(ui.item.id);
            },
            change: function (event, ui) {
                //LimpiarFormulario();
            }
        });
    },
    ConsultarDatosPersona: function (personaId) {
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
                    $("#PersonaSuplenteId").val(data.Id);
                    $("#TipoDocumentoSuplenteId").val(data.TipoDocumentoId);
                    $("#PrimerNombreSuplente").val(data.PrimerNombre);
                    $("#SegundoNombreSuplente").val(data.SegundoNombre);
                    $("#PrimerApellidoSuplente").val(data.PrimerApellido);
                    $("#SegundoApellidoSuplente").val(data.SegundoApellido);
                    $("#SexoSuplenteId").val(data.SexoId);
                    $("#FechaNacimientoSuplente").val(data.FechaNacimiento);
                    $("#CorreoSuplente").val(data.Correo);
                    $("#DireccionSuplente").val(data.Direcciones);
                    $("#TelefonoSuplente").val(data.Telefonos);
                    $("#CelularSuplente").val(data.Celulares);
                    $("#RHSuplenteId").val(data.RHId);
                    $("#EstadoCivilSuplenteId").val(data.EstadoCivilId);

                    $("#btn_upload_suplente_representante_legal").hide();
                    $("#content-logo-view_representante_legal_suplente").html('<img src="' + data.Foto + '" class="img-responsive" />');
                    Empresa_RepresentanteLegalSuplente.IMAGE_PATH = data.Foto;

                    Empresa_RepresentanteLegalSuplente.IMAGE = {};

                    Empresa_RepresentanteLegalSuplente.CambiarDocumento(false);

                    Utils._BuilderDropDown();
                } else {
                    Utils._BuilderMessage("danger", respuesta.message);
                    $("#DocumentoSuplente").focus();
                }
            }
        });
    },
    CambiarDocumento: function (estado) {
        var elements = $(".representante-data-suplente");
        var countElements = elements.length;
        for (var i = 0; i < countElements; i++) {
            if (estado) {
                $("#PersonaSuplenteId").val('');
                $("#DocumentoSuplente").val('');
                $("#TipoDocumentoSuplenteId").val('');
                $("#PrimerNombreSuplente").val('');
                $("#SegundoNombreSuplente").val('');
                $("#PrimerApellidoSuplente").val('');
                $("#SegundoApellidoSuplente").val('');
                $("#SexoSuplenteId").val('');
                $("#FechaNacimientoSuplente").val('');
                $("#CorreoSuplente").val('');
                $("#DireccionSuplente").val('');
                $("#TelefonoSuplente").val('');
                $("#CelularSuplente").val('');
                $("#RHSuplenteId").val('');
                $("#EstadoCivilSuplenteId").val('');

                $("#" + elements[i].id).removeAttr("disabled");

                $("#content-logo-view_representante_legal_suplente").html('');
                $("#btn_upload_suplente_representante_legal").show();

                Empresa_RepresentanteLegalSuplente.IMAGE_PATH = null;
            }
            else {
                $("#" + elements[i].id).attr("disabled", "disabled");
            }
        }

        Utils._BuilderDropDown();
    },
    ObtenerDatos: function () {
        var $form = $('.representante-suplente');
        if ($form.valid()) {
        } else {
            Utils._BuilderMessage('warning', "Debe completar los campos de la pestaña 'Representante Legal Suplente'");
            return false;
        }

        //if (Validations._IsNull(Empresa_RepresentanteLegalSuplente.IMAGE.Image) && Validations._IsNull(Empresa_RepresentanteLegalSuplente.IMAGE_PATH)) {
        //    Utils._BuilderMessage("danger", "Debe seleccionar la Foto del Suplente del Representante Legal para poder continuar.");
        //    return false;
        //}

        var representanteSuplente = {};
        var elements = $(".representante-suplente");
        var countElements = elements.length;
        for (var i = 0; i < countElements; i++) {
            if (elements[i].id != undefined) {
                representanteSuplente[elements[i].name] = elements[i].value;
            }
        }

        representanteSuplente["TipoDocumentoSuplenteId"] = $("#TipoDocumentoSuplenteId").val();
        representanteSuplente["SexoSuplenteId"] = $("#SexoSuplenteId").val();
        representanteSuplente["RHSuplenteId"] = $("#RHSuplenteId").val();
        representanteSuplente["EstadoCivilSuplenteId"] = $("#EstadoCivilSuplenteId").val();

        representanteSuplente["FotoSuplente"] = Empresa_RepresentanteLegalSuplente.IMAGE;
        representanteSuplente["FotoPathSuplente"] = Empresa_RepresentanteLegalSuplente.IMAGE_PATH;
        return representanteSuplente;
    },
    UploadImage: {
        Upload: function (e) {
            RequestHttp._UploadFile(e, URL_UPLOAD, function (data) {
                if (data != null) {
                    FILE = {
                        'Name': data.Name,
                        'Path': data.Path,
                        'Url': data.Url
                    };

                    $("#content-imagen-upload_representante_legal_suplente").show();

                    Empresa_RepresentanteLegalSuplente.IMAGE.Image = FILE;
                    $("#logo-view-crop_representante_legal_suplente").attr("src", data.Url);

                    $('#logo-view-crop_representante_legal_suplente').cropper({
                        aspectRatio: 1 / 1,
                        minCropBoxWidth: 150,
                        minCropBoxHeight: 150,
                        'getCroppedCanvas':
                        {
                            width: 150,
                            height: 150,
                            minWidth: 150,
                            minHeight: 150,
                            maxWidth: 150,
                            maxHeight: 150,
                            fillColor: '#fff',
                            imageSmoothingEnabled: false,
                            imageSmoothingQuality: 'high',
                        }
                    }
                    );
                }
            });
        },
        Crop: function () {
            if (Validations._IsNull(Empresa_RepresentanteLegalSuplente.IMAGE.Image)) {
                Utils._BuilderMessage("warning", "Debe cargar una imagen para poder continuar!");
                return false;
            }

            var canvas = $('#logo-view-crop_representante_legal_suplente').cropper('getCroppedCanvas');
            $("#content-logo-view_representante_legal_suplente").html(canvas);

            Empresa_RepresentanteLegalSuplente.IMAGE.DataCrop = $('#logo-view-crop_representante_legal_suplente').cropper('getData');

            Utils._CloseModal();
        }
    }
};