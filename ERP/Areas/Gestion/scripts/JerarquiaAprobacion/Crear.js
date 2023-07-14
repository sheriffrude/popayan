$(function () {
    CrearJerarquiaAprobacion.OnLoad();
});

var CrearJerarquiaAprobacion = {
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
        CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID = $("#JerarquiaAprobacionTipoId").val();
        CrearJerarquiaAprobacion.CrearTabla();
    },
    OnChangeEmpresa: function () {
        var empresaId = $("#Empresas").val();
        console.log(empresaId);
        if (Validations._IsNull(empresaId)) {
            $("#CentrosCosto, #Clientes").prop("disabled", false);
            Utils._GetDropDownList($("#CentrosCosto"), URL_UNIDAD_NEGOCIO_LISTAR, null, false);
            Utils._GetDropDownList($("#Clientes"), URL_CLIENTE_LISTAR, null, false);
        } else {
            if (empresaId.length == 1) {
                $("#CentrosCosto, #Clientes").prop("disabled", false);
                Utils._GetDropDownList($("#CentrosCosto"), URL_UNIDAD_NEGOCIO_POR_EMPRESA_LISTAR, { id: empresaId }, false);
                Utils._GetDropDownList($("#Clientes"), URL_CLIENTE_POR_EMPRESA_LISTAR, { empresaId: empresaId }, false);
            } else {
                $("#CentrosCosto, #Clientes").val([]);
                $("#CentrosCosto, #Clientes").prop("disabled", true);
            }

        }
    },
    CrearTabla: function (data) {
        var visualizacionPosicionRentabilidad = [];
        if (CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            && CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
            && CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            && CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            && CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID != CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
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
        CrearJerarquiaAprobacion.$TABLA = $("#tabla_grupos").DataTable({
            "destroy": true,
            "serverSide": false,
            "data": CrearJerarquiaAprobacion.GRUPOS_JERARQUIA,
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
                        return '<button type="button" class="btn btn-secondary btn-sm" onclick="CrearJerarquiaAprobacion.ListarGrupoUsuarios(' + data + ')" >Ver usuarios</button>';
                    }
                },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<button type="button" class="btn btn-danger btn-sm" onclick="CrearJerarquiaAprobacion.RemoverGrupo(' + data + ')" >' +
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
        if (CrearJerarquiaAprobacion.$TABLA != null)
            CrearJerarquiaAprobacion.$TABLA.destroy();
        CrearJerarquiaAprobacion.CrearTabla();
    },
    AgregarGrupo: function (data) {
        if (CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
        ) {
            var orden = 0;
            for (var i = 0; i < CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
                if (data.PosicionRentabilidadId == CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].PosicionRentabilidadId)
                    orden++;
            }

            var index = CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length + 1;
            data.Id = index;

            orden++;
            data.Orden = orden;
            CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.push(data);
        } else {
            var orden = CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length + 1;
            data.Id = orden;
            data.Orden = orden;
            CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.push(data);
        }

        CrearJerarquiaAprobacion.RecargarTablaPage();
        return false;
    },
    RemoverGrupo: function (id) {
        var index = CrearJerarquiaAprobacion.VerificarPorId(id);
        if (index != -1) {
            CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.splice(index, 1);
            CrearJerarquiaAprobacion.CrearTabla();
        }
    },
    VerificarPorId: function (id) {
        for (var i = 0; i < CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
            if (id == CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Id)
                return i;
        }
        return -1;
    },
    ListarGrupoUsuarios: function (grupoId) {
        for (var i = 0; i < CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
            if (CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Id == grupoId) {
                JerarquiaAprobacionListarGrupoUsuarios.GRUPO_ID = grupoId;
                JerarquiaAprobacionListarGrupoUsuarios.DATA = CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Usuarios;
                break;
            }
        }

        Utils._OpenModal(URL_JERARQUIA_APROBACION_LISTAR_GRUPO_USUARIOS, JerarquiaAprobacionListarGrupoUsuarios.OnLoad);
    },
    OnBegin: function (jqXHR, settings) {
        var empresaId = $("#Empresas").val();
        var centroCostoId = $("#CentroCostos").val();
        var clienteId = $("#Clientes").val();

        if (Validations._IsNull(empresaId)
            && Validations._IsNull(centroCostoId)
            && Validations._IsNull(clienteId)) {
            Utils._BuilderMessage("warning", "Debe seleccionar una Empresa o Centro de Costo o Cliente para poder continuar.");
            return false;
        }

        if (CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.PresupuestoInterno
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.Cotizacion
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
            || CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPO_ID == CrearJerarquiaAprobacion.JERARQUIA_APROBACION_TIPOS.CancelacionPresupuesto
        ) {
            var porcentajeRentabilidad = $("#PorcentajeRentabilidad").val();
            if (Validations._IsNull(porcentajeRentabilidad)) {
                Utils._BuilderMessage("warning", "Debe ingresar un porcentaje de rentabilidad para poder continuar.");
                return false;
            }

            //Validar Grupos de rentabilidad
            if (CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length <= 0) {
                Utils._BuilderMessage("warning", "Debe ingresar al menos un grupo para cada Posición de Rentabilidad (Por Debajo e Igual y Por Encima) para poder continuar.");
                return false;
            }

            var gruposPorDebajoEIgual = 0;
            var gruposPorEncima = 0;
            for (var i = 0; i < CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
                if (CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].PosicionRentabilidadId == CrearJerarquiaAprobacion.POSICIONES_RENTABILIDAD.PorDebajoEIgual)
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
            if (CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length <= 0) {
                Utils._BuilderMessage("warning", "Debe ingresar al menos un grupo para poder continuar.");
                return false;
            }
        }

        //Usuarios
        var grupos = CrearJerarquiaAprobacion.GRUPOS_JERARQUIA;
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
                Utils._BuilderMessage("success", data.message, CrearJerarquiaAprobacion.Cancelar);
            }
            else
                Utils._BuilderMessage("danger", data.message);
        }
    },
    Cancelar: function () {
        location.href = URL_JERARQUIA_APROBACION_LISTAR;
    }
}