var Empresa_RepresentanteLegal = {
    IMAGE: {},
    IMAGE_PATH: null,
    OnLoad: function () {
        Empresa_RepresentanteLegal.CambiarDocumento(true);

        $("#FechaNacimientoRepresentanteLegal").datepicker({ maxDate: '0' });

        $("#DocumentoRepresentanteLegal").autocomplete({
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
                Empresa_RepresentanteLegal.ConsultarDatosPersona(ui.item.id);
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
                    $("#PersonaRepresentanteLegalId").val(data.Id);
                    $("#TipoDocumentoRepresentanteLegalId").val(data.TipoDocumentoId);
                    $("#TipoDocumentoRepresentanteLegalId").val(data.TipoDocumentoId);
                    $("#PrimerNombreRepresentanteLegal").val(data.PrimerNombre);
                    $("#SegundoNombreRepresentanteLegal").val(data.SegundoNombre);
                    $("#PrimerApellidoRepresentanteLegal").val(data.PrimerApellido);
                    $("#SegundoApellidoRepresentanteLegal").val(data.SegundoApellido);
                    $("#SexoRepresentanteLegalId").val(data.SexoId);
                    $("#FechaNacimientoRepresentanteLegal").val(data.FechaNacimiento);
                    $("#CorreoRepresentanteLegal").val(data.Correo);
                    $("#DireccionRepresentanteLegal").val(data.Direcciones);
                    $("#TelefonoRepresentanteLegal").val(data.Telefonos);
                    $("#CelularRepresentanteLegal").val(data.Celulares);
                    $("#RHRepresentanteLegalId").val(data.RHId);
                    $("#EstadoCivilRepresentanteLegalId").val(data.EstadoCivilId);

                    $("#btn_upload_representante_legal").hide();
                    $("#content-logo-view_representante_legal").html('<img src="' + data.Foto + '" class="img-responsive" />');
                    Empresa_RepresentanteLegal.IMAGE_PATH = data.Foto;

                    Empresa_RepresentanteLegal.IMAGE = {};

                    Empresa_RepresentanteLegal.CambiarDocumento(false);

                    Utils._BuilderDropDown();
                } else {
                    Utils._BuilderMessage("danger", respuesta.message);
                    $("#DocumentoRepresentanteLegal").focus();
                }
            }
        });
    },
    CambiarDocumento: function (estado) {
        var elements = $(".representante-data");
        var countElements = elements.length;

        for (var i = 0; i < countElements; i++) {
            if (estado) {
                $("#PersonaRepresentanteLegalId").val('');
                $("#DocumentoRepresentanteLegal").val('');
                $("#TipoDocumentoRepresentanteLegalId").val('');
                $("#PrimerNombreRepresentanteLegal").val('');
                $("#SegundoNombreRepresentanteLegal").val('');
                $("#PrimerApellidoRepresentanteLegal").val('');
                $("#SegundoApellidoRepresentanteLegal").val('');
                $("#SexoRepresentanteLegalId").val('');
                $("#FechaNacimientoRepresentanteLegal").val('');
                $("#CorreoRepresentanteLegal").val('');
                $("#DireccionRepresentanteLegal").val('');
                $("#TelefonoRepresentanteLegal").val('');
                $("#CelularRepresentanteLegal").val('');
                $("#RHRepresentanteLegalId").val('');
                $("#EstadoCivilRepresentanteLegalId").val('');

                $("#" + elements[i].id).removeAttr("disabled");

                $("#content-logo-view_representante_legal").html('');
                $("#btn_upload_representante_legal").show();

                Empresa_RepresentanteLegal.IMAGE_PATH = null;
            }
            else {
                $("#" + elements[i].id).attr("disabled", "disabled");
            }
        }

        Utils._BuilderDropDown();
    },
    ObtenerDatos: function () {
        var $form = $('.representante-legal');
        if ($form.valid()) {
        } else {
            Utils._BuilderMessage('warning', "Debe completar los campos de la pestaña 'Representante Legal'");
            return false;
        }

        //if (Validations._IsNull(Empresa_RepresentanteLegal.IMAGE.Image) && Validations._IsNull(Empresa_RepresentanteLegal.IMAGE_PATH)) {
        //    Utils._BuilderMessage("danger", "Debe seleccionar la Foto del Representante Legal para poder continuar.");
        //    return false;
        //}

        var representanteLegal = {};
        var elements = $(".representante-legal");
        var countElements = elements.length;
        for (var i = 0; i < countElements; i++) {
            if (elements[i].id != undefined) {
                representanteLegal[elements[i].name] = elements[i].value;
            }
        }

        representanteLegal["TipoDocumentoRepresentanteLegalId"] = $("#TipoDocumentoRepresentanteLegalId").val();
        representanteLegal["SexoRepresentanteLegalId"] = $("#SexoRepresentanteLegalId").val();
        representanteLegal["RHRepresentanteLegalId"] = $("#RHRepresentanteLegalId").val();
        representanteLegal["EstadoCivilRepresentanteLegalId"] = $("#EstadoCivilRepresentanteLegalId").val();

        representanteLegal["FotoRepresentanteLegal"] = Empresa_RepresentanteLegal.IMAGE;
        representanteLegal["FotoPathRepresentanteLegal"] = Empresa_RepresentanteLegal.IMAGE_PATH;
        return representanteLegal;
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

                    $("#content-imagen-upload_crop_representante_legal").show();

                    Empresa_RepresentanteLegal.IMAGE.Image = FILE;
                    $("#logo-view-crop_representante_legal").attr("src", data.Url);

                    $('#logo-view-crop_representante_legal').cropper({
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
            if (Validations._IsNull(Empresa_RepresentanteLegal.IMAGE.Image)) {
                Utils._BuilderMessage("warning", "Debe cargar una imagen para poder continuar!");
                return false;
            }

            var canvas = $('#logo-view-crop_representante_legal').cropper('getCroppedCanvas');
            $("#content-logo-view_representante_legal").html(canvas);

            Empresa_RepresentanteLegal.IMAGE.DataCrop = $('#logo-view-crop_representante_legal').cropper('getData');

            Utils._CloseModal();
        }
    }
}