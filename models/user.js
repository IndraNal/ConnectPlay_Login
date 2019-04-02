// // Import the ORM to create functions that will interact with the database.
// module.exports = function (sequelize, DataTypes) {
//   var User = sequelize.define("User", {

//     id: {
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//       type: DataTypes.INTEGER
//     },
//     name: {
//       type: DataTypes.STRING,
//       notEmpty: true
//     },

//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         isEmail: {
//           msg: "Must be a valid email address",
//         }
//       }
//     },
//     username: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }

//   });
//   return User;
// };


var bcrypt = require('bcrypt');

// Import the ORM to create functions that will interact with the database.
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {

    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Must be a valid email address",
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    logout: {
      type: DataTypes.DATE,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  });

  // methods ======================
  // generating a hash
  // User.generateHash = function (password) {
  //   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  // };

  // // checking if password is valid
  // User.prototype.validPassword = function (password) {
  //   return bcrypt.compareSync(password, this.account_key);
  // };


  return User;
};
