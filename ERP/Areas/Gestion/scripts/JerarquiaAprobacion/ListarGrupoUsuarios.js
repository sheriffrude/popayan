var JerarquiaAprobacionListarGrupoUsuarios = {
    DATA: null,
    GRUPO_ID: null,
    $TABLA: null,
    OnLoad: function () {
        JerarquiaAprobacionListarGrupoUsuarios.CrearTabla();
    },
    CrearTabla: function () {
        JerarquiaAprobacionListarGrupoUsuarios.$TABLA = $("#tabla_grupo_usuarios").DataTable({
            "destroy": true,
            "serverSide": false,
            "data": JerarquiaAprobacionListarGrupoUsuarios.DATA,
            "columns": [
                { "data": "Nombre" },
                {
                    "data": "Id",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<button type="button" class="btn btn-danger btn-sm" onclick="JerarquiaAprobacionListarGrupoUsuarios.Eliminar(' + data + ')" >' +
                            '<i class="fa fa-trash" aria-hidden="true"></i> Eliminar' +
                            '</button>';
                    }
                }
            ],
            "drawCallback": function (settings) {
                Utils._BuilderModal();
            }
        });
    },
    Eliminar: function (usuarioId) {
        if (JerarquiaAprobacionListarGrupoUsuarios.DATA.length <= 1) {
            Utils._BuilderMessage("warning", "El Grupo debe tener mínimo (1) Usuario asociado.");
            return false;
        }

        for (var i = 0; i < JerarquiaAprobacionListarGrupoUsuarios.DATA.length; i++) {
            if (JerarquiaAprobacionListarGrupoUsuarios.DATA[i].Id == usuarioId) {
                JerarquiaAprobacionListarGrupoUsuarios.DATA.splice(i, 1);
                break;
            }
        }

        for (var i = 0; i < CrearJerarquiaAprobacion.GRUPOS_JERARQUIA.length; i++) {
            if (CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Id == JerarquiaAprobacionListarGrupoUsuarios.GRUPO_ID) {
                CrearJerarquiaAprobacion.GRUPOS_JERARQUIA[i].Usuarios = JerarquiaAprobacionListarGrupoUsuarios.DATA;
                break;
            }
        }
        JerarquiaAprobacionListarGrupoUsuarios.RecargarTabla();
    },
    RecargarTabla: function () {
        if (JerarquiaAprobacionListarGrupoUsuarios.$TABLA != null)
            JerarquiaAprobacionListarGrupoUsuarios.$TABLA.destroy();
        JerarquiaAprobacionListarGrupoUsuarios.CrearTabla();
    }
}