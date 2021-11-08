const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },

    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
    },
    rol: {
      type: String,
      required: true,
      default: 'PATIENT_ROLE',
      emun: ['ADMIN_ROLE', 'USER_ROLE', 'PATIENT_ROLE'],
    },
    tel: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

UsuarioSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
};

module.exports = model('Usuario', UsuarioSchema);
