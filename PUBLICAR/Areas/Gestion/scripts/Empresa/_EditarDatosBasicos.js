var Empresa_DatosBasicos = {
    IMAGE: {},
    OnLoad: function () {
        var fechaActual = $("#FechaAniversario").val();
        $("#FechaAniversario").datepicker();
        $("#FechaAniversario").datepicker({ dateFormat: "d 'de' MM" }).datepicker('setDate', fechaActual);
        $("#FechaAniversario").datepicker().focus(function () { $(".ui-datepicker-year").hide(); });
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
        var $form = $('.datos-basicos');
        if ($form.valid()) {
        } else {
            Utils._BuilderMessage('warning', "Debe completar los campos de la pestaña 'Información básica'");
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
                            imageSmoothingEnabled: false,
                            imageSmoothingQuality: 'high',
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
