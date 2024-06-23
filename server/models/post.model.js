module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postContent: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tags: {
            type: DataTypes.STRING, 
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'userId',
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        published: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
          },
    });

    Post.associate = (models) => {
        Post.belongsTo(models.Users, {
            foreignKey: 'userId',
            onDelete: 'cascade',
        });
        Post.hasMany(models.Comments, {
            foreignKey: 'postId',
            onDelete: 'cascade',
        })
    };

    return Post;
};
