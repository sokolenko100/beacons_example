import values from './values';
import EStyleSheet from 'react-native-extended-stylesheet';
import originSkin from './skin';
const get = global.need('lodash.get');
const skin = {};
for (const [key, value] of Object.entries(originSkin)) {

    skin[key] = get(values, value);

}
// put skin to EStyleSheet global var
EStyleSheet.build({
    $theme: 'default',
    ...skin,
});
export default skin;
