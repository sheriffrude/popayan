var listarPlan = function () {
    return {
        tablaRecursos: null,
        init: function () {
            $("#btn-editar").hide();
        },
        cambiarUnidadNegocio: function () {
            listarPlan.limpiarCampos();
            var unidadNegocioId = $("#UnidadNegocioId").val();
            if (unidadNegocioId > 0) {
                var parameters = {
                    unidadId: unidadNegocioId,
                    empresaId: $("#EmpresaId").val()
                };
                var $elementList = $("#Anio");
                Utils._GetDropDownList($elementList, URL_CAMBIO_UNIDAD_NEGOCIO, parameters);
            }
        },
        buscarDetallePlan: function () {
            listarPlan.limpiarCampos();
            var parametros = {
                empresaId: $("#EmpresaId").val(),
                unidadId: $("#UnidadNegocioId").val(),
                anio: $("#Anio").val()
            };
            $.ajax({
                url: URL_CONSULTAR_PLAN_NEGOCIO,
                type: 'POST',
                dataType: 'json',
                data: parametros,
                success: function (respuesta) {
                    if (respuesta.state == true) {
                        var data = respuesta.data;
                        $("#MetaAnual").val(data.MetaAnual);
                        $("#PromedioMensual").val(data.PromedioMensual);
                        listarPlan.construirTablaPlan();
                        $("#btn-editar").attr("href", URL_EDITAR_PLAN + "?id=" + data.Id);
                        $("#btn-editar").show();
                    } else {
                        Utils._BuilderMessage("danger", respuesta.message);
                    }
                }
            });
        },
        limpiarCampos: function () {
            $("#btn-editar").hide();
            $("#btn-editar").attr("href", "");
        },
        construirTablaPlan: function () {
            listarPlan.tablaRecursos = $("#tabla-plan").DataTable({
                "scrollX": true,
                "order": [[0, "asc"]],
                "ajax": {
                    "url": URL_LISTAR_PLAN_NEGOCIO,
                    "type": "POST",
                    "data": function (d) {
                        return $.extend({}, d, {
                            "adicional": {
                                filtroUnidadNegocioId: $("#UnidadNegocioId").val(),
                                filtroAnio: $("#Anio").val(),
                            }
                        });
                    },
                }, "columns": [
                    { "data": "MesId" },
                    { "data": "NombreMes" },
                    { "data": "MetaPromedio" },
                    { "data": "NombreCompleto" },
                    { "data": "MetaPromedioRecurso" },
                    { "data": "MetaEstimada" },
                    { "data": "MetaEstimadaRecurso" },
                    {
                        "data": "Utilidad",
                        "orderable": false,
                        "searchable": false,
                        "render": function (data, type, full, meta) {
                            var value = "";
                            if (data != null) value = data + '%';
                            return value;
                        }
                    },
                    { "data": "UtilidadRecurso" }
                ]
            });
        }
    }
}();

