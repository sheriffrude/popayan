$(function () {
    EmpresaCrear.OnLoad();
});

var EmpresaCrear = {
    IMAGE: {},
    OnLoad: function () {
        $("#form-crear-empresa")[0].reset();
        var fechaActual = $("#FechaAniversario").val();
        $("#FechaAniversario").datepicker();
        $("#FechaAniversario").datepicker({ dateFormat: "d 'de' MM" }).datepicker('setDate', fechaActual);
        $("#FechaAniversario").datepicker().focus(function () { $(".ui-datepicker-year").hide(); });

        Empresa_Director.OnLoad();
        Empresa_RedSocial.OnLoad();
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
    AgregarDocumentosLegales: function (empresaId) {
        Utils._BuilderConfirmation("Documentos legales", "¿Desea agregar los documentos legales de la empresa?",
            EmpresaCrear.DocumentosLegales,
            EmpresaCrear.ListarEmpresas, empresaId);
    },
    ListarEmpresas: function () {
        window.location.href = URL_LISTAR_EMPRESAS;
    },
    DocumentosLegales: function (empresaId) {
        window.location.href = "/Gestion/EmpresaDocumentoLegal/Listar/" + empresaId.empresaId;
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

                    EmpresaCrear.IMAGE.Image = FILE;

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
            if (Validations._IsNull(EmpresaCrear.IMAGE.Image)) {
                Utils._BuilderMessage("warning", "Debe cargar una imagen para poder continuar!");
                return false;
            }

            var canvas = $('#logo-view-crop').cropper('getCroppedCanvas', {
                width: 150,
                height: 150,
            });

            $("#content-logo-view").html(canvas);

            EmpresaCrear.IMAGE.DataCrop = $('#logo-view-crop').cropper('getData');

            Utils._CloseModal();
        }
    },
    OnBegin: function (jqXHR, settings) {
        if (Validations._IsNull(EmpresaCrear.IMAGE.Image)) {
            Utils._BuilderMessage("warning", "Debe seleccionar el Logo de la Empresa para poder continuar.");
            return false;
        }

        var totalDirectores = Empresa_Director.DATA.length;
        if (totalDirectores <= 0) {
            Utils._BuilderMessage("warning", "Debe adicionar al menos un Director.");
            return false;
        }

        var directores = [];
        for (var i = 0; i < totalDirectores; i++) {
            directores.push(Empresa_Director.DATA[i].Id);
        }

        var data = $(this).serializeObject();
        data["RedesSociales"] = Empresa_RedSocial.DATA;
        data["Logo"] = EmpresaCrear.IMAGE;
        data["Directores"] = directores;
        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (!Validations._IsNull(resultado)) {
            var empresa = { empresaId: resultado.data };
            if (resultado.state)
                Utils._BuilderMessage('success', resultado.message, EmpresaCrear.AgregarDocumentosLegales, empresa);
            else
                Utils._BuilderMessage('danger', resultado.message);
        }
    },
}


var Empresa_RedSocial = {
    DATA: [],
    $TABLA: null,
    IMAGE: {},
    OnLoad: function () {
        Empresa_RedSocial.CrearTabla();
    },
    CrearTabla: function () {
        Empresa_RedSocial.$TABLA = $("#tabla-redes-sociales").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": Empresa_RedSocial.DATA,
            "columns": [
                { "data": "NombreRedSocial" },
                {
                    "data": "LogoRedSocialPath",
                    "orderable": false,
                    "searchable": false,
                    "width": "30%",
                    "render": function (data, type, full, meta) {
                        return '<img class="" src= "' + data + '" />';
                    }
                },
                {
                    "data": "UrlRedSocial",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<a href="' + full.UrlRedSocial + '" target="_blank">' + full.UrlRedSocial + '</a>';
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="Empresa_RedSocial.Eliminar(' + full.Id + ')" >';
                    }
                }
            ]
        });

    },
    Agregar: function () {
        var $form = $('#agregar-red-social');
        if ($form.valid()) {

            if (Empresa_RedSocial.IMAGE == null) {
                Utils._BuilderMessage('warning', 'El campo Logo es obligatorio.');
                return false;
            }

            var nombre = $("#NombreRedSocial").val();
            var url = $("#UrlRedSocial").val();

            var totalData = Empresa_RedSocial.DATA.length;
            for (var i = 0; i < totalData; i++) {
                if (Empresa_RedSocial.DATA[i]['NombreRedSocial'] == nombre) {
                    Utils._BuilderMessage('warning', 'Este Nombre ya se encuentra registrada.');
                    return false;
                }

                if (Empresa_RedSocial.DATA[i]['UrlRedSocial'] == url) {
                    Utils._BuilderMessage('warning', 'Esta Url ya se encuentra registrada.');
                    return false;
                }
            }

            var jsoRedSocial = {
                Id: (Empresa_RedSocial.DATA.length + 1),
                NombreRedSocial: nombre,
                UrlRedSocial: url,
                LogoRedSocial: Empresa_RedSocial.IMAGE,
                LogoRedSocialPath: Empresa_RedSocial.IMAGE.Url
            };

            Empresa_RedSocial.DATA.push(jsoRedSocial);

            if (Empresa_RedSocial.$TABLA != null)
                Empresa_RedSocial.$TABLA = null;
            Empresa_RedSocial.CrearTabla();

            Empresa_RedSocial.IMAGE = null;

            Utils._CloseModal();
        }
    },
    Eliminar: function (id) {
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
    UploadImage: function (e) {
        RequestHttp._UploadFile(e, URL_UPLOAD, function (data) {
            if (data != null) {
                Empresa_RedSocial.IMAGE = {
                    Name: data.Name,
                    Path: data.Path,
                    Url: data.Url
                };
                $("#LogoRedSocial").attr("src", data.Url);
                $("#foto-view-Red-Social").attr("src", data.Url);
            }
        });
    }
}

var Empresa_Director = {
    DATA: [],
    $TABLA: null,
    OnLoad: function () {
        Empresa_Director.CrearTabla();
    },
    CrearTabla: function () {
        Empresa_Director.$TABLA = $("#tabla-directores").dataTable({
            "destroy": true,
            "serverSide": false,
            "data": Empresa_Director.DATA,
            "columns": [
                { "data": "Nombre" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="Empresa_Director.Eliminar(' + data + ')" >';
                    }
                }
            ],
        });
    },
    Agregar: function (e) {
        var id = $(e).val();
        var longitudData = Empresa_Director.DATA.length;
        for (var i = 0; longitudData > i; i++) {
            if (Empresa_Director.DATA[i]["Id"] == id) {
                Utils._BuilderMessage("warning", "Esta persona ya se agrego a la lista de directores.");
                return false;
            }
        }

        var nombre = $(e).find("option:selected").text();

        var director = {
            Id: id,
            Nombre: nombre
        };
        Empresa_Director.DATA.push(director);
        Empresa_Director.CrearTabla();
    },
    Eliminar: function (id) {
        var longitudData = Empresa_Director.DATA.length;
        for (var i = 0; longitudData > i; i++) {
            if (Empresa_Director.DATA[i]["Id"] == id) {
                Empresa_Director.DATA.splice(i, 1);
                break;
            }
        }
        if (Empresa_Director.$TABLA != null)
            Empresa_Director.$TABLA.fnDestroy();
        Empresa_Director.CrearTabla();
    }
}