var editarPlan = function () {
    return {
        DataRecursos: [],
        TablaRecursos: null,

        init: function () {
            $('#Anio').datepicker({
                changeMonth: false,
                changeYear: true,
                showButtonPanel: true,
                dateFormat: 'yy',
                onClose: function (dateText, inst) {
                    var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                    $(this).datepicker('setDate', new Date(year, 0, 1));
                }
            });
            editarPlan.CrearTablaRecursos();
            editarPlan.calcularAcumuladoMensual();
        },

        seleccionaMetaAnual: function () {
            var meta = $("#MetaAnual").val();
            var itemsMensuales = $(".planMensual");

            if (!isNaN(meta) && meta != undefined && itemsMensuales != undefined) {
                var cantidadMeses = itemsMensuales.length;

                if (cantidadMeses > 0) {
                    var promedioMensual = meta / cantidadMeses;

                    $(".planMensual .metaPromedioClass").val(promedioMensual);

                    var cantidadRecursos = editarPlan.DataRecursos.length;
                    if (cantidadRecursos > 0) {
                        var metaRecurso = promedioMensual / (cantidadRecursos);
                        $(".planMensual .metaPromedioRecursosClass").val(metaRecurso);
                    }
                    $("#PromedioMensual").val(promedioMensual);
                }
            }
        },

        actualizarMetaRecurso: function () {

            var cantidadRecursos = editarPlan.DataRecursos.length;
            var promedioMensual = $(".planMensual .metaPromedioClass").val();

            var metaRecurso = promedioMensual / cantidadRecursos;
            $(".metaPromedioClass").each(function (index) {
                $(".planMensual #" + this.id + "-recurso").val(metaRecurso);
            });

            $(".metaEstimadaClass").each(function (index) {
                var estimadoMensual = $("#" + this.id).val();
                var estimadoMensualRecurso = 0;
                if (cantidadRecursos > 0) estimadoMensualRecurso = estimadoMensual / cantidadRecursos;
                $(".planMensual #" + this.id + "-recurso").val(estimadoMensualRecurso);
            });

            $(".utilidadClass").each(function (index) {
                var utilidadMensual = $("#" + this.id).val();
                var estimadoUtilidadRecurso = 0;
                if (cantidadRecursos > 0) {
                    estimadoUtilidadRecurso = utilidadMensual / cantidadRecursos;
                    estimadoUtilidadRecurso = Math.ceil(estimadoUtilidadRecurso) + "%";
                }
                $(".planMensual #" + this.id + "-recurso").val(estimadoUtilidadRecurso);
            });


        },

        actualizarAcumuladoMensual: function (e) {

            var acumuladoMensual = Number($("#AcumuladoMeses").val());
            var metaAnual = Number($("#MetaAnual").val());

            //Elemento que dispara el evento 
            var idElemento = e.target.id;
            var separador = "-";
            var indice = idElemento.split(separador);

            var valorFinal = 0;

            //Validación de valor total mensual
            var listadoValores = $(".metaEstimadaClass");
            if (listadoValores != undefined) {
                for (var i = 0; i < listadoValores.length; i++) {
                    valorFinal = valorFinal + Number(listadoValores[i].value)
                }
            } else return false;

            if (valorFinal > metaAnual) {
                $("#" + idElemento).val("");
                Utils._BuilderMessage("warning", "El acumulado mensual no puede superar la meta anual");
                return false;
            }
            $("#AcumuladoMeses").val(valorFinal);

            var cantidadRecursos = editarPlan.DataRecursos.length;

            if (cantidadRecursos > 0) {
                var promedioRecurso = $("#" + idElemento).val() / (cantidadRecursos);
                $(".planMensual #" + idElemento + "-recurso").val(promedioRecurso);
                var utilidad = Number($("#" + idElemento).val()) - Number($(".planMensual #metaPromedio-" + indice[1]).val());
                $(".planMensual #utilidad-" + indice[1]).val(utilidad);
            } else {
                $(".planMensual #" + idElemento + "-recurso").val(0);
            }
        },

        actualizarUtilidadMensual: function (e) {
            //Elemento que dispara el evento 
            var idElemento = e.target.id;
            var valorFinal = $("#" + idElemento).val();
            var cantidadRecursos = generarPlan.DataRecursos.length;
            if (cantidadRecursos > 0) {
                var promedioRecurso = valorFinal / (cantidadRecursos);
                $(".planMensual #" + idElemento + "-recurso").val(Math.ceil(promedioRecurso) + "%");
            } else {
                $(".planMensual #" + idElemento + "-recurso").val(0);
            }
        },

        onBegin: function (jqXHR, settings) {
            var data = $(this).serializeObject();
            data["DetallePlan"] = editarPlan.obtenerDetallePlan();
            data["PlanMensual"] = editarPlan.obtenerPlanMensual();
            data["PlanRecursos"] = editarPlan.DataRecursos;
            settings.data = jQuery.param(data);
            return true;
        },

        onComplete: function (response) {
            var resultado = RequestHttp._ValidateResponse(response);
            if (resultado != null) {
                if (resultado.state == true)
                    Utils._BuilderMessage("success", resultado.message,  "editarPlan.RedireccionarListarPlan");
                else
                    Utils._BuilderMessage("danger", resultado.message);
            }
        },

        calcularAcumuladoMensual: function () {
            var valorFinal = 0;
            var acumuladoMensual = Number($("#AcumuladoMeses").val());
            var metaAnual = Number($("#MetaAnual").val());

            //Validación de valor total mensual
            var listadoValores = $(".metaEstimadaClass");
            if (listadoValores != undefined) {
                for (var i = 0; i < listadoValores.length; i++) {
                    valorFinal = valorFinal + Number(listadoValores[i].value)
                }
            } else return false;

            if (valorFinal > metaAnual) {
                $("#AcumuladoMeses").val(0);
                Utils._BuilderMessage("warning", "El acumulado mensual no puede superar la meta anual");
                return false;
            }
            $("#AcumuladoMeses").val(valorFinal);
        },

        validarFinalizacion: function () {
            var contadorMesesNoCompletados = 0;
            var idElemento = "";
            var idMes = "";
            var indiceMes = -1;

            var listadoMeses = $(".planMensual");
            if (listadoMeses != undefined) {
                for (var i = 0; i < listadoMeses.length; i++) {
                    idElemento = listadoMeses[i].getAttribute("id");
                    indiceMes = idElemento != undefined ? idElemento.split("-")[1] : "";

                    if (indiceMes != "") {
                        if ($("#metaEstimada-" + indiceMes).val() == 0 && $("#utilidad-" + indiceMes).val() == 0)
                            contadorMesesNoCompletados++;
                    }
                }

                if (contadorMesesNoCompletados > 0) { }
                $("#planNegocioForm").submit();
            }
        },

        AdicionarRecurso: function () {

            var recurso = $("#DocumentoRecurso").val();
            var recursoTxt = $("#DocumentoRecurso").find('option:selected').text();
            var porcentaje = $("#Porcentaje").val();

            var countDataSet = editarPlan.DataRecursos.length;
            for (var i = 0; countDataSet > i; i++) {
                if (editarPlan.DataRecursos[i]["Value"] == recurso) {
                    Utils._BuilderMessage('info', 'Este recurso ya se encuentra registrado');
                    return false;
                }
            }


            if (porcentaje <= 0) {
                Utils._BuilderMessage('info', 'Debe ingresar un porcentaje mayor a 0.');
                return false;
            }

            if ((editarPlan.TotalPorcentaje + parseInt(porcentaje)) > 100) {
                Utils._BuilderMessage('info', 'No se puede superar el 100 % ');
                return false;
            }

            /** Validar agregar dato **/
            editarPlan.TotalPorcentaje = 0;
            for (var i = 0; i < editarPlan.DataRecursos.length; i++) {
                editarPlan.TotalPorcentaje = editarPlan.TotalPorcentaje + parseInt(editarPlan.DataRecursos[i]["Porcentaje"]);
            }

            if ((editarPlan.TotalPorcentaje + parseInt(porcentaje)) > 100) {
                Utils._BuilderMessage('info', 'No se puede superar el 100 % ');
                return false;
            }

            editarPlan.DataRecursos.push({
                Text: recursoTxt,
                Value: recurso,
                Porcentaje: porcentaje
            });

            editarPlan.TotalPorcentaje = 0;

            for (var i = 0; i < editarPlan.DataRecursos.length; i++) {
                editarPlan.TotalPorcentaje = editarPlan.TotalPorcentaje + parseInt(editarPlan.DataRecursos[i]["Porcentaje"]);
            }


            if (editarPlan.TablaRecursos != null)
                editarPlan.TablaRecursos.fnDestroy();


            editarPlan.ActualizarTablaRecursos(editarPlan.DataRecursos);
            editarPlan.actualizarMetaRecurso();
            return false;
        },

        EliminarRecurso: function (id) {
            var tamanoDataSet = editarPlan.DataRecursos.length;
            var posicionOpcion = 0;
            for (var i = 0; tamanoDataSet > i; i++) {
                if (editarPlan.DataRecursos[i]["Value"] == id) {
                    posicionOpcion = i;
                    break;
                }
            }
            editarPlan.DataRecursos.splice(posicionOpcion, 1);
            if (editarPlan.TablaRecursos != null) {
                editarPlan.TablaRecursos.fnDestroy();
            }
            editarPlan.ActualizarTablaRecursos(editarPlan.DataRecursos);
            editarPlan.actualizarMetaRecurso();
            return false;
        },

        ActualizarTablaRecursos: function (data) {
            editarPlan.TablaRecursos = $("#tabla-recursos").dataTable({
                "bFilter": false,
                "bLengthChange": false,
                "destroy": true,
                "serverSide": false,
                "bPaginate": false,
                "data": data,
                "columns": [
                    {
                        "title": "Recurso",
                        "data": "Text",
                        "orderable": false
                    },
                    {
                        "title": "Porcentaje",
                        "data": "Porcentaje",
                        "orderable": false
                    },
                    {
                        "data": "Value",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            var html = '<a class="btn btn-danger btn-sm" onclick="editarPlan.EliminarRecurso(' + data + ')" ><span class="glyphicon glyphicon-minus"></span></a>';
                            html += '<input type="hidden" name="Correos" value="' + full.email + '" />';
                            return html;
                        }
                    }
                ]
            });
        },

        CrearTablaRecursos: function () {
            editarPlan.TablaRecursos = $("#tabla-recursos").dataTable({
                "bFilter": false,
                "bLengthChange": false,
                "ajax": {
                    "url": URL_LISTAR_RECURSOS,
                    "type": "POST",
                    "dataSrc": function (json) {
                        editarPlan.DataRecursos = json.data;
                        return json.data;
                    }
                },
                "columns": [
                    {
                        "title": "Recurso",
                        "data": "Text",
                        "orderable": false
                    },
                    {
                        "title": "Porcentaje",
                        "data": "Porcentaje",
                        "orderable": false
                    },
                    {
                        "data": "Value",
                        "orderable": false,
                        "searchable": false,
                        "width": "5%",
                        "render": function (data, type, full, meta) {
                            var html = '<a class="btn btn-danger btn-sm" onclick="editarPlan.EliminarRecurso(' + data + ')" ><span class="glyphicon glyphicon-minus"></span></a>';
                            html += '<input type="hidden" name="Correos" value="' + full.email + '" />';
                            return html;
                        }
                    }
                ]
            });
        },

        obtenerDetallePlan: function () {
            var parametros = {
                Id: $("#planNegocioId").val(),
                Nombre: $("#Nombre").val(),
                UnidadNegocioId: $("#UnidadNegocioId").val(),
                MetaAnual: $("#MetaAnual").val(),
                PromedioMensual: $("#PromedioMensual").val(),
                Anio: $("#Anio").val(),
                EmpresaId: $("#empresaId").val(),
            };

            return parametros;
        },

        obtenerPlanMensual: function () {
            var dataPlanesMensuales = {};
            var dataPlanMensual = [];

            var listadoMeses = $(".planMensual");
            if (listadoMeses != undefined) {
                for (var i = 0; i < listadoMeses.length; i++) {

                    var idPlan = listadoMeses[i].getAttribute("id");
                    var mesPlan = idPlan != undefined ? idPlan.split("-")[1] : "";

                    if (mesPlan != "") {
                        var metaPromedio = $("#" + idPlan + " #metaPromedio-" + mesPlan).val();
                        var metaPromedioRecurso = $("#" + idPlan + " #metaPromedio-" + mesPlan + "-recurso").val();
                        var metaEstimada = $("#" + idPlan + " #metaEstimada-" + mesPlan).val();
                        var metaEstimadaRecurso = $("#" + idPlan + " #metaEstimada-" + mesPlan + "-recurso").val();
                        var utilidad = $("#" + idPlan + " #utilidad-" + mesPlan).val();
                        var utilidadRecurso = $("#" + idPlan + " #utilidad-" + mesPlan + "-recurso").val();
                        var nombreMes = $("#" + idPlan + " #nombre-mes-" + mesPlan).val();
                        var id = $("#" + idPlan + " #planmensual-id-" + mesPlan).val();
                        var parametros = {
                            Id: id,
                            IdMes: mesPlan,
                            NombreMes: nombreMes,
                            MetaPromedio: metaPromedio,
                            MetaPromedioRecurso: metaPromedioRecurso,
                            MetaEstimada: metaEstimada,
                            MetaEstimadaRecurso: metaEstimadaRecurso,
                            Utilidad: utilidad,
                            UtilidadRecurso: utilidadRecurso
                        };

                        dataPlanMensual.push(parametros);
                    }
                }
            }
            return dataPlanMensual;
        },

        OnchangeUnidadNegocio: function (e) {
            var unidadNegocioId = $("#UnidadNegocioId").val();
            if (unidadNegocioId > 0) {
                var parameters = {
                    unidadId: unidadNegocioId,
                    empresaId: $("#empresaId").val()
                };
                var $elementList = $("#DocumentoRecurso");
                Utils._GetDropDownList($elementList, URL_CAMBIO_UNIDAD_NEGOCIO, parameters, true);
            }
        },
        
        RedireccionarListarPlan: function () {
            window.location = URL_LISTAR_PLANES;
        }
    }
}();

