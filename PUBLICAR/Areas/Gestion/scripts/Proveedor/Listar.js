var tablaDocumentos = null;

var ListarProveedores = function () {
    return {

        urlListar: "",
        urlAgregar: "",
        urlEditar: "",

        //Carga inicial que recibe las url de cada CRUD
        init: function (listar) {
            ListarProveedores.construirTabla();
        },

        reconstruirTabla: function () {
            tablaDocumentos.draw();
        },

        ResetearTablaPais: function () {
            $("#input-filtro").val("");
            this.reconstruirTabla();
        },

        //Construye la tabla de salarios integrales
        construirTabla: function () {
            var filtro = $("#input-filtro");
            tablaDocumentos = $("#tabla-proveedor").DataTable({
                "ajax": {
                    "url": URL_LISTAR_PROVEEDOR,
                    "type": "POST",
                    "data": function (d) {
                        d.search['value'] = filtro.val();
                        return $.extend({}, d, {
                            "adicional": {
                            }
                        });
                    }
                },
                "columns": [
                    { "data": "Nit" },
                    {
                        "data": "NombreComercial",
                        "orderable": false,
                        "searchable": false,
                        "width": "20%",
                        "render": function (data, type, full, meta) {
                            var botonVer = '<a href="' + URL_VER_PROVEEDOR + '?id=' + full.Id + '" class="btn btn-secondary btn-xs" >' + data + '</a>'

                            var resultado = ""

                            resultado += (PERMISO_VER_PROVEEDOR) ? botonVer : "";

                            return resultado;
                        }
                    },
                    { "data": "Direccion" },
                    { "data": "Telefono" },
                    { "data": "Correo" },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "20%",
                        "render": function (data, type, full, meta) {
                            return '<a href="' + URL_SERVICIOS + '?id=' + data + '&nombre=' + full.NombreComercial + '" data-toggle="modal" data-target="#"  data-execute-onload="onLoadListarServicios" class="btn btn-secondary btn-xs">SERVICIOS</a>';

                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "12%",
                        "render": function (data, type, full, meta) {

                            var botonDocumento = '<a href="' + URL_DOCUMENTO_PROVEEDOR + '?id=' + data + '" class="btn btn-secondary btn-xs" title="Documentos"><span class = "glyphicon glyphicon-file" aria-hidden="true"></span></a>'

                            var resultado = ""
                            resultado += (PERMISO_DOCUMENTO_PROVEEDOR) ? botonDocumento : "";

                            return resultado;
                        }
                    },
                    {
                        "data": "Id",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            var checked = (full.Estado == true) ? "checked" : "";
                            var botonEstado = '<input type="checkbox" ' + checked + ' class="boton-desactivar-proveedor btn-xs" onchange="ListarProveedores.CambiarEstadoProveedor(this)" data-toggle="toggle" data-onstyle="success" data-offstyle="danger" value="' + data + '">'

                            var resultado = ""
                            resultado += (PERMISO_CAMBIAR_ESTADO_PROVEEDOR) ? botonEstado : "";
                            return resultado;

                        }
                    }
                ],
                "drawCallback": function (settings) {
                    Utils._BuilderModal();
                    $(".boton-desactivar-proveedor").bootstrapToggle({
                        on: '',
                        off: ''
                    });
                }
            });
        },

        CambiarEstadoProveedor: function (e) {
            var estado = ($(e).is(":checked") == true);
            var id = $(e).val();
            var parameters = {
                id: id,
                estado: estado
            };

            $.ajax({
                url: URL_CAMBIAR_ESTADO_PROVEEDOR,
                type: "POST",
                dataType: "json",
                data: parameters,
                success: function (data, text) {
                    ListarProveedores.reconstruirTabla();
                },
                error: function(request, status, error) {
                    Utils._BuilderMessage("danger", error);
                }
            });
        }
    }
}();

$(function () {
    ListarProveedores.init();
});