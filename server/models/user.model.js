module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        picturePath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
          },
    });

    Users.associate = (models) => {
        Users.hasMany(models.Post, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        });
        Users.hasMany(models.Comments, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        });
    };

    return Users;
};
