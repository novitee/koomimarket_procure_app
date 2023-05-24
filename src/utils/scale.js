
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const baseWidth = 428;
const baseHeight = 926;


const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;
const scaleNumber = Math.min(scaleWidth, scaleHeight);

export const scale = (size) => Math.ceil((size * scaleNumber));