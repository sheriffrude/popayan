var Empresa_Director = {
    IMAGE: {},
    IMAGE_PATH: null,
    DATA: [],
    $TABLA: null,
    OnLoad: function() {
        Empresa_Director.CambiarDocumento(true);

        $("#FechaNacimientoDirector").datepicker({ maxDate: '0' });

        $("#DocumentoDirector").autocomplete({
            source: function(request, response) {
                $.ajax({
                    url: URL_CONSULTAR_DOCUMENTOS_PERSONAS,
                    type: "POST",
                    dataType: "json",
                    data: {
                        filtro: request.term
                    },
                    success: function(resultado) {
                        response(resultado.data);
                    },
                    error: function(request, status, error) {
                        Utils._BuilderMessage("danger", error);
                    }
                })
            },
            minLength: 5,
            select: function(event, ui) {
                Empresa_Director.ConsultarDatosPersona(ui.item.id);
            },
            change: function(event, ui) {
                //LimpiarFormulario();
            }
        });

        Empresa_Director.CrearTabla();
    },
    ConsultarDatosPersona: function(personaId) {
        var parametros = {
            id: personaId
        };
        $.ajax({
            url: URL_CONSULTAR_PERSONA,
            type: 'POST',
            dataType: 'json',
            data: parametros,
            success: function(respuesta) {
                if (respuesta.state) {
                    var data = respuesta.data;
                    $("#PersonaDirectorId").val(data.Id);
                    $("#TipoDocumentoDirectorId").val(data.TipoDocumentoId);
                    $("#PrimerNombreDirector").val(data.PrimerNombre);
                    $("#SegundoNombreDirector").val(data.SegundoNombre);
                    $("#PrimerApellidoDirector").val(data.PrimerApellido);
                    $("#SegundoApellidoDirector").val(data.SegundoApellido);
                    $("#SexoDirectorId").val(data.SexoId);
                    $("#FechaNacimientoDirector").val(data.FechaNacimiento);
                    $("#CorreoDirector").val(data.Correo);
                    $("#DireccionDirector").val(data.Direcciones);
                    $("#TelefonoDirector").val(data.Telefonos);
                    $("#CelularDirector").val(data.Celulares);
                    $("#RHDirectorId").val(data.RHId);
                    $("#EstadoCivilDirectorId").val(data.EstadoCivilId);

                    $("#btn_upload_director").hide();
                    $("#content-logo-view_director").html('<img src="' + data.Foto + '" class="img-responsive" />');
                    Empresa_Director.IMAGE_PATH = data.Foto;

                    Empresa_Director.IMAGE = {};

                    Empresa_Director.CambiarDocumento(false);

                    Utils._BuilderDropDown();
                } else {
                    Utils._BuilderMessage("danger", respuesta.message);
                    $("#DocumentoDirector").focus();
                }
            }
        });
    },
    CambiarDocumento: function(estado) {
        var elements = $(".director-data");
        var countElements = elements.length;

        for (var i = 0; i < countElements; i++) {
            if (estado) {
                $("#PersonaDirectorId").val('');
                $("#DocumentoDirector").val('');
                $("#TipoDocumentoDirectorId").val('');
                $("#PrimerNombrDirector").val('');
                $("#SegundoNombreDirector").val('');
                $("#PrimerApellidoDirector").val('');
                $("#SegundoApellidoDirector").val('');
                $("#SexoDirectorId").val('');
                $("#FechaNacimientoDirector").val('');
                $("#CorreoDirector").val('');
                $("#DireccionDirector").val('');
                $("#TelefonoDirector").val('');
                $("#CelularDirector").val('');
                $("#RHDirectorId").val('');
                $("#EstadoCivilDirectorId").val('');

                $("#" + elements[i].id).removeAttr("disabled");

                $("#content-logo-view_director").html("");
                $("#btn_upload_director").show();

                Empresa_Director.IMAGE_PATH = null;
            }
            else {
                $("#" + elements[i].id).attr("disabled", "disabled");
            }
        }

        Utils._BuilderDropDown();
    },
    CrearTabla: function() {
        Empresa_Director.$TABLA = $("#TableDirector").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": Empresa_Director.DATA,
            "scrollX": true,
            "columns": [
                {
                    "data": "PersonaDirectorId",
                    "visible": false
                },
                {
                    "data": "FotoPathDirector",
                    "orderable": false,
                    "searchable": false,
                    "width": "40%",
                    "render": function(data, type, full, meta) {
                        var image = (!Validations._IsNull(data)) ? data : "";
                        return '<img class="img-responsive center-block" src= "' + image + '" >';
                    }
                },
                { "data": "PrimerNombreDirector" },
                { "data": "SegundoNombreDirector" },
                { "data": "PrimerApellidoDirector" },
                { "data": "SegundoApellidoDirector" },
                { "data": "TipoDocumentoDirector" },
                { "data": "DocumentoDirector" },
                { "data": "FechaNacimientoDirector" },
                { "data": "SexoDirector" },
                { "data": "CorreoDirector" },
                { "data": "DireccionDirector" },
                { "data": "TelefonoDirector" },
                { "data": "RHDirector" },
                { "data": "EstadoCivilDirector" },
                {
                    "data": "PersonaDirectorId",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function(data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="Empresa_Director.Eliminar(' + data + ')" >';
                    }
                }
            ],
            "order": [[2, "desc"]]
        });
    },
    Agregar: function() {
        //PersonaId
        var personaId = $("#PersonaDirectorId").val();

        //Documento
        var documento = $("#DocumentoDirector").val();
        if (Validations._IsNull(documento)) {
            Utils._BuilderMessage("warning", "Director: El campo Documento (*) es obligatorio.");
            return false;
        }
        //Tipo de documento
        var tipoDocumentoDirectorId = $("#TipoDocumentoDirectorId").val();
        if (Validations._IsNull(tipoDocumentoDirectorId)) {
            Utils._BuilderMessage("warning", "Director: El campo Tipo Documento (*) es obligatorio.");
            return false;
        }
        var tipoDocumento = $('#TipoDocumentoDirectorId option:selected').text()

        //Primer nombre
        var primerNombre = $("#PrimerNombreDirector").val();
        if (Validations._IsNull(primerNombre)) {
            Utils._BuilderMessage("warning", "Director: El campo Primer nombre (*) es obligatorio.");
            return false;
        }

        //Primer nombre
        var segundoNombre = $("#SegundoNombreDirector").val();

        //Primer apellido
        var primerApellido = $("#PrimerApellidoDirector").val();
        if (Validations._IsNull(primerApellido)) {
            Utils._BuilderMessage("warning", "Director: El campo Primer apellido (*) es obligatorio.");
            return false;
        }

        //Segundo apellido
        var segundoApellido = $("#SegundoApellidoDirector").val();

        //sexoId
        var sexoId = $("#SexoDirectorId").val();
        if (Validations._IsNull(sexoId)) {
            Utils._BuilderMessage("warning", "Director: El campo Sexo (*) es obligatorio.");
            return false;
        }
        var sexo = $('#SexoDirectorId :selected').text();

        //Fecha nacimiento
        var fechaNacimiento = $("#FechaNacimientoDirector").val();

        //Correo
        var correo = $("#CorreoDirector").val();
        if (Validations._IsNull(correo)) {
            Utils._BuilderMessage("warning", "Director: El campo Correo electrónico(*) es obligatorio.");
            return false;
        }

        //Direccion
        var direccion = $("#DireccionDirector").val();

        //Telefono
        var telefono = $("#TelefonoDirector").val();

        //Celular
        var celular = $("#CelularDirector").val();

        //RH
        var RHId = $("#RHDirectorId").val();
        var RH = $("#RHDirectorId :selected").text();

        //Estado civil
        var estadoCivilId = $("#EstadoCivilDirectorId").val();
        if (Validations._IsNull(estadoCivilId)) {
            Utils._BuilderMessage("warning", "Director: El campo Estado civil (*) es obligatorio.");
            return false;
        }
        var estadoCivil = $("#EstadoCivilDirectorId :selected").text();
        
        //Validar si ya existe el usuario con el mismo documento
        var totalDirectores = Empresa_Director.DATA.length;
        for (var i = 0; i < totalDirectores; i++) {
            if (Empresa_Director.DATA[i]['DocumentoDirector'] == documento) {
                Utils._BuilderMessage('warning', 'Esta Persona ya se encuentra registrada.');
                return false;
            }
        }
        
        var jsonDirector = {
            PersonaDirectorId: personaId,
            DocumentoDirector: documento,
            TipoDocumentoDirectorId: tipoDocumentoDirectorId,
            TipoDocumentoDirector: tipoDocumento,
            PrimerNombreDirector: primerNombre,
            SegundoNombreDirector: segundoNombre,
            PrimerApellidoDirector: primerApellido,
            SegundoApellidoDirector: segundoApellido,
            SexoDirectorId: sexoId,
            SexoDirector: sexo,
            FechaNacimiento: fechaNacimiento,
            FechaNacimientoDirector: fechaNacimiento,
            CorreoDirector: correo,
            DireccionDirector: direccion,
            TelefonoDirector: telefono,
            CelularDirector: celular,
            RHDirectorId: RHId,
            RHDirector: RH,
            EstadoCivilDirectorId: estadoCivilId,
            EstadoCivilDirector: estadoCivil,
            FotoDirector: Empresa_Director.IMAGE,
            FotoPathDirector: Empresa_Director.IMAGE_PATH
        };
        Empresa_Director.DATA.push(jsonDirector);

        if (Empresa_Director.$TABLA != null)
            Empresa_Director.$TABLA = null;

        Empresa_Director.CrearTabla();

        Empresa_Director.CambiarDocumento(true);
    },
    Eliminar: function(id) {
        var longitudDataCorreo = Empresa_Director.DATA.length;
        for (var i = 0; longitudDataCorreo > i; i++) {
            if (Empresa_Director.DATA[i]["PersonaDirectorId"] == id) {
                Empresa_Director.DATA.splice(i, 1);
                break;
            }
        }
        if (Empresa_Director.$TABLA != null)
            Empresa_Director.$TABLA.fnDestroy();
        Empresa_Director.CrearTabla();
    },
    ObtenerDatos: function() {
        return Empresa_Director.DATA;
    },
    UploadImage: {
        Upload: function(e) {
            RequestHttp._UploadFile(e, URL_UPLOAD, function(data) {
                if (data != null) {
                    var file = {
                        'Name': data.Name,
                        'Path': data.Path,
                        'Url': data.Url
                    };

                    Empresa_Director.IMAGE.Image = file;

                    $("#content-imagen-upload_director").show();

                    $("#logo-view-crop_director").attr("src", data.Url);

                    $('#logo-view-crop_director').cropper({
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
        Crop: function() {
            if (Validations._IsNull(Empresa_Director.IMAGE.Image)) {
                Utils._BuilderMessage("warning", "Debe cargar una imagen para poder continuar!");
                return false;
            }

            var canvas = $('#logo-view-crop_director').cropper('getCroppedCanvas');
            $("#content-logo-view_director").html(canvas);

            Empresa_Director.IMAGE.DataCrop = $('#logo-view-crop_director').cropper('getData');

            Utils._CloseModal();
        }
    }
}