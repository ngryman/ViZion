module.exports = {
    DirectoryInfo: function(folder, items) {
        this.path = folder;
        this.items = items || DirectoryItem[0];
    },
    DirectoryItem: function(name, path, type) {
        this.name = name;
        this.path = path;
        this.type = type;
    }
};