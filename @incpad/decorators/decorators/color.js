function Hex2Rgba(alpha = 1) {
    if (typeof alpha !== 'number') {
        alpha = 1;
    }
    return function(target, name, desc) {
        if (Object.getOwnPropertyDescriptor(target, name) !== undefined) {
            target[name] = hexToRgba(target[name], alpha);
        } else {
            // means maybe its a class and haven't be inited,so changed the setter
            //force init to get the value
            let value = desc.initializer ? desc.initializer() : desc.value;
            value = hexToRgba(value, alpha);
            Object.defineProperty(target, name, {
                get() {
                    return value;
                },
                set(x) {
                    value = hexToRgba(x, alpha);
                },
                configurable: true, //just prevent the error caused by hot reload
            });
        }
        return target;
    };
}

function hexToRgba(hex, al) {
    let hexColor = /^#/.test(hex) ? hex.slice(1) : hex;
    const alp = hex === 'transparent' ? 0 : Math.ceil(al);
    let r, g, b;
    hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff';
    if (hexColor.length === 3) {
        hexColor = hexColor.replace(/(\w)(\w)(\w)/gi, '$1$1$2$2$3$3');
    }
    r = hexColor.slice(0, 2);
    g = hexColor.slice(2, 4);
    b = hexColor.slice(4, 6);
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);
    return (
        'rgba(' + r + ', ' + g + ', ' + b + ', ' + (alp / 100).toFixed(2) + ')'
    );
}

module.exports = {
    Hex2Rgba,
};
