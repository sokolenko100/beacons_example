// cSpell:ignore isstring
import { Dimensions } from 'react-native';
const winSize = Dimensions.get('window');
const dWidth = 412;
const dPixelRatio = 1;
const dWidthPt = dWidth / dPixelRatio;
const scale = calScale();
const fScale = scale;
/**
 * @returns {Number} scale
 */
function calScale() {
    let scale;
    if (winSize.width >= dWidthPt) {
        scale = 1;
    } else if (winSize.width <= 380) {
        scale = (1.07 * winSize.width) / dWidthPt;
    } else {
        scale = (1.02 * winSize.width) / dWidthPt;
    }
    return scale;
}
function px2pt(px) {
    return (px * scale) / dPixelRatio;
}

function fpx2pt(px) {
    return (px * fScale) / dPixelRatio;
}
function reactNativeSize(funcName) {
    return function(target, name, desc) {
        // console.log(target)
        // const keys=Object.keys(target)
        if (Object.getOwnPropertyDescriptor(target, name) !== undefined) {
            target[name] = changePropertyValue(funcName, target[name]);
        } else {
            // means maybe its a class and haven't be inited,so changed the setter
            //force init to get the value
            let value = desc.initializer ? desc.initializer() : desc.value;
            value = changePropertyValue(funcName, value);
            Object.defineProperty(target, name, {
                get() {
                    return value;
                },
                set(x) {
                    value = px2pt(x);
                },
                configurable: true, //just prevent the error caused by hot reload
            });
        }

        return target;
    };
}
function changePropertyValue(funcName, prop) {
    let value = 0;
    switch (funcName) {
        case 'px2pt':
            value = px2pt(prop);
            break;
        case 'fpx2pt':
            value = fpx2pt(prop);
            break;
        default:
            console.log(funcName);
    }
    return value;
}

module.exports = reactNativeSize;
