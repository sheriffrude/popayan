$(function () {
    EditarJerarquiaAprobacion.OnLoad();
});

var EditarJerarquiaAprobacion = {
    $TABLA: null,
    GRUPOS_JERARQUIA: [],
    JERARQUIA_APROBACION_TIPO_ID: null,
    JERARQUIA_APROBACION_TIPOS: {
        Cotizacion: 1,
        PresupuestoInterno: 2,
        CancelacionPresupuesto: 3,
        Legalizacion: 4,
        FacturaProveedor: 5,
        CierrePresupuesto: 6,
        Anticipo: 7
    },
    POSICIONES_RENTABILIDAD: {
        PorDebajoEIgual: 0,
        PorEncima: 1
    },
    OnLoad: function () {
        EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID = $("#JerarquiaAprobacionTipoId").val();
        EditarJerarquiaAprobacion.CargarGrupos();
    },
    CargarGrupos() {
        RequestHttp._Post(URL_JERARQUIA_APROBACION_GRUPOS_LISTAR, null, null, function (response) {
            if (!Validations._IsNull(response)) {
                if (response.state) {
                    EditarJerarquiaAprobacion.GRUPOS_JERARQUIA = response.data;
                    EditarJerarquiaAprobacion.CrearTabla();
                } else
                    Utils._BuilderMessage("danger", response.message);
            }
        })
    },
    CrearTabla: function (data) {
        var visualizacionPosicionRentabilidad = [];
        if (EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            && EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
            && EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            && EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            && EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
        ) {
            visualizacionPosicionRentabilidad = [
                {
                    "targets": [2],
                    "visible": false,
                    "searchable": false
                }
            ];
        }

        var filtro = $("#input-filtro");
        EditarJerarquiaAprobacion.$TABLA = $("#tabla_grupos").DataTable({
            "destroy": true,
            "serverSide": false,
            "data": EditarJerarquiaAprobacion.GRUPOS_JERARQUIA,
            "columns": [
                { "data": "Orden" },
                { "data": "Grupo" },
                {
                    "data": "PosicionRentabilidadId",
                    "render": function (data, type, full, meta) {
                        var html = (data == 0) ? "Por Debajo e igual" : "Por Encima";
                        return html;
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<button type="button" class="btn btn-secondary btn-sm" onclick="EditarJerarquiaAprobacion.ListarGrupoUsuarios(' + data + ')" >Ver usuarios</button>';
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<button type="button" class="btn btn-danger btn-sm" onclick="EditarJerarquiaAprobacion.RemoverGrupo(' + data + ')" >' +
                            '<i class="fa fa-trash" aria-hidden="true"></i> Eliminar' +
                            '</button>';
                    }
                }
            ],
            "columnDefs": visualizacionPosicionRentabilidad,
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },
    RecargarTablaPage: function () {
        if (EditarJerarquiaAprobacion.$TABLA != null)
            EditarJerarquiaAprobacion.$TABLA.destroy();
        EditarJerarquiaAprobacion.CrearTabla();
    },
    AgregarGrupo: function (data) {
        if (EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
        ) {
            var orden = 0;
            for (var i = 0; i < EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
                if (data.PosicionRentabilidadId == EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].PosicionRentabilidadId)
                    orden++;
            }

            var index = EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length + 1;
            data.Id = index;

            orden++;
            data.Orden = orden;
            EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.push(data);
        } else {
            var orden = EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length + 1;
            data.Id = orden;
            data.Orden = orden;
            EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.push(data);
        }

        EditarJerarquiaAprobacion.RecargarTablaPage();
        return false;
    },
    RemoverGrupo: function (id) {
        var index = EditarJerarquiaAprobacion.VerificarPorId(id);
        if (index != -1) {
            if (EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
                || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
                || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
                || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CierrePresupuesto) {

                var posicionRentabilidadId = EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[index].PosicionRentabilidadId;
                for (var i = index; i < EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
                    if (posicionRentabilidadId == EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].PosicionRentabilidadId)
                        EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Orden--;
                }
            }

            EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.splice(index, 1);
            EditarJerarquiaAprobacion.CrearTabla();
        }
    },
    VerificarPorId: function (id) {
        for (var i = 0; i < EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
            if (id == EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Id)
                return i;
        }
        return -1;
    },
    ListarGrupoUsuarios: function (grupoId) {
        for (var i = 0; i < EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
            if (EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Id == grupoId) {
                JerarquiaAprobacionListarGrupoUsuarios.GRUPO_ID = grupoId;
                JerarquiaAprobacionListarGrupoUsuarios.DATA = EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Usuarios;
                break;
            }
        }

        Utils._OpenModal(URL_JERARQUIA_APROBACION_LISTAR_GRUPO_USUARIOS, JerarquiaAprobacionListarGrupoUsuarios.OnLoad);
    },
    OnBegin: function (jqXHR, settings) {
        if (EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == EditarJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
        ) {
            var porcentajeRentabilidad = $("#PorcentajeRentabilidad").val();
            if (Validations._IsNull(porcentajeRentabilidad)) {
                Utils._BuilderMessage("warning", "Debe ingresar un porcentaje de rentabilidad para poder continuar.");
                return false;
            }

            //Validar Grupos de rentabilidad
            if (EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length <= 0) {
                Utils._BuilderMessage("warning", "Debe ingresar al menos un grupo para cada Posición de Rentabilidad (Por Debajo e Igual y Por Encima) para poder continuar.");
                return false;
            }

            var gruposPorDebajoEIgual = 0;
            var gruposPorEncima = 0;
            for (var i = 0; i < EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
                if (EditarJerarquiaAprobacion.GRUPOS_JERARQUIA[i].PosicionRentabilidadId == EditarJerarquiaAprobacion.POSICIONES_RENTABILIDAD.PorDebajoEIgual)
                    gruposPorDebajoEIgual++;
                else
                    gruposPorEncima++;
            }
            //Validar Grupo por Debajo e Igual
            if (gruposPorDebajoEIgual <= 0) {
                Utils._BuilderMessage("warning", "Debe ingresar al menos un grupo con Posición de Rentabilidad \"Por Debajo e igual\" para poder continuar.");
                return false;
            }
            //Validar Grupo por Encima
            if (gruposPorEncima <= 0) {
                Utils._BuilderMessage("warning", "Debe ingresar al menos un grupo con Posición de Rentabilidad \"Por Encima\" para poder continuar.");
                return false;
            }
        } else {
            if (EditarJerarquiaAprobacion.GRUPOS_JERARQUIA.length <= 0) {
                Utils._BuilderMessage("warning", "Debe ingresar al menos un grupo para poder continuar.");
                return false;
            }
        }

        //Usuarios
        var grupos = EditarJerarquiaAprobacion.GRUPOS_JERARQUIA;
        for (var i = 0; i < grupos.length; i++) {
            var usuarios = [];
            for (var j = 0; j < grupos[i].Usuarios.length; j++) {
                usuarios.push(grupos[i].Usuarios[j].Id);
            }
            grupos[i].Usuarios = usuarios;
        }

        var data = $(this).serializeObject();
        data["Grupos"] = grupos;
        settings.data = jQuery.param(data);
        return true;
    },
    OnComplete: function (response) {
        var data = RequestHttp._ValidateResponse(response);
        if (!Validations._IsNull(data)) {
            if (data.state == true) {
                Utils._BuilderMessage("success", data.message, EditarJerarquiaAprobacion.Cancelar);
            }
            else
                Utils._BuilderMessage("danger", data.message);
        }
    },
    Cancelar: function () {
        location.href = URL_JERARQUIA_APROBACION_LISTAR;
    }
}