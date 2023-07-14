var Empresa_DatosBasicos = {
    IMAGE: {},
    OnLoad: function () {
        var fechaActual = $("#FechaAniversario").val();
        $("#FechaAniversario").datepicker();
        $("#FechaAniversario").datepicker({ dateFormat: "d 'de' MM" }).datepicker('setDate', fechaActual);
        $("#FechaAniversario").datepicker().focus(function() { $(".ui-datepicker-year").hide(); });

        Empresa_RedSocial.CrearTabla();
    },
    OnChangePais: function (e, urlDepartamentos, urlCajasCompensacion) {
        var paisId = $(e).val();
        if (paisId > 0) {
            var parameters = {
                id: paisId
            };
            var $elementListDepartamentos = $("#DepartamentoId");
            Utils._GetDataDropDownList($elementListDepartamentos, urlDepartamentos, parameters);

            var $elementListCajasCompensacion = $("#CajaCompensacionId");
            Utils._GetDataDropDownList($elementListCajasCompensacion, urlCajasCompensacion, parameters);
        }
    },
    OnChangeDepartamento: function (e, url) {
        var deptoId = $(e).val();
        if (deptoId > 0) {
            var parameters = {
                id: deptoId
            };
            var $elementList = $("#CiudadId");
            Utils._GetDataDropDownList($elementList, url, parameters);
        }
    },
    ObtenerDatos: function () {
        if (Validations._IsNull(Empresa_DatosBasicos.IMAGE.Image)) {
            Utils._BuilderMessage("danger", "Debe seleccionar el Logo de la Empresa para poder continuar.");
            return false;
        }

        var empresa = {};
        var elements = $(".datos-basicos");
        var countElements = elements.length;
        for (var i = 0; i < countElements; i++) {
            if (elements[i].id != undefined) {
                empresa[elements[i].name] = elements[i].value;
            }
        }
        empresa["PaisId"] = $("#PaisId").val();
        empresa["DepartamentoId"] = $("#DepartamentoId").val();
        empresa["CiudadId"] = $("#CiudadId").val();
        empresa["CajaCompensacionId"] = $("#CajaCompensacionId").val();

        empresa["Volumen"] = $('#Volumen').is(':checked');
        empresa["Estado"] = $('.estado-empresa:checked').val();
        empresa["Logo"] = Empresa_DatosBasicos.IMAGE;

        return empresa;
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

                    Empresa_DatosBasicos.IMAGE.Image = FILE;

                    $("#content-imagen-upload").show();

                    $("#logo-view-crop").attr("src", data.Url);

                    $('#logo-view-crop').cropper({
                        aspectRatio: 1 / 1,
                        minCropBoxWidth: 150,
                        minCropBoxHeight: 150,
                        'getCroppedCanvas':
                        {
                            width: 150,
                            height: 150,
                            //minWidth: 150,
                            //minHeight: 150,
                            //maxWidth: 150,
                            //maxHeight: 150,
                            fillColor: '#fff',
                            //imageSmoothingEnabled: false,
                            //imageSmoothingQuality: 'high',
                        }
                    }
                    );
                }
            });
        },
        Crop: function () {
            if (Validations._IsNull(Empresa_DatosBasicos.IMAGE.Image)) {
                Utils._BuilderMessage("warning", "Debe cargar una imagen para poder continuar!");
                return false;
            }

            var canvas = $('#logo-view-crop').cropper('getCroppedCanvas', {
                width: 150,
                height: 150,
            });

            $("#content-logo-view").html(canvas);

            Empresa_DatosBasicos.IMAGE.DataCrop = $('#logo-view-crop').cropper('getData');

            Utils._CloseModal();
        }
    }
}

var Empresa_RedSocial = {
    DATA: [],
    $TABLA: null,
    IMAGE: {},
    OnLoad: function() {
        Empresa_RedSocial.CrearTabla();
    },
    CrearTabla: function() {
        Empresa_RedSocial.$TABLA = $("#Tableredessociales").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": Empresa_RedSocial.DATA,
            "columns": [
                {
                    "data": "Nombre",
                    "orderable": false,
                    "searchable": false,
                    "width": "30%",
                    "render": function(data, type, full, meta) {
                        return '<img class="img-responsive" src= "' + full.LogoPathRedSocial + '" />';
                    }
                },
                { "data": "NombreRedSocial" },
                {
                    "data": "UrlRedSocial",
                    "orderable": false,
                    "searchable": false,
                    "render": function(data, type, full, meta) {
                        return '<a href="' + full.UrlRedSocial + '" target="_blank">' + full.UrlRedSocial + '</a>';
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function(data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="Empresa_RedSocial.Eliminar(' + full.Id + ')" >';
                    }
                }
            ]
        });

    },
    Agregar: function() {
        var $form = $('#agregar-red-social');
        if ($form.valid()) {
            var nombre = $("#NombreRedSocial").val();

            var totalData = Empresa_RedSocial.DATA.length;
            for (var i = 0; i < totalData; i++) {
                if (Empresa_RedSocial.DATA[i]['NombreRedSocial'] == nombre) {
                    Utils._BuilderMessage('warning', 'Esta red social ya se encuentra registrada');
                    return false;
                }
            }

            var url = $("#UrlRedSocial").val();
            var jsoRedSocial = {
                Id: (Empresa_RedSocial.DATA.length + 1),
                LogoPathRedSocial: $("#foto-view-Red-Social").attr("src"),
                LogoRedSocialName: Empresa_RedSocial.IMAGE.Name,
                LogoRedSocialPath: Empresa_RedSocial.IMAGE.Path,
                NombreRedSocial: nombre,
                UrlRedSocial: url
            };

            if (jsoRedSocial.LogoRedSocialName == "" ||
                jsoRedSocial.LogoRedSocialName == null) {
                Utils._BuilderMessage('warning', 'Debe agregar el logo, para poder continuar.');
                return false;
            }

            Empresa_RedSocial.DATA.push(jsoRedSocial);

            if (Empresa_RedSocial.$TABLA != null)
                Empresa_RedSocial.$TABLA = null;

            Empresa_RedSocial.CrearTabla();
            Utils._CloseModal();
        }
    },
    Eliminar: function(id) {
        var longitudDataRedSocial = Empresa_RedSocial.DATA.length;
        for (var i = 0; longitudDataRedSocial > i; i++) {
            if (Empresa_RedSocial.DATA[i]["Id"] == id) {
                Empresa_RedSocial.DATA.splice(i, 1);
                break;
            }
        }

        longitudDataRedSocial = Empresa_RedSocial.DATA.length;
        for (var i = 0; longitudDataRedSocial > i; i++) {
            Empresa_RedSocial.DATA[i]["Id"] = id;
        }

        if (Empresa_RedSocial.$TABLA != null)
            Empresa_RedSocial.$TABLA.fnDestroy();

        Empresa_RedSocial.CrearTabla();
    },
    UploadImage: function(e) {
        RequestHttp._UploadFile(e, URL_UPLOAD, function(data) {
            if (data != null) {
                Empresa_RedSocial.IMAGE = {
                    'Name': data.Name,
                    'Path': data.Path
                };
                $("#LogoRedSocial").attr("src", data.Url);
                $("#foto-view-Red-Social").attr("src", data.Url);
            }
        });
    }
}
