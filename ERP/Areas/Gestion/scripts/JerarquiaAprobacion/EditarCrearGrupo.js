var JerarquiaAprobacionGrupoCrear = {
    USUARIOS: [],
    ID: -1,
    $TABLA: null,
    OnLoad: function () {
        JerarquiaAprobacionGrupoCrear.USUARIOS = [];
        JerarquiaAprobacionGrupoCrear.CrearTabla();
    },
    AgregarUsuario: function () {
        var usuarioId = $("#UsuarioId").val();
        if (!Validations._IsNull(usuarioId)) {
            var data = {
                Id: usuarioId,
                Nombre: $("#UsuarioId :selected").text()
            }

            if (JerarquiaAprobacionGrupoCrear.ValidarExisteUsuario(JerarquiaAprobacionGrupoCrear.USUARIOS, data.Id) == -1) {
                JerarquiaAprobacionGrupoCrear.USUARIOS.push(data);
                JerarquiaAprobacionGrupoCrear.CrearTabla();
                return true;
            }
        }
        return false;
    },
    ValidarExisteUsuario: function (datosTabla, busquedaId) {
        for (var i = 0; i < datosTabla.length; i++) {
            if (datosTabla[i].Id == busquedaId)
                return i;
        }
        return -1;
    },
    CrearTabla: function () {
        JerarquiaAprobacionGrupoCrear.$TABLA = $("#tabla_usuarios").dataTable({
            "bInfo": false,
            "destroy": true,
            "serverSide": false,
            "data": JerarquiaAprobacionGrupoCrear.USUARIOS,
            "columns": [
                { "data": "Nombre" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="JerarquiaAprobacionGrupoCrear.RemoverUsuario(' + data + ')" >';
                    }
                }
            ]
        });
    },
    RemoverUsuario: function (id) {
        var index = JerarquiaAprobacionGrupoCrear.ValidarExisteUsuario(JerarquiaAprobacionGrupoCrear.USUARIOS, id);
        if (index != -1) {
            JerarquiaAprobacionGrupoCrear.USUARIOS.splice(index, 1);

            JerarquiaAprobacionGrupoCrear.CrearTabla();
        }
    },
    AgregarGrupo: function () {
        if (JerarquiaAprobacionGrupoCrear.USUARIOS.length == 0) {
            Utils._BuilderMessage("warning", 'Debe seleccionar al menos un usuario que apruebe.');
            return false;
        }

        var $form = $('#form_jerarquia_aprobacion_grupo_crear');
        if ($form.valid()) {
            var posicionRentabilidadId = ($("#PosicionRentabilidadId").length > 0) ? $("#PosicionRentabilidadId").val() : null;

            var data = {
                Grupo: $("#Grupo").val(),
                Usuarios: JerarquiaAprobacionGrupoCrear.USUARIOS,
                PosicionRentabilidadId: posicionRentabilidadId
            };
            EditarJerarquiaAprobacion.AgregarGrupo(data);
            Utils._CloseModal();
        }
    },
    Cancelar: function () {
        Utils._CloseModal();
    }
}