/* Testing Utilities */
utils = {
    'randomEmail': function() {
        var num = Math.floor(Math.random() * (10000 - 1) + 1);
        return ''.concat('citizen', num, '@example.com')
    },
    'randomUser': function() {
        var num = Math.floor(Math.random() * (10000 - 1) + 1);
        return ''.concat('citizen', num)
    }
}

module.exports = utils
