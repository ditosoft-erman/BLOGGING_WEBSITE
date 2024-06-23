module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
        commentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        commentBody: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    
    Comments.associate = (models) => {
        Comments.belongsTo(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        });
        Comments.belongsTo(models.Post, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        });
    };
    return Comments;
};
