var Empresa_RedSocial = {
    DATA: [],
    $TABLA: null,
    IMAGE: {},
    OnLoad: function () {
        Empresa_RedSocial.CrearTabla(true);
    },
    CrearTabla: function (cargarData) {
        if (cargarData) {
            Empresa_RedSocial.$TABLA = $("#Tableredessociales").dataTable({
                "ajax": {
                    "url": URL_LISTAR_REDES,
                    "type": "POST",
                    "dataSrc": function (json) {
                        Empresa_RedSocial.DATA = json.data;
                        return json.data;
                    }
                },
                "columns": [
                    {
                        "data": "LogoPathRedSocial",
                        "orderable": false,
                        "searchable": false,
                        "width": "30%",
                        "render": function (data, type, full, meta) {
                            return '<img class="img-responsive" src= "' + data + '" />';
                        }
                    },
                    { "data": "NombreRedSocial" },
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
                ],
                "order": [[1, "desc"]]
            });
        } else {
            Empresa_RedSocial.$TABLA = $("#Tableredessociales").dataTable({
                "destroy": true,
                "serverSide": false,
                "data": Empresa_RedSocial.DATA,
                "columns": [
                    {
                        "data": "LogoPathRedSocial",
                        "orderable": false,
                        "searchable": false,
                        "width": "30%",
                        "render": function (data, type, full, meta) {
                            return '<img class="img-responsive" src= "' + data + '" />';
                        }
                    },
                    { "data": "NombreRedSocial" },
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
                ],
                "order": [[1, "desc"]]
            });
        }
    },
    Agregar: function () {
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
    ObtenerDatos: function () {
        return Empresa_RedSocial.DATA;
    },
    UploadImage: function (e) {
        RequestHttp._UploadFile(e, URL_UPLOAD, function (data) {
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